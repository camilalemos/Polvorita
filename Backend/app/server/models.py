from typing import Optional, List, Dict, Set
import random

from fastapi import HTTPException, status
from pydantic import BaseModel, EmailStr

from .enums import *


class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    login_id: Optional[str] = None

class User(BaseModel):
    username: str
    email: EmailStr
    password: str
    full_name: str = ''
    disabled: bool = False

class Player(BaseModel):
    name: str
    user_name: str
    is_alive: bool = True
    role: Role = None
    loyalty: Loyalty = None
    status: PlayerStatus = 'COMMON'

    def kill(self):
        self.is_alive = True

class Elections(BaseModel):
    minister_candidate: str = None
    headmaster_candidate: str = None
    votes: Dict[str, Vote] = {}

    def nominate(self, status: PlayerStatus, player_name: str):
        if status not in ['MINISTER', 'HEADMASTER']:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Not a valid nomination")
        elif status == 'MINISTER':
            self.minister_candidate = player_name
        elif status == 'HEADMASTER':
            self.headmaster_candidate = player_name

class Board(BaseModel):
    proclamations: List[Loyalty] = []
    discarded_proclamations: List[Loyalty] = []
    PO_enacted_proclamations: int = 0
    DE_enacted_proclamations: int = 0

    def init_board(self):
        for i in range(0, 6):
            self.proclamations.append('PHOENIX_ORDER')
        for i in range(0, 11):
            self.proclamations.append('DEATH_EATERS')
        random.shuffle(self.proclamations)

    def get_3proclamations(self):
        if len(self.proclamations) >= 3:
            return [self.proclamations.pop(), self.proclamations.pop(), self.proclamations.pop()]
        else:
            self.proclamations.extend(self.discarded_proclamations)
            random.shuffle(self.proclamations)
            self.get_3proclamations()

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
    password: Optional[str] = None
    status: GameStatus = 'CREATED'
    winner: Loyalty = None
    max_players: int = 5
    players: Dict[str, Player] = {}
    board: Board = None
    elections: Elections = None
    spells: List[Spell] = []
    chat: List[str] = []

    def is_full(self):
        return len(self.players) == self.max_players

    def exist(self, username: str):
        users = [player.user_name for player in self.players.values()]
        return username in users

    def create_player(self, player_name: str, username: str):
        self.players[player_name] = Player(name=player_name, user_name=username)

    def owner(self):
        return list(self.players.values())[0].user_name

    def start(self):
        self.status = 'STARTED'
        self.board = Board()
        self.board.init_board()
        self.elections = Elections()
        first_candidate = random.choice(list(self.players.values())).name
        self.elections.nominate('MINISTER', first_candidate)

    def finish(self, manager):
        if self.status == 'STARTED' and self.board.PO_enacted_proclamations == 5:
            self.winner = 'PHOENIX_ORDER'
            self.status = 'FINISHED'
            manager.delete_game(self.name)
        elif self.status == 'STARTED' and self.board.DE_enacted_proclamations == 6:
            self.winner = 'DEATH_EATERS'
            self.status = 'FINISHED'
            manager.delete_game(self.name)