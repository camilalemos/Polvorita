from pydantic import BaseModel, EmailStr
from typing import Optional


#User Model
class User(BaseModel):
    userName: str
    email: EmailStr
    password: str
    fullName: str = ""
    playerName: str = ""
    activeSession: bool = False 
