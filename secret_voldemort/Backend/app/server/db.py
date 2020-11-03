from pony.orm import *


db = Database()

# User Entity 
class User(db.Entity):
    id = PrimaryKey(int, auto=True)
    username = Required(str, unique=True)
    email = Required(str, unique=True)
    password = Required(str)
    full_name = Optional(str)
    disabled = Required(bool)

# Connecting the `db` object with the database
db.bind('sqlite', 'dataBase.sqlite', create_db=True) 

# Generating the databases
db.generate_mapping(create_tables=True) 