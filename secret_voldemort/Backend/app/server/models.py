from typing import Optional, List, Dict

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
    full_name: Optional[str] = None
    disabled: bool = False

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
