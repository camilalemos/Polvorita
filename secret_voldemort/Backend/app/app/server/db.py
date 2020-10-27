from pony.orm import *


db = Database()

# User Entity 
class User(db.Entity):
    id = PrimaryKey(int, auto=True)
    userName = Required(str, 20, unique=True)
    email = Required(str, unique=True)
    password = Required(str, 20)
    fullName = Optional(str)
    activeSession = Required(bool)
    playerName = Optional(str)

# Connecting the `db` object with the database
db.bind('sqlite', 'dataBase.sqlite', create_db=True) 

# Generating the databases
db.generate_mapping(create_tables=True) 