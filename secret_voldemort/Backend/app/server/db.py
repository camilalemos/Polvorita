from datetime import date

from pony.orm import Database, PrimaryKey, Optional, Required, Set
from .enums import *

db = Database()
db.bind(provider='sqlite', filename='database.sqlite', create_db=True)

class User(db.Entity):
    id = PrimaryKey(int, auto=True)
    username = Required(str, unique=True)
    email = Required(str, unique=True)
    password = Required(str)
    full_name = Optional(str)
    disabled = Required(bool)

db.generate_mapping(create_tables=True)
