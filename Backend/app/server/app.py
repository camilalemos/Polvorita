from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext

from fastapi import FastAPI, Depends, Form, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from pony.orm import db_session, exists
from pydantic import EmailStr

from .authentication import *
from .wsmanager import *
from .models import *
from .enums import *
from .db import db


app = FastAPI()
manager = ConnectionManager()

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

#REGISTER
@app.post("/user/", status_code=201)
async def register_user(username: str = Form(..., min_length=5, max_length=20, regex="^[A-Z_a-z0-9]*$"),
                        email: EmailStr = Form(...),
                        password: str = Form(..., min_length=8, max_length=20, regex="^[A-Za-z0-9]*$")):
    with db_session:
        hashed_password = get_password_hash(password)
        user = User(username=username, email=email, password=hashed_password)

        try:
            user_id = db.User(**user.dict()).to_dict()['id']
        except Exception:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Username or E-mail already exist")

        return user_id

#LOGIN
@app.post("/login/", status_code=201, response_model=Token)
async def login_user(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(db.User, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer"}


#CHANGE PROFILE AND PASSWORD
@app.put("/user/", response_model=User)
async def change_profile(email: Optional[EmailStr] = Form(None),
                         username: Optional[str] = Form(None, min_length=5, max_length=20, regex="^[A-Z_a-z0-9]*$"),
                         full_name: Optional[str] = Form(None, min_length=5, max_length=30, regex="^[A-Z a-z0-9]*$"),
                         new_password: Optional[str] = Form(None, min_length=8, max_length=20, regex="^[A-Za-z0-9]*$"),
                         password: str = Form(..., min_length=8, max_length=20),
                         user: User = Depends(get_current_active_user)):
    with db_session:
        if username and db.User.exists(username=username):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Username already exist")    
        elif email and db.User.exists(email=email):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="E-mail already exist")

        if not verify_password(password, user.password):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect credentials")

        if new_password:
            new_password = get_password_hash(new_password)

        updated_user = get(p for p in db.User if p.id == user.id)
        updated_user = updated_user.update(email, username, full_name, new_password)

    return updated_user.to_dict()

#CREATE GAME
@app.post("/game/", status_code=201, response_model=Game)
async def create_game(game_name: str = Form(..., min_length=5, max_length=20, regex="^[A-Z_a-z0-9]*$"),
                      player_name: str = Form(..., min_length=3, max_length=15, regex="^[A-Z_a-z0-9]*$"),
                      password: Optional[str] = Form(None, min_length=5, max_length=10, regex="^[A-Za-z0-9]*$"),
                      user: User = Depends(get_current_active_user)):
    if game_name in manager.games:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Game name already exist")
    else:
        game = Game(name=game_name, password=password)
        game.create_player(player_name, user.username)
        manager.create_game(game)

    return game

def get_game(game_name: str, user: User = Depends(get_current_active_user)):
    game = manager.games.get(game_name)
    if not game:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Game not found")

    return {"game": game, "user": user}

#JOIN GAME
@app.put("/game/", response_model=Game)
async def join_game(player_name: str = Form(..., min_length=3, max_length=15, regex="^[A-Z_a-z0-9]*$"),
                    password: Optional[str] = Form(None, min_length=5, max_length=10, regex="^[A-Za-z0-9]*$"),
                    params = Depends(get_game)):
    game = params["game"]
    username = params["user"].username
    if game.exist(username):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="A user cannot enter a game twice")
    elif password != game.password:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Wrong password")
    elif player_name in game.players:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Player name already exist in this game")
    elif game.num_players == game.max_players:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Game full")
    else:
        game.create_player(player_name, username)

    return game

#START GAME
@app.put("/game/start/", response_model=Game)
async def start_game(params = Depends(get_game)):
    game = params["game"]
    if game.status != 'CREATED':
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Game already started")
    elif params["user"].username != game.owner():
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only game owner can start the game")
    elif game.num_players < game.min_players:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enough players")
    else:
        game.start()

    return game

def check_params(player_name: str, params = Depends(get_game)):
    game = params["game"]
    if game.status != 'STARTED':
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Game not started")
    player = game.players.get(player_name)
    if not player:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Player not found")
    elif not player.is_alive:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Player is not alive")

    return {"game": game, "player": player}

#ENACT PROCLAMATION
@app.put("/game/proclamation/enact/", response_model=Game)
async def enact_proclamation(loyalty: Loyalty, params = Depends(check_params)):
    game = params["game"]
    if params["player"].status != 'HEADMASTER':
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only headmaster can enact a proclamation")
    else:
        game.proclamations.enact_proclamation(loyalty)
        game.finish(manager)

    return game

#DISCARD PROCLAMATION
@app.put("/game/proclamation/discard/", response_model=Game)
async def discard_proclamation(loyalty: Loyalty, params = Depends(check_params)):
    game = params["game"]
    if params["player"].status not in ['MINISTER', 'HEADMASTER']:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only minister or headmaster can discard a proclamation")
    else:
        game.proclamations.discard_proclamation(loyalty)

    return game



#CHOOSE DIRECTOR

@app.put("/game/director/election/", response_model=Game)
async def choose_director(director_candidate:str ,params = Depends(check_params)):
    game = params["game"]
    if params["player"].name != game.elections.minister_candidate:
       raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only the minister can select a candidate for director")
    elif game.elections.last_minister == director_candidate or game.elections.last_headmaster == director_candidate:
       raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="the candidate has been a minister or director")
    else:
       game.elections.headmaster_candidate = director_candidate
    return game

#VOTE

@app.put("/game/vote/", response_model=Game)
async def player_vote(vote:Vote, params = Depends(check_params)):
    game = params["game"]
    if params["player"].name in game.elections.votes.keys():
       raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="the player has already voted")
    else:
        game.elections.votation(params["player"].name,vote)
    return game


#SHOW ELECTION RESULTS

@app.put("/game/vote/results/")
async def show_election_results(params = Depends(check_params)):
    game = params["game"]
    if game.elections.check_votes(5):
       raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,detail="one or more players have not decided their vote")
    else:
       if game.elections.vote_lumos() < game.elections.vote_nox():
          game.elections.rejected()
          return 'NOX'
       else:
          game.elections.last_minister_headmaster(game.elections.minister_candidate,game.elections.headmaster_candidate)
          game.new_minister_director(game.elections.minister_candidate,game.elections.headmaster_candidate) 
               
          return 'LUMUS'





@app.websocket("/lobby/")
async def websocket_lobby(websocket: WebSocket, user: User = Depends(get_current_active_user)):
    await manager.connect_lobby(websocket)
    try:
        while True:
            await websocket.receive_text()
            games = [game.dict() for game in manager.games.values() if game.status == 'CREATED']
            await manager.broadcast_json(games, manager.lobby_connections)

    except WebSocketDisconnect:
        manager.disconnect_lobby(websocket)

@app.websocket("/game/{game_name}")
async def websocket_game(websocket: WebSocket, game_name: str,user: User = Depends(get_current_active_user)):
    await manager.connect_game(websocket, game_name)
    try:
        while True:
            await websocket.receive_text()
            if game_name in manager.games:
                game = manager.games.get(game_name).dict()
                connections = manager.game_connections.get(game_name)
                await manager.broadcast_json(game, connections)

    except Exception:
        manager.disconnect_game(websocket, game_name)
