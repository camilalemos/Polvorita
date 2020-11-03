from typing import Optional, List, Dict, Tuple
import random
from fastapi import HTTPException, status
from pydantic import BaseModel, EmailStr

from .enums import *


class User(BaseModel):
    username: str
    email: EmailStr
    password: str
    full_name: Optional[str] = None
    disabled: bool = False
