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
    bellatrix = 'BELLATRIX'
    dolores = 'DOLORES'
    draco = 'DRACO'
    dumbledore = 'DUMBLEDORE'
    fred = 'FRED'
    george = 'GEORGE'
    harry = 'HARRY'
    hermione = 'HERMIONE'
    lucius = 'LUCIUS'
    neville = 'NEVILLE'
    ron = 'RON'
    sirius = 'SIRIUS'
    snape = 'SNAPE'
    voldemort = 'VOLDEMORT'

class Loyalty(str, Enum):
    phoenix_order = 'PHOENIX_ORDER'
    death_eaters = 'DEATH_EATERS'

class Spell(str, Enum):
    crucio = 'CRUCIO'
    avada_kedavra = 'AVADA_KEDAVRA'
    imperius = 'IMPERIUS'
    adivination = 'ADIVINATION'
