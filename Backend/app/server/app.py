from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext

from fastapi import FastAPI, Depends, Form, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from pony.orm import db_session, exists,select
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
@app.post("/token/", status_code=201, response_model=Token)
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

#CREATE GAME
@app.post("/game/", status_code=201, response_model=Game)
async def create_game(game_name: str = Form(..., min_length=5, max_length=20, regex="^[A-Z_a-z0-9]*$"),
                      player_name: str = Form(..., min_length=3, max_length=10, regex="^[A-Z_a-z0-9]*$"),
                      password: Optional[str] = Form(None, min_length=5, max_length=10, regex="^[A-Za-z0-9]*$"),
                      user: User = Depends(get_current_active_user)):
    if game_name in manager.games:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Game name already exist")
    else:
        game = Game(name=game_name, owner_name=player_name, owner_username=user.username, password=password)
        player = Player(name=player_name, game_name=game_name)
        game.players[player_name] = player
        manager.create_game(game)

    return game

#JOIN GAME
@app.put("/game/", response_model=Game)
async def join_game(game_name: str = Form(..., min_length=5, max_length=20, regex="^[A-Z_a-z0-9]*$"),
                    player_name: str = Form(..., min_length=3, max_length=10, regex="^[A-Z_a-z0-9]*$"),
                    password: Optional[str] = Form(None, min_length=5, max_length=10, regex="^[A-Za-z0-9]*$"),
                    user: User = Depends(get_current_active_user)):
    game = manager.games.get(game_name)
    if not game:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Game not found")
    elif game.owner_username == user.username:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="A user cannot enter his own game")
    elif game.password != password:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Wrong password")
    elif player_name in game.players:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Player name already exist in this game")
    elif len(game.players) == game.max_players:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Game full")
    else:
        player = Player(name=player_name, game_name=game_name)
        game.players[player_name] = player

    return game

def get_game(game_name: str, player_name: str, user: User = Depends(get_current_active_user)):
    game = manager.games.get(game_name)
    if not game:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Game not found")
    elif not game.players.get(player_name):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Player not found")

    return game


#START GAME
@app.put("/game/start/{player_name}", response_model=Game)
async def start_game(player_name: str, game: Game = Depends(get_game)):
    if game.status != 'CREATED':
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Game already started")
    elif game.owner_name != player_name:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only game owner can start the game")
    elif len(game.players) != game.max_players:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enough players")
    else:
        game.start()

    return game

#ENACT PROCLAMATION
@app.put("/game/proclamation/enact/{player_name}", response_model=Game)
async def enact_proclamation(player_name:str, loyalty: Loyalty, game: Game = Depends(get_game)):
    if game.status != 'STARTED':
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Game not started")
    elif game.players.get(player_name).status != 'HEADMASTER':
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only headmaster can enact a proclamation")
    else:
        game.board.enact_proclamation(loyalty)
        game.finish(manager)

    return game

#DISCARD PROCLAMATION
@app.put("/game/proclamation/discard/{player_name}", response_model=Game)
async def discard_proclamation(player_name:str, loyalty: Loyalty, game: Game = Depends(get_game)):
    if game.status != 'STARTED':
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Game not started")
    elif game.players.get(player_name).status not in ['MINISTER', 'HEADMASTER']:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only minister or headmaster can discard a proclamation")
    else:
        game.board.discard_proclamation(loyalty)

    return game

#CHOOSE DIRECTOR

@app.put("/game/director/election/{player_name}", response_model=Game)
async def choose_director(player_name:str ,director_candidate:str ,game: Game = Depends(get_game)):
    if game.status != 'STARTED':
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Game not started")
    elif player_name != game.elections.minister_candidate:
       raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only the minister can select a candidate for director")
    elif game.elections.last_minister == director_candidate or game.elections.last_headmaster == director_candidate:
       raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="the candidate has been a minister or director")
    else:
       game.elections.headmaster_candidate = director_candidate
    return game

#VOTE

@app.put("/game/vote/{player_name}", response_model=Game)
async def player_vote(player_name:str, vote:Vote, game: Game = Depends(get_game)):
    if game.status != 'STARTED':
       raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Game not started")
    elif player_name in game.elections.votes.keys():
       raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="the player has already voted")
    else:
        game.elections.votation(player_name,vote)
    return game


#SHOW ELECTION RESULTS

@app.put("/game/vote/results/")
async def show_election_results(game: Game = Depends(get_game)):
    if game.status != 'STARTED':
       raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Game not started")
    elif sum(map(len, game.elections.votes.values())) < 5:
       raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,detail="one or more players have not decided their vote")
    else:
       vote_lumus = sum(map(("LUMUS").__eq__, game.elections.votes.values())) 
       voto_nox   = sum(map(("NOX").__eq__, game.elections.votes.values()))
       if vote_lumus < voto_nox:
          game.elections.rejected()
          return 'NOX'
       else:
          for player in game.players.values():
              player.status = 'COMMON'

          game.elections.last_minister_headmaster(game.elections.minister_candidate,
                                        game.elections.headmaster_candidate)
          game.players.new_minister_director(game.elections.minister_candidate,
                                             game.elections.headmaster_candidate)      
          return 'LUMUS'



# shift change logic

@app.put("/game/change/turn/")
async def shift_change_logic(game: Game = Depends(get_game)):
      if game.status != 'STARTED':
         raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Game not started")
      else:
          for player in game.players.values():
               player.status = 'COMMON'
          new_candidate = random.choice(list(game.players.values())).name
          game.elections.nominate('MINISTER', new_candidate)
          game.elections.nominate('HEADMASTER', None)
          game.elections.votes = {}
          return new_candidate



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
