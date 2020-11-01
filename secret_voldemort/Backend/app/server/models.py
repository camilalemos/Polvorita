from datetime import date
from typing import Set, Optional, List, Tuple

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

class Board(BaseModel):
    phoenixOrderProclamations: int
    deathEatersProclamations: int
    proclamations: List[Loyalty]
    enactedProclamations: List[Loyalty]
    discardedProclamations: List[Loyalty]
    spells: List[Spell]

class Candidates(BaseModel):
    minister_player_id: int
    headmaster_player_id: int

class Vote(BaseModel):
    vote: bool
    player_id: int

class Elections(BaseModel):
    candidates: Candidates
    votes: List[Vote]

class Game(BaseModel):
    game_name: str
    password: Optional[str] = None
    num_players: int = 5
    players: List[Player] = list()
    game_status: GameStatus = 'CREATED'
    chat: List[str] = []
    board: Board = None
    elections: Elections = None
