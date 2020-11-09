from typing import Optional, List, Dict, Set
import random, math

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
        for i in range(6):
            self.proclamations.append('PHOENIX_ORDER')
        for i in range(11):
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
    min_players: int = 5
    max_players: int = 5
    num_players: int = 0
    players: Dict[str, Player] = {}
    board: Board = None
    elections: Elections = None
    spells: List[Spell] = []
    chat: List[str] = []

    def exist(self, username: str):
        users = [player.user_name for player in self.players.values()]
        return username in users

    def owner(self):
        return list(self.players.values())[0].user_name

    def create_player(self, player_name: str, username: str):
        self.players[player_name] = Player(name=player_name, user_name=username)
        self.num_players += 1

    def delete_player(self, player_name: str):
        self.players.pop(player_name)
        self.num_players -= 1

    def assign_roles(self):
        to_assign_phoenix_order = [player for player in self.players.values() if player.loyalty == 'PHOENIX_ORDER']
        to_assign_death_eaters = [player for player in self.players.values() if player.loyalty == 'DEATH_EATERS']
        PO_roles = random.sample(phoenix_order_roles, len(PHOENIX_ORDER_ROLES))
        DE_roles = random.sample(death_eaters_roles, len(DEATH_EATERS_ROLES))
        to_assign_death_eaters.pop().role = 'VOLDEMORT'
        while to_assign_phoenix_order:
            to_assign_phoenix_order.pop().role = PO_roles.pop()
        while to_assign_death_eaters:
            to_assign_death_eaters.pop().role = DE_roles.pop()

    def assign_loyalties(self):
        num_death_eaters = math.ceil(self.num_players / 2)-1
        num_phoenix_order = self.num_players - num_death_eaters
        to_assign = random.sample(list(self.players.values()), self.num_players)
        for i in range(num_phoenix_order):
            to_assign.pop().loyalty = 'PHOENIX_ORDER'
        for i in range(num_death_eaters):
            to_assign.pop().loyalty = 'DEATH_EATERS'

    def start(self):
        self.status = 'STARTED'
        self.board = Board()
        self.board.init_board()
        self.assign_loyalties()
        self.assign_roles()
        self.elections = Elections()
        first_candidate = random.choice(list(self.players.keys()))
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
