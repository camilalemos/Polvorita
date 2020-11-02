from pony.orm import db_session, get, select, delete
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from typing import Optional

from fastapi import FastAPI, Depends, Form, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from pony.orm import db_session, get, select, delete, exists
from pydantic import BaseModel, EmailStr

from . import db
from .authentication import *
from .models.user import *
from .models.game import *
from .models.enums import *
from .wsmanager import *




app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



#ENACT PROCLAMATION
@app.put("/game/{game_name}/proclamation/")
async def enact_proclamation(game_name: str, player_name: str, loyalty: Loyalty, user: User = Depends(get_current_active_user)):
    game = manager.games.get(game_name)
    if game and game.game_status == 'STARTED':
        #if game.players.get(player_name).player_status == 'HEADMASTER':
        game.board.enact_proclamation(loyalty)
        game.finish_game()
        #else:
         #   raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only headmaster can enact proclamation")
    else:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Game not found")
    
    return game
