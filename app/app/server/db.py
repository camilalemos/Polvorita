from pony.orm import Database, Required, Optional, Database, Set
from pony.orm import *
from fastapi import FastAPI
#from .models.Enum import *

db = Database()


class Player(db.Entity):
	player_name   = Required(str)
	is_alive      = Required(bool, default=True)
	role          = Optional(str) 
	loyalty       = Optional(str)  
	status        = Optional(str)  
	associated_game = Optional(int) 
    

class Game(db.Entity):
	id_game     = Required(int)
	game_name   = Required(str)
	password    = Optional(str)
	num_players = Required(int,  default=5)
	started     = Optional(bool, default=False)
    

db.bind('sqlite', 'game_player.sqlite', create_db=True)  
db.generate_mapping(create_tables=True)  
