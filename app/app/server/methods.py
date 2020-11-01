from pony.orm import db_session , Optional , select , get ,delete
from fastapi import FastAPI, HTTPException, status
from fastapi.encoders import jsonable_encoder
from . import db
from .models.Player_Game import *
from typing import List , Optional



def remove_minister(length_list_player,index_minister):
    remove_player =  length_list_player[index_minister]["player_name"]  
    delete(p for p in db.Player if p.player_name == remove_player)

def new_minister(length_list_player,index_minister,new_status):    
    new_minister = Player(player_name=length_list_player[index_minister]["player_name"],
                   is_alive= True,
                   role=length_list_player[index_minister]["role"],
                   loyalty=length_list_player[index_minister]["loyalty"],
                   status=new_status,
                   associated_game=length_list_player[index_minister]["associated_game"])
    db.Player(**new_minister.dict()).to_dict()

def index_minister(length_list_player):
    response = -1
    index_minister = 0
    while index_minister < len(length_list_player): 
       if length_list_player[index_minister]["status"] == "MINISTER":
          response = index_minister
          index_minister = len(length_list_player) + 1
       else:
          index_minister += 1
    return response

