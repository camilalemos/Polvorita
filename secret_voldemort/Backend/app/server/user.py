from pydantic import BaseModel, EmailStr
from typing import Optional


#User Model
class User(BaseModel):
    username: str
    email: EmailStr
    password: str
    full_name: Optional[str] = None
    disabled: bool = False
