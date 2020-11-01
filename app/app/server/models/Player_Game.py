from pydantic import BaseModel, EmailStr
from typing import Optional


class Player(BaseModel):  
    player_name: str
    is_alive: bool = True
    role: str 
    loyalty: str
    status: str
    associated_game: Optional[int] # Game.id

class Game(BaseModel):
    id_game: int
    game_name: str
    password: Optional[str] = None
    num_players: int
    started: bool

class Response_App(BaseModel):
     code: int
     description: str
    
class Envelopes(BaseModel):
     gamename: str
     role: str
     loyalty: str
     occupied: bool
    

