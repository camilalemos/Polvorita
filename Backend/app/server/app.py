from fastapi import FastAPI, Form
from fastapi.middleware.cors import CORSMiddleware
import asyncio

from .authentication import *
from .wsmanager import *
from .models import *
from .enums import *
from .db import db

app = FastAPI()
manager = ConnectionManager()

origins = [
    "http://127.0.0.1:3000",
    "http://localhost:3000"
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
def register_user(email: EmailStr = Form(...),
                  username: str = Form(..., min_length=5, max_length=20, regex="^[A-Z_a-z0-9]*$"),
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
def login_user(form_data: OAuth2PasswordRequestForm = Depends()):
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
def change_profile(email: Optional[EmailStr] = Form(None),
                   username: Optional[str] = Form(None, min_length=5, max_length=20, regex="^[A-Z_a-z0-9]*$"),
                   full_name: Optional[str] = Form(None, min_length=5, max_length=30, regex="^[A-Z a-z0-9]*$"),
                   new_password: Optional[str] = Form(None, min_length=8, max_length=20, regex="^[A-Za-z0-9]*$"),
                   password: str = Form(...),
                   user: User = Depends(get_current_active_user)):
    with db_session:
        if username or email or full_name or new_password:
            if not verify_password(password, user.password):
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect credentials")
            elif username and db.User.exists(username=username):
                raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Username already exist")
            elif email and db.User.exists(email=email):
                raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="E-mail already exist")

        updated_user = db.User[user.id]
        hashed_password = get_password_hash(new_password)
        updated_user = updated_user.update(email, username, full_name, hashed_password)
        return updated_user.to_dict()

#CREATE GAME
@app.post("/game/", status_code=201, response_model=Game)
def create_game(game_name: str = Form(..., min_length=5, max_length=20, regex="^[A-Z_a-z0-9]*$"),
                player_name: str = Form(..., min_length=3, max_length=15, regex="^[A-Z_a-z0-9]*$"),
                max_players: int = Form(...),
                password: Optional[str] = Form(None, min_length=5, max_length=10, regex="^[A-Za-z0-9]*$"),
                user: User = Depends(get_current_active_user)):
    if game_name in manager.games:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Game name already exist")
    elif max_players not in range(5, 11):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid max players")

    game = Game(name=game_name, owner=user.username, max_players=max_players, password=password)
    game.create_player(player_name, user.username)
    manager.create_game(game)
    return game

#GET ACTIVE GAMES
@app.get("/game/")
def get_active_games(user: User = Depends(get_current_active_user)):
    return [game.name for game in manager.games.values() if game.exist(user.username) and game.status != 'CREATED']

def get_game(game_name: str, user: User = Depends(get_current_active_user)):
    game = manager.games.get(game_name)
    if not game:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Game not found")

    return {"game": game, "user": user}

#JOIN GAME
@app.put("/game/", response_model=Game)
def join_game(player_name: str = Form(..., min_length=3, max_length=15, regex="^[A-Z_a-z0-9]*$"),
              password: Optional[str] = Form(None),
              params = Depends(get_game)):
    game = params["game"]
    username = params["user"].username
    if game.status != 'CREATED':
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Cannot join game at this moment")
    elif game.exist(username):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="A user cannot enter a game twice")
    elif password != game.password:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Wrong password")
    elif player_name in game.players:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Player name already exist in this game")
    elif game.num_players == game.max_players:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Game full")

    game.create_player(player_name, username)
    return game

#START GAME
@app.put("/game/start/", response_model=Game)
def start_game(params = Depends(get_game)):
    game = params["game"]
    if game.status != 'CREATED':
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Cannot start game at this moment")
    elif params["user"].username != game.owner:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only game owner can start the game")
    elif game.num_players < game.min_players:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enough players")

    game.start()
    game.status = 'STARTED'
    return game

def get_player(player_name: str, params = Depends(get_game)):
    game = params["game"]
    player = game.players.get(player_name)
    if not player:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Player not found")
    elif player.user_name != params["user"].username:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")

    return {"player": player, "game": game}

#QUIT GAME
@app.delete("/game/")
def quit_game(params = Depends(get_player)):
    game = params["game"]
    player_name = params["player"].name
    if game.status != 'CREATED' and game.status != 'FINISHED':
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Cannot quit game at this moment")

    game.delete_player(player_name)
    if not game.num_players:
        manager.delete_game(game.name)

    return game

def check_player(params = Depends(get_player)):
    game = params["game"]
    player = params["player"]
    if not player.is_alive:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Player is not alive")

    return params

#SEND MESSAGE
@app.post("/game/chat/")
def send_message(msg: str = Form(...), params = Depends(check_player)):
    game = params["game"]
    player_name = params["player"].name
    game.send_message(msg, player_name)

#CHOOSE DIRECTOR
@app.put("/game/elections/nominate/", response_model=Game)
def choose_director(candidate_name:str, params = Depends(check_player)):
    game = params["game"]
    player_name = params["player"].name
    if game.status != 'STARTED':
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Cannot choose director at this moment")
    elif candidate_name not in game.players:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Candidate name not found")
    elif candidate_name not in game.elections.players:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Candidate is not alive")
    elif player_name != game.elections.minister_candidate:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only the minister candidate can choose the headmaster candidate")
    elif candidate_name in [player_name, game.elections.minister, game.elections.headmaster]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="The candidate is not eligible")

    game.elections.nominate('HEADMASTER', candidate_name)
    game.sys_message("Voting has started!")
    game.status = 'VOTING'
    return game

