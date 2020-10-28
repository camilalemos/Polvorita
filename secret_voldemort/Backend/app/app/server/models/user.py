from pydantic import BaseModel, EmailStr
from typing import Optional


#User Model
class User(BaseModel):
    username: str
    email: EmailStr
    hashed_password: str
    full_name: Optional[str] = ""
    player_name: str = ""
    disabled: bool = False 
