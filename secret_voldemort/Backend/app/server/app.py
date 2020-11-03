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



#JOIN GAME
@app.put("/game/", response_model=Game)
async def join_game(game_name: str = Form(..., min_length=5, max_length=20, regex="^[A-Z_a-z0-9]*$")),
                    player_name: str = Form(..., min_length=3, max_length=10, regex="^[A-Z_a-z0-9]*$")),
                    password: Optional[str] = Form(None, min_length=5, max_length=10, regex="^[A-Za-z0-9]*$")),
                    user: User = Depends(get_current_active_user)):
    game = manager.games.get(game_name)
    if not game:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Game not found")
    elif game.password != password:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Wrong password")
    elif player_name in game.players:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Player name already exist in this game")
    elif len(game.players) == game.num_players:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Game full")
    else:
        player = Player(name=player_name, game_name=game_name)
        game.players[player_name] = player
        manager.players[player_name] = player

    return game

#START GAME
@app.put("/game/start/{player_name}", response_model=Game)
async def start_game(player_name: str, user: User = Depends(get_current_active_user)):
    game_name = manager.players.get(player_name).game_name
    game = manager.games.get(game_name)
    if not game:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Game not found")
    elif game.game_status != 'CREATED':
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Game already started")
    elif game.owner_name != player_name:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only game owner can start the game")
    elif len(game.players) != game.num_players:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enough players")
    else:
        game.start()

    return game

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
