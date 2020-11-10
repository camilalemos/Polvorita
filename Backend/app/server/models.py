from typing import Optional, List, Dict
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
    game_name: str
    is_alive: bool = True
    role: Role = None
    loyalty: Loyalty = None
    status: PlayerStatus = 'COMMON'

    def kill(self):
        self.is_alive = True
    
class Elections(BaseModel):
    minister_candidate: str = None
    headmaster_candidate: str = None
    last_minister: str = None #
    last_headmaster: str = None #
    governments_rejected: int = 0 #
    votes: Dict[str, Vote] = {}

    def nominate(self, status: PlayerStatus, player_name: str):
        if status not in ['MINISTER', 'HEADMASTER']:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Not a valid nomination")
        elif status == 'MINISTER':
            self.minister_candidate = player_name
        elif status == 'HEADMASTER':
            self.headmaster_candidate = player_name
    def last_minister_headmaster(self,minister,headmaster):#
        self.last_minister   = minister
        self.last_headmaster = headmaster
    def votation(self,player_name,vote):#
        self.votes[player_name] = vote
    def vote_lumos(self):#
        return  sum(map(("LUMOS").__eq__, self.votes.values()))
    def vote_nox(self):#
        return  sum(map(("NOX").__eq__, self.votes.values()))
    def check_votes(self,total_votes):#
        return (sum(map(len, self.votes.values())) < total_votes)
    def rejected(self):#
        self.governments_rejected += 1
    def new_shift(self,new_candidate):#      
        self.nominate('MINISTER', new_candidate)
        self.nominate('HEADMASTER', None)
        self.votes = {}
        return new_candidate

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
    owner_username: str
    owner_name: str
    password: Optional[str] = None
    status: GameStatus = 'CREATED'
    winner: Loyalty = None
    min_players: int = 5
    max_players: int = 5
    num_players: int = 0   
    players: Dict[str, Player] = {}   
    board: Board = None
    elections: Elections = None
    spells: List[Spell] = []
    chat: List[str] = []

    def is_full(self):
        return len(self.players) == self.max_players

    def create_player(self, player_name: str, username: str):
        self.users.add(username)
        player = Player(name=player_name, user_name=username)
        self.players[player_name] = player

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
    def new_minister_director(self,minister,headmaster):#
        self.players.get(minister).status = 'MINISTER'
        self.players.get(headmaster).status = 'HEADMASTER'
    def status_game(self,state):#
        return self.status != state
    def reset_state_common(self):
        for player in self.players.values():
             player.status = 'COMMON'
