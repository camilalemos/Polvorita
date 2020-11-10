from pony.orm import Database, db_session, PrimaryKey, Optional, Required
from pydantic import EmailStr




db = Database()
db.bind(provider='sqlite', filename='database.sqlite', create_db=True)


class User(db.Entity):
    id = PrimaryKey(int, auto=True)
    username = Required(str, unique=True)
    email = Required(str, unique=True)
    password = Required(str)
    full_name = Optional(str)
    disabled = Required(bool)        

    def update(self, email, username, full_name, new_password):
        if email:
            self.email = email
        elif username:
            self.username = username
        elif full_name:
            self.full_name = full_name
        elif new_password:
            self.password = new_password

        return self

db.generate_mapping(create_tables=True)