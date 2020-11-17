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

    def kill(self):
        self.is_alive = False

class Elections(BaseModel):
    minister_candidate: str = None
    headmaster_candidate: str = None
    minister: str = None
    headmaster: str = None
    rejected: int = 0
    votes: Dict[str, Vote] = {}
    minister_idx = 0

    def init(self, players: List[str]):
        self.minister_idx = random.choice(range(len(players)))
        self.minister_candidate = players[self.minister_idx]

    def nominate(self, nomination: Nomination, candidate: str):
        if nomination == 'MINISTER':
            self.minister_candidate = candidate
        elif nomination == 'HEADMASTER':
            self.headmaster_candidate = candidate

    def vote(self, player_name: str, vote: Vote):
        self.votes[player_name] = vote

    def get_result(self):
        lumos_votes = sum(map(('LUMOS').__eq__, self.votes.values()))
        nox_votes = sum(map(('NOX').__eq__, self.votes.values()))
        return 'NOX' if lumos_votes < nox_votes else 'LUMOS'

    def set_result(self, players: List[str]):
        if self.get_result() == 'NOX':
            self.rejected += 1
        else:
            self.rejected = 0
            self.minister = self.minister_candidate
            self.headmaster = self.headmaster_candidate

        self.minister_idx = (self.minister_idx + 1) % len(players)
        self.minister_candidate = players[self.minister_idx]
        self.headmaster_candidate = None
        self.votes.clear()

class Proclamations(BaseModel):
    proclamations: List[Loyalty] = []
    discarded_proclamations: List[Loyalty] = []
    PO_enacted_proclamations: int = 0
    DE_enacted_proclamations: int = 0

    def init(self):
        for i in range(6):
            self.proclamations.append('PHOENIX_ORDER')
        for i in range(11):
            self.proclamations.append('DEATH_EATERS')
        random.shuffle(self.proclamations)

    def shuffle(self):
        if len(self.proclamations) < 3:
            self.proclamations.extend(self.discarded_proclamations)
            random.shuffle(self.proclamations)

    def get_proclamations(self, num_proclamations: int):
        self.shuffle()
        result = []
        for i in range(num_proclamations):
            result.append(self.proclamations.pop())
        return result

    def enact(self, loyalty: Loyalty):
        if loyalty == 'PHOENIX_ORDER':
            self.PO_enacted_proclamations += 1
        elif loyalty == 'DEATH_EATERS':
            self.DE_enacted_proclamations += 1

    def discard(self, loyalty: Loyalty):
        self.discarded_proclamations.append(loyalty)

class Game(BaseModel):
    name: str
    password: Optional[str] = None
    status: GameStatus = 'CREATED'
    winner: Loyalty = None
    min_players: int = 5
    max_players: int = 5
    num_players: int = 0
    voldemort: str = None
    players: Dict[str, Player] = {}
    proclamations: Proclamations = None
    elections: Elections = None
    spells: List[Spell] = ['ADIVINATION', 'AVADA_KEDAVRA', 'CRUCIO', 'IMPERIUS']
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
        PO_roles = random.sample(PHOENIX_ORDER_ROLES, len(PHOENIX_ORDER_ROLES))
        DE_roles = random.sample(DEATH_EATERS_ROLES, len(DEATH_EATERS_ROLES))
        voldemort = to_assign_death_eaters.pop()
        voldemort.role = 'VOLDEMORT'
        self.voldemort = voldemort.name
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
        self.proclamations = Proclamations()
        self.proclamations.init()
        self.assign_loyalties()
        self.assign_roles()
        self.elections = Elections()
        self.elections.init(list(self.players))

    def cast_spell(self, spell: Spell, target: str):
        self.spells.remove(spell)
        if spell == 'ADIVINATION':
            self.proclamations.shuffle()
            return [self.proclamations.proclamations[0],
                    self.proclamations.proclamations[1],
                    self.proclamations.proclamations[2]]
        elif spell == 'AVADA_KEDAVRA':
            self.players[target].kill()
            return self

    def get_winner(self):
        if self.proclamations.PO_enacted_proclamations == 5:
            self.winner = 'PHOENIX_ORDER'
        elif self.proclamations.DE_enacted_proclamations == 6:
            self.winner = 'DEATH_EATERS'
        elif not self.players[self.voldemort].is_alive:
            self.winner = 'PHOENIX_ORDER'
        elif self.elections.headmaster == self.voldemort and self.proclamations.DE_enacted_proclamations >= 3:
            self.winner = 'DEATH_EATERS'

        return self.winner

    def finish(self, manager):
        self.status = 'FINISHED'
        manager.delete_game(self.name)
