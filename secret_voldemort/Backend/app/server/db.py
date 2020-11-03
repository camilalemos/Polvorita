from pony.orm import Database, PrimaryKey, Optional, Required


db = Database()
# Connecting the `db` object with the database
db.bind(provider='sqlite', filename='database.sqlite', create_db=True)


# User Entity 
class User(db.Entity):
    id = PrimaryKey(int, auto=True)
    username = Required(str, unique=True)
    email = Required(str, unique=True)
    password = Required(str)
    full_name = Optional(str)
    disabled = Required(bool)

# Generating the databases
db.generate_mapping(create_tables=True) 

