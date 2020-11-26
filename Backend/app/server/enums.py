from enum import Enum


class GameStatus(str, Enum):
    created = 'CREATED'
    started = 'STARTED'
    finished = 'FINISHED'

class Nomination(str, Enum):
    minister = 'MINISTER'
    headmaster = 'HEADMASTER'

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

PHOENIX_ORDER_ROLES = ['DUMBLEDORE', 'FRED', 'GEORGE', 'HARRY', 'HERMIONE', 'NEVILLE', 'RON', 'SIRIUS', 'SNAPE']
DEATH_EATERS_ROLES = ['BELLATRIX', 'DOLORES', 'DRACO', 'LUCIUS', 'SNAPE']

class Loyalty(str, Enum):
    phoenix_order = 'PHOENIX_ORDER'
    death_eaters = 'DEATH_EATERS'

class Spell(str, Enum):
    adivination = 'DIVINATION'
    avada_kedavra = 'AVADA_KEDAVRA'
    crucio = 'CRUCIO'
    imperius = 'IMPERIO'