#VOTE
@app.put("/game/elections/vote/", response_model=Game)
def vote(vote:Vote, params = Depends(check_player)):
    game = params["game"]
    player_name = params["player"].name
    if game.status != 'VOTING':
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Cannot vote at this moment")
    elif not game.elections.headmaster_candidate:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Headmaster candidate not defined")
    elif player_name in game.elections.votes:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="The player has already voted")

    game.elections.vote(player_name, vote)
    game.sys_message(f"{player_name} has just voted!")
    if len(game.elections.votes) == len(game.elections.players):
        game.elections.set_result()
        if game.elections.result == 'LUMOS':
            game.sys_message("The result of the election has been LUMOS!")
            game.status = 'LEGISLATIVE'
            game.check_win('ELECTIONS')
        elif game.elections.result == 'NOX':
            game.sys_message("The result of the election has been NOX!")
            game.status = 'STARTED'

    if game.elections.check_for_chaos():
        game.proclamations.get_proclamations(1)
        game.proclamations.enact()
        game.spells[game.proclamations.DE_enacted_proclamations] = 'NONE_SPELL'
        game.sys_message("The government has entered a situation of chaos!")

    return game

#GET PROCLAMATIONS
@app.get("/game/proclamations/", response_model=List[Loyalty])
def get_proclamations(params = Depends(check_player)):
    game = params["game"]
    if game.status != 'LEGISLATIVE':
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Cannot get proclamations at this moment")
    elif params["player"].name != game.elections.minister:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only minister can get proclamations")
    elif game.proclamations.hand:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Still have proclamations in hand")

    game.proclamations.get_proclamations(3)
    return game.proclamations.hand

#DISCARD PROCLAMATION
@app.put("/game/proclamations/discard/", response_model=Game)
def discard_proclamation(loyalty: Loyalty, params = Depends(check_player)):
    game = params["game"]
    player_name = params["player"].name
    if game.status != 'LEGISLATIVE':
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Cannot discard proclamations at this moment")
    elif player_name not in [game.elections.minister, game.elections.headmaster]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only minister or headmaster can discard a proclamation")
    elif loyalty not in game.proclamations.hand:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Proclamation not in hand")
    elif game.proclamations.headmaster_exp:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Cannot discard proclamations during an Expelliarmus negotiation")

    is_headmaster = player_name == game.elections.headmaster
    game.proclamations.discard(loyalty, is_headmaster)
    if is_headmaster:
        game.sys_message("The Director has enacted a proclamation!")
        if game.spells[game.proclamations.DE_enacted_proclamations % 6] == 'NONE_SPELL':
            game.status = 'STARTED'
        else:
            game.status = 'EXECUTIVE'

    game.check_win('PROCLAMATIONS')
    return game

#EXPELLIARMUS
@app.put("/game/proclamations/expelliarmus/", response_model=Game)
def expelliarmus(minister_exp: Optional[bool] = None, params = Depends(check_player)):
    game = params["game"]
    player_name = params["player"].name
    if game.status != 'LEGISLATIVE':
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Cannot use Expelliarmus at this moment")
    elif player_name not in [game.elections.minister, game.elections.headmaster]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only minister or headmaster can use Expelliarmus")
    elif game.proclamations.DE_enacted_proclamations < 5 or len(game.proclamations.hand) != 2:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Expelliarmus not available")
    elif player_name == game.elections.minister and not game.proclamations.headmaster_exp:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Headmaster must cast Expelliarmus first")

    if player_name == game.elections.headmaster:
        game.proclamations.headmaster_exp = True
    elif player_name == game.elections.minister:
        game.proclamations.expelliarmus(minister_exp)
        game.proclamations.headmaster_exp = False
        if minister_exp:
            game.status = 'STARTED'

    return game

#CAST SPELL
@app.put("/game/spells/")
def cast_spell(target_name: Optional[str] = None, params = Depends(check_player)):
    game = params ["game"]
    player_name = params["player"].name
    if game.status != 'EXECUTIVE':
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Cannot cast spells at this moment")
    elif target_name and target_name not in game.players:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Target name not found")
    elif target_name and target_name not in game.elections.players:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Target is not alive")
    elif target_name == player_name:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Cannot cast a spell on yourself")
    elif player_name != game.elections.minister:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only minister can cast a spell")

    result = game.cast_spell(target_name)
    game.status = 'STARTED'
    game.check_win('EXECUTION')
    return result

#LOBBY WEBSOCKET
@app.websocket("/lobby/")
async def websocket_lobby(websocket: WebSocket):
    await manager.connect_lobby(websocket)
    try:
        games = [game.dict() for game in manager.games.values() if game.status == 'CREATED']
        while True:
            await asyncio.sleep(0.5)
            await manager.broadcast_json(games, manager.lobby_connections)

    except Exception:
        manager.disconnect_lobby(websocket)

#GAME WEBSOCKET
@app.websocket("/game/{game_name}")
async def websocket_game(websocket: WebSocket, game_name: str):
    await manager.connect_game(websocket, game_name)
    try:
        game = manager.games[game_name]
        connections = manager.game_connections[game_name]
        while True:
            await asyncio.sleep(0.5)
            await manager.broadcast_json(game.dict(), connections)

    except Exception:
        manager.disconnect_game(websocket, game_name)
