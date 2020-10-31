from pony.orm import db_session , Optional , select , get 
from fastapi import FastAPI, HTTPException, status
from fastapi.encoders import jsonable_encoder
from . import db
from .models.Player_Game import *
from typing import List , Optional
app = FastAPI()

# create game
@app.post("/game/{gameName}",response_model=Response_App)
async def new_game(gameName: str,password: Optional[str] = None):
        with db_session:
          if db.Game.exists(game_name= gameName):
              raise HTTPException(status_code=403, detail="game name already exist")
          else:
              if password == None:
                 password = ""
              id_num = select(p for p in db.Game)
              id_count = len([p.to_dict() for p in id_num]) + 1
              new_game = Game(id_game= id_count,game_name=gameName,password=password,
                         num_players = 5,started=False)
              db.Game(**new_game.dict()).to_dict()          
          return Response_App(code= 201,description= "game successfully created")



