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
    game = manager.games.get(game_name)
    if not game:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Game not found")
    elif len(game.players) == game.num_players:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Game full")
    else:
        password_match = game.password == password
        if player_name in game.players:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Player name already exist in this game")
        elif not password_match:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Wrong password")
        else:
            player = Player(player_name=player_name)
            game.players[player_name] = player

    return game

#START GAME
@app.put("/game/{game_name}")
async def start_game(game_name: str, player_name: str, user: User = Depends(get_current_active_user)):
    game = manager.games.get(game_name)
    if game:
        if game.owner_name == player_name:
            game.start()
        else:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only game owner can start the game")
    else:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Game not found")
    
    return game


@app.websocket("/lobby/")
async def websocket_lobby(websocket: WebSocket):
    await manager.connect_lobby(websocket)
    try:
        while True:
            await websocket.receive_text()
            games = [game.dict() for game in manager.games.values() if game.game_status == 'CREATED']
            await manager.broadcast_json(games, manager.lobby_connections)

    except WebSocketDisconnect:
        manager.disconnect_lobby(websocket)

@app.websocket("/game/{game_name}")
async def websocket_game(websocket: WebSocket, game_name: str):
    await manager.connect_game(websocket, game_name)
    try:
        while True:
            await websocket.receive()
            if game_name in manager.games:
                game = manager.games.get(game_name).dict()
                connections = manager.game_connections.get(game_name)
                await manager.broadcast_json(game, connections)

    except Exception:
        manager.disconnect_game(websocket, game_name)
