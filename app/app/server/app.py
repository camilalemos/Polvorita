from pony.orm import db_session , Optional , select , get 
from fastapi import FastAPI, HTTPException, status
from fastapi.encoders import jsonable_encoder
from . import db
from .methods import *
from .Envelopers import *
from .models.Player_Game import *
from typing import List , Optional
app = FastAPI()

# create game
@app.post("/game/{gameName,player_name}",response_model=Response_App)
async def new_game(gameName: str,player_name: str,password: Optional[str] = None):
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
              # preparing card envelopes for the game
              prepare_envelopes(gameName) 
              # add game creator player
              selectedEnvelope = distEnvToPlayers(gameName)  
              createPlayer(player_name,id_count,selectedEnvelope)    
          return Response_App(code= 200,description= "game successfully created")

# note: this endpoint only runs when starting the game (with all 5 players) or within the game.

@app.put("/minister/{game_Name}", response_model=str)
def select_minister(game_Name: str):
    with db_session:
        if db.Game.exists(game_name= game_Name):
            name_game = get(p for p in db.Game if p.game_name == game_Name)
            id_game = name_game.id_game
            list_player = select(p for p in db.Player if p.associated_game == id_game)
            length_list_player = [p.to_dict() for p in list_player] 
            # remove old minister and agregate
            old_minister_index = index_minister(length_list_player)
            # if it is different from -1 then the game has already started
            if old_minister_index != -1:
              remove_minister(length_list_player,old_minister_index)
              # adding old player
              new_minister(length_list_player,old_minister_index,"COMMON")
            remove_minister(length_list_player,0)
            new_minister(length_list_player,0,"MINISTER")      
            # return list of player
            select_player = select(p for p in db.Player)
            array_player = [p.to_dict() for p in select_player if p.associated_game == id_game]
            return_minister = array_player[0]["player_name"]
            return return_minister
        else:
            raise HTTPException(status_code=403, detail="game name not exist")

