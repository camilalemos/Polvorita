from typing import Optional, List, Dict, Tuple
import random
from fastapi import HTTPException, status
from pydantic import BaseModel, EmailStr

from .enums import *


class Player(BaseModel):
    name: str
    game_name: str
    is_alive: bool = True
    role: Role = None
    loyalty: Loyalty = None
    player_status: PlayerStatus = 'HEADMASTER'

    def kill(self):
        self.is_alive = True

class Elections(BaseModel):
    minister_candidate: str = None
    headmaster_candidate: str = None
    votes: Dict[str, Vote] = {}

    def nominate(self, player_status: PlayerStatus, player_name: str):
        if player_status not in ['MINISTER', 'HEADMASTER']:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Not a valid nomination")
        elif player_status == 'MINISTER':
            self.minister_candidate = player_name
        elif player_status == 'HEADMASTER':
            self.headmaster_candidate = player_name

class Board(BaseModel):
    proclamations: List[Loyalty] = []
    PO_enacted_proclamations: int = 0
    PO_discarded_proclamations: int = 0
    DE_enacted_proclamations: int = 0
    DE_discarded_proclamations: int = 0
    spells: List[Spell] = []

    def init_board(self):
        self.shuffle_proclamations(6, 11)

    def shuffle_proclamations(self, a: int, b: int):
        PO, DE = a, b
        while PO != 0 or DE != 0:
            proclamation = random.choice(list(Loyalty))
            if proclamation == 'PHOENIX_ORDER' and PO != 0:
                self.proclamations.append(proclamation)
                PO -= 1
            if proclamation == 'DEATH_EATERS' and DE != 0:
                self.proclamations.append(proclamation)
                DE -= 1

    def get_proclamation(self):
        try:
            return self.proclamations.pop()
        except Exception:
            PO = self.PO_discarded_proclamations
            DE = self.DE_discarded_proclamations
            self.shuffle_proclamations(PO, DE)

    def enact_proclamation(self, loyalty: Loyalty):
        if loyalty == 'PHOENIX_ORDER':
            self.PO_enacted_proclamations += 1
        elif loyalty == 'DEATH_EATERS':
            self.DE_enacted_proclamations += 1
    def discard_proclamation(self, loyalty: Loyalty):
        if loyalty == 'DEATH_EATERS':
            self.PO_discarded_proclamations += 1
        elif loyalty == 'DEATH_EATERS':
            self.DE_discarded_proclamations += 1

class Game(BaseModel):
    name: str
    owner_name: str
    password: Optional[str] = None
    num_players: int = 5
    game_status: GameStatus = 'CREATED'
    players: Dict[str, Player] = {}
    winner: Loyalty = None
    board: Board = None
    elections: Elections = None
    chat: List[str] = []

    def start(self):
        self.game_status = 'STARTED'
        self.board = Board()
        self.board.init_board()
        self.elections = Elections()
        first_candidate = random.choice(list(self.players.values())).name
        self.elections.nominate('MINISTER', first_candidate)

    def finish(self):
        if self.game_status == 'STARTED' and self.board.PO_enacted_proclamations == 5:
            self.winner = 'PHOENIX_ORDER'
            self.game_status = 'FINISHED'
        elif self.game_status == 'STARTED' and self.board.DE_enacted_proclamations == 6:
            self.winner = 'DEATH_EATERS'
            self.game_status = 'FINISHED'