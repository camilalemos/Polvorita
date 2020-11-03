from datetime import date
from typing import Set, Optional, List, Tuple

from pydantic import BaseModel, EmailStr



class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
	login_id: Optional[str] = None

