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
    players: List[str] = None
    votes: Dict[str, Vote] = {}
    result: Vote = None
    rejected: int = 0

    def init(self, players: List[str]):
        self.players = random.sample(players, len(players))
        self.minister_candidate = self.players[0]

    def nominate(self, nomination: Nomination, candidate: str):
        if nomination == 'MINISTER':
            self.minister_candidate = candidate
        elif nomination == 'HEADMASTER':
            self.headmaster_candidate = candidate

    def vote(self, player_name: str, vote: Vote):
        self.votes[player_name] = vote
        if len(self.votes) == len(self.players):
            self.set_result()

    def check_for_chaos(self):
        if self.rejected == 3:
            self.rejected = 0
            return True
        else:
            return False

    def get_result(self):
        lumos_votes = sum(map(('LUMOS').__eq__, self.votes.values()))
        nox_votes = sum(map(('NOX').__eq__, self.votes.values()))
        return 'NOX' if lumos_votes < nox_votes else 'LUMOS'

    def set_result(self):
        self.result = self.get_result()
        if self.result == 'NOX':
            self.rejected += 1
        else:
            self.rejected = 0
            self.minister = self.minister_candidate
            self.headmaster = self.headmaster_candidate

        self.players.insert(len(self.players), self.players.pop(0))
        self.minister_candidate = self.players[0]
        self.headmaster_candidate = None
        self.votes.clear()

class Proclamations(BaseModel):
    deck: List[Loyalty] = []
    hand: List[Loyalty] = []
    discarded: List[Loyalty] = []
    PO_enacted_proclamations: int = 0
    DE_enacted_proclamations: int = 0
    headmaster_exp: bool = False

    def init(self):
        for i in range(6):
            self.deck.append('PHOENIX_ORDER')
        for i in range(11):
            self.deck.append('DEATH_EATERS')
        random.shuffle(self.deck)

    def shuffle(self):
        if len(self.deck) < 3:
            self.deck.extend(self.discarded)
            random.shuffle(self.deck)
            self.discarded.clear()

    def get_proclamations(self, num_proclamations: int):
        self.shuffle()
        for i in range(num_proclamations):
            self.hand.append(self.deck.pop(0))

    def enact(self):
        loyalty = self.hand.pop()
        if loyalty == 'PHOENIX_ORDER':
            self.PO_enacted_proclamations += 1
        elif loyalty == 'DEATH_EATERS':
            self.DE_enacted_proclamations += 1

    def discard(self, loyalty: Loyalty):
        self.hand.remove(loyalty)
        self.discarded.append(loyalty)
        if len(self.hand) == 1:
            self.enact()

    def expelliarmus(self, minister_exp: bool):
        if minister_exp and self.headmaster_exp:
            for i in range(2):
                loyalty = self.hand.pop()
                self.discarded.append(loyalty)
            self.headmaster_exp = False

class Game(BaseModel):
    name: str
    password: Optional[str] = None
    status: GameStatus = 'CREATED'
    winner: Loyalty = None
    min_players: int = 5
    max_players: int
    num_players: int = 0
    owner: str = None
    voldemort: str = None
    players: Dict[str, Player] = {}
    proclamations: Proclamations = None
    elections: Elections = None
    spells: List[Spell] = []
    chat: List[str] = []

    def exist(self, username: str):
        users = [player.user_name for player in self.players.values()]
        return username in users

    def create_player(self, player_name: str, username: str):
        self.players[player_name] = Player(name=player_name, user_name=username)
        self.num_players += 1
        self.send_message(f"{player_name} has joined the room!", "system")

    def delete_player(self, player_name: str):
        player = self.players.pop(player_name)
        self.num_players -= 1
        self.send_message(f"{player_name} has left the room!", "system")
        if player.user_name == self.owner and self.num_players:
            self.owner = random.choice(list(self.players.values())).user_name

    def start(self):
        self.status = 'STARTED'
        self.proclamations = Proclamations()
        self.proclamations.init()
        self.assign_loyalties()
        self.assign_roles()
        self.assign_spells()
        self.elections = Elections()
        self.elections.init(list(self.players))
        self.send_message("Game started!", "system")

    def assign_loyalties(self):
        num_death_eaters = math.ceil(self.num_players / 2)-1
        num_phoenix_order = self.num_players - num_death_eaters
        to_assign = random.sample(list(self.players.values()), self.num_players)
        for i in range(num_phoenix_order):
            to_assign.pop().loyalty = 'PHOENIX_ORDER'
        for i in range(num_death_eaters):
            to_assign.pop().loyalty = 'DEATH_EATERS'

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

    def assign_spells(self):
        if self.num_players in range(5, 7):
            self.spells = ['NONE_SPELL', 'NONE_SPELL', 'NONE_SPELL', 'DIVINATION', 'AVADA_KEDAVRA', 'AVADA_KEDAVRA']
        elif self.num_players in range(7, 9):
            self.spells = ['NONE_SPELL', 'NONE_SPELL', 'CRUCIO', 'IMPERIO', 'AVADA_KEDAVRA', 'AVADA_KEDAVRA']
        elif self.num_players in range(9, 11):
            self.spells = ['NONE_SPELL', 'CRUCIO', 'CRUCIO', 'IMPERIO', 'AVADA_KEDAVRA', 'AVADA_KEDAVRA']

    def cast_spell(self, target: str):
        result = self
        spell = self.spells[self.proclamations.DE_enacted_proclamations]
        if spell == 'DIVINATION':
            self.proclamations.shuffle()
            result = self.proclamations.deck[:3]
            self.send_message("The Minister of Magic has used the DIVINATION spell!", "system")
        elif spell == 'AVADA_KEDAVRA':
            if not target:
                raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Target not selected")
            self.players[target].kill()
            self.send_message(f"The Minister of Magic has used the AVADA KEDAVRA spell against {target}!", "system")
        elif spell == 'CRUCIO':
            result = self.players[target].loyalty
            self.send_message(f"The Minister of Magic has used the CRUCIO spell against {target}!", "system")
        elif spell == 'IMPERIO':
            if not target:
                raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Target not selected")
            self.elections.nominate('MINISTER', target)
            self.send_message(f"The Minister of Magic has used the IMPERIO spell against {target}!", "system")
        elif spell == 'NONE_SPELL':
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Spell is not available")

        self.spells[self.proclamations.DE_enacted_proclamations] = 'NONE_SPELL'
        return result

    def check_win(self):
        if self.proclamations.PO_enacted_proclamations == 5:
            self.winner = 'PHOENIX_ORDER'
            self.send_message(f"The game is over, the Order of the Phoenix has enacted 5 proclamations and wins the match!", "system")
        elif self.proclamations.DE_enacted_proclamations == 6:
            self.winner = 'DEATH_EATERS'
            self.send_message(f"The game is over, the Death Eaters has enacted 6 proclamations and wins the match!", "system")
        elif not self.players[self.voldemort].is_alive:
            self.winner = 'PHOENIX_ORDER'
            self.send_message(f"The game is over, Voldemort has been executed and the Order of the Phoenix wins the match!", "system")
        elif self.elections.headmaster == self.voldemort and self.proclamations.DE_enacted_proclamations >= 3:
            self.winner = 'DEATH_EATERS'
            self.send_message(f"The game is over, Voldemort has been promoted to Headmaster and the Death Eaters wins the match!", "system")

        if self.winner:
            self.status = 'FINISHED'

    def send_message(self, msg: str, player_name: str):
        self.chat.append(f"{player_name}: {msg}")

    def finish(self):
        self.status = 'FINISHED'
