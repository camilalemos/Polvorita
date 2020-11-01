from pony.orm import db_session , Optional , select , get ,delete
from fastapi import FastAPI, HTTPException, status
from fastapi.encoders import jsonable_encoder
from . import db
from .methods import *
from .models.Player_Game import *
from typing import List , Optional



def prepare_envelopes(game_Name: str):
    env_of_letters1 = Envelopes(gamename = game_Name,role="HARRY_POTTER",
                      loyalty="PHOENIX_ORDEN",occupied = False)   
    env_of_letters2 = Envelopes(gamename = game_Name,role="ALBUS_DUMBLEDORE",
                      loyalty="PHOENIX_ORDEN",occupied = False)   
    env_of_letters3 = Envelopes(gamename = game_Name,role="HERMIONE_GRANGER",
                      loyalty="PHOENIX_ORDEN",occupied = False)   
    env_of_letters4 = Envelopes(gamename = game_Name,role="VOLDEMORT",
                      loyalty="DEATH_EATERS",occupied = False)   
    env_of_letters5 = Envelopes(gamename = game_Name,role="SEVERUS_SNAPE",
                      loyalty="DEATH_EATERS",occupied = False)   

    db.Envelopes(**env_of_letters1.dict()).to_dict()
    db.Envelopes(**env_of_letters2.dict()).to_dict()
    db.Envelopes(**env_of_letters3.dict()).to_dict()
    db.Envelopes(**env_of_letters4.dict()).to_dict()
    db.Envelopes(**env_of_letters5.dict()).to_dict()

