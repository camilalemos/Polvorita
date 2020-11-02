from enum import Enum


class GameStatus(str, Enum):
    created = 'CREATED'
    started = 'STARTED'
    finished = 'FINISHED'

class PlayerStatus(str, Enum):
    minister = 'MINISTER'
    headmaster = 'HEADMASTER'
    common = 'COMMON'

class Vote(str, Enum):
    lumos = 'LUMOS'
    nox = 'NOX'

class Role(str, Enum):
    voldemort = 'VOLDEMORT'
    harry = 'SNAPE'

class Loyalty(str, Enum):
    phoenix_order = 'PHOENIX_ORDER'
    death_eaters = 'DEATH_EATERS'

class Spell(str, Enum):
    crucio = 'CRUCIO'
    avadakedavra = 'AVADAKEDAVRA'
    imperius = 'IMPERIUS'
    guessing = 'GUESSING'
