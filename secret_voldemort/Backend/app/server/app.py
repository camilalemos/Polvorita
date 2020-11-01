from datetime import datetime, timedelta
from typing import Optional

from fastapi import FastAPI, Depends, Form, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel, EmailStr
from pony.orm import db_session, get, select, delete, exists

from .authentication import *
from .wsmanager import *
from .models import *
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

#JOIN GAME
@app.put("/game/")
async def join_game(game_name: str = Form(...),
                    player_name: str = Form(...),
                    password: Optional[str] = Form(None),
                    user: User = Depends(get_current_active_user)):
    games = [n for n in manager.active_games if n.game_name == game_name]
    if not games:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Game not found")
    else:
        game = games[0]
        password_match = game.password == password
        player_exist = [n for n in game.players if n.player_name == player_name]
        if player_exist:
            raise HTTPException(status_code=403, detail="Player name already exist in this game")
        elif not password_match:
            raise HTTPException(status_code=401, detail="Wrong password")
        else:
            player = Player(player_name=player_name)
            game.players.append(player)

    return game

@app.get("/")
async def get():
    return HTMLResponse(html)

@app.websocket("/lobby/")
async def websocket_lobby(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive()
            games = [n.dict() for n in manager.active_games if n.game_status == 'CREATED']
            await manager.broadcast_json(f"Games: {games}")
    except WebSocketDisconnect:
        manager.disconnect(websocket)
