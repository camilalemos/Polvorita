from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from typing import Optional

from fastapi import FastAPI, Depends, Form, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from pony.orm import db_session, get, select, delete, exists
from pydantic import BaseModel, EmailStr

from .authentication import *
from .wsmanager import *
from .user import *
from .game import *
from .enums import *
from .db import db


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
@app.put("/game/proclamation/{player_name}", response_model=Game)
async def enact_proclamation(player_name: str, loyalty: Loyalty, user: User = Depends(get_current_active_user)):
    if loyalty not in ['PHOENIX_ORDER', 'DEATH_EATERS']:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Not a valid loyalty")

    game_name = manager.players.get(player_name).game_name
    game = manager.games.get(game_name)
    if not game:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Game not found")
    elif game.game_status != 'STARTED':
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Game not started")
    elif game.players.get(player_name).player_status != 'HEADMASTER':
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only headmaster can enact proclamation")
    else:
        game.board.enact_proclamation(loyalty)
        game.finish()
    
    return game

