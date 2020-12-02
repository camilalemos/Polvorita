from pony.orm import Database, PrimaryKey, Optional, Required


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
        if username:
            self.username = username
        if full_name:
            self.full_name = full_name
        if new_password:
            self.password = new_password

        return self

db.generate_mapping(create_tables=True)
