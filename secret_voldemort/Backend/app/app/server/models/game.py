from typing import Optional, List, Dict

from fastapi import HTTPException, status
from pydantic import BaseModel, EmailStr

from .enums import *



class Player(BaseModel):
    player_name: str
    is_alive: bool = True
    role: Role = None
    loyalty: Loyalty = None
    player_status: PlayerStatus = None

    def kill(self):
        self.is_alive = True

class Elections(BaseModel):
    minister_candidate: Player = None
    headmaster_candidate: Player = None
    votes: Dict[str, Vote] = {}

class Board(BaseModel):
    phoenix_order_proclamations: int = 0
    death_eaters_proclamations: int = 0
    proclamations: List[Loyalty] = []
    enacted_proclamations: List[Loyalty] = []
    discarded_proclamations: List[Loyalty] = []
    spells: List[Spell] = []
    elections: Elections = None

    def init_board(self):
        self.elections = Elections()

    def enact_proclamation(self, loyalty: Loyalty):
        if loyalty == 'PHOENIX_ORDER':
            self.phoenix_order_proclamations += 1
        elif loyalty == 'DEATH_EATERS':
            self.death_eaters_proclamations += 1

class Game(BaseModel):
    game_name: str
    owner_name: str
    password: Optional[str] = None
    num_players: int = 5
    winner: Loyalty = None
    players: Dict[str, Player] = {}
    game_status: GameStatus = 'CREATED'
    board: Board = None
    chat: List[str] = []

    def start(self):
        if self.game_status == 'CREATED' and len(self.players) == self.num_players:
            self.game_status = 'STARTED'
            self.board = Board()
            self.board.init_board()
        else:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Game must have 5 players")

    def finish_game(self):
        if self.game_status == 'STARTED' and self.board.phoenix_order_proclamations == 5:
            self.winner = Loyalty('PHOENIX_ORDER')
            self.game_status = 'FINISHED'

        elif self.game_status == 'STARTED' and self.board.death_eaters_proclamations == 6:
            self.winner = Loyalty('DEATH_EATERS')
            self.game_status = 'FINISHED'
