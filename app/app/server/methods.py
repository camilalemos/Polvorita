from pony.orm import db_session , Optional , select , get ,delete
from fastapi import FastAPI, HTTPException, status
from fastapi.encoders import jsonable_encoder
from . import db
from .models.Player_Game import *
from typing import List , Optional
import random


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


# methods for selecting player's role envelope and loyalty

def remove_env(array_env,index):
    delete(p for p in db.Envelopes if p.gamename == array_env[index]["gamename"] and
                                      p.role == array_env[index]["role"] and 
                                      p.loyalty == array_env[index]["loyalty"] and
                                      p.occupied == array_env[index]["occupied"])

def new_env(array_env,index):
    new_env = Envelopes(gamename=array_env[index]["gamename"],
                        role=array_env[index]["role"],
                        loyalty=array_env[index]["loyalty"],
                        occupied=True)
                   
    db.Envelopes(**new_env.dict()).to_dict()


def distEnvToPlayers(game_Name):
    chosen_one = True
    index = 0
    select_env = select(p for p in db.Envelopes if p.gamename == game_Name)
    array_env = [p.to_dict() for p in select_env]  
    while chosen_one:
        index = random.randint(0,4)
        if array_env[index]["occupied"] == False: 
            remove_env(array_env,index)
            new_env(array_env,index)
            chosen_one = False
        else:
            index += 1
    return array_env[index]

def createPlayer(player_name,id_count,selectedEnvelope):
    new_player =Player(player_name=player_name,
                       is_alive=True,
                       role=selectedEnvelope["role"],
                       loyalty=selectedEnvelope["loyalty"],
                       status="COMMON",
                       associated_game=id_count)
    db.Player(**new_player.dict()).to_dict()

