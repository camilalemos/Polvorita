from fastapi.testclient import TestClient
from fastapi import status

from .app import app

client = TestClient(app)

users = [
    {
        "username": "Admin_1",
        "email": "Admin_1@admin.com",
        "password": "Admin123",
    },
    {
        "username": "Admin_2",
        "email": "Admin_2@admin.com",
        "password": "Admin123",
    },
    {
        "username": "Admin_3",
        "email": "Admin_3@admin.com",
        "password": "Admin123",
    },
    {
        "username": "Admin_4",
        "email": "Admin_4@admin.com",
        "password": "Admin123",
    },
    {
        "username": "Admin_5",
        "email": "Admin_5@admin.com",
        "password": "Admin123",
    }
]

#REGISTER
def test_post_create_user():
    for user in users:
        response = client.post("/user/", data=user)
        assert response.status_code == 201

def test_post_create_user_with_malformed_username():
    data = {
        "username": "Admin_2?",
        "email": "Admin_2@admin.com",
        "password": "Admin123",
    }
    response = client.post("/user/", data=data)
    assert response.status_code == 422

def test_post_create_user_with_malformed_email():
    data = {
        "username": "Admin_3", 
        "email": "Admin_3",
        "password": "Admin123",
    }
    response = client.post("/user/", data=data)
    assert response.status_code == 422

def test_post_create_user_with_existing_username():
    data = {
        "username": "Admin_1", 
        "email":"Admin_4@admin.com",
        "password": "Admin123",
    }
    response = client.post("/user/", data=data)
    assert response.status_code == 403
    assert response.json() == {
        "detail":"Username or E-mail already exist"
    }

def test_post_create_user_with_existing_email():
    data = {
        "username": "Admin_5",  
        "email": "Admin_1@admin.com",
        "password": "Admin123",
        }
    response = client.post("/user/", data=data)
    assert response.status_code == 403
    assert response.json() == {
        "detail": "Username or E-mail already exist"
    }

#LOGIN
def test_post_login_with_username():
    data = {
        "username": "Admin_1", 
        "password": "Admin123",
    }
    response = client.post("/login/", data=data)
    assert response.status_code == 201

def test_post_login_with_email():
    data = {
        "username": "Admin_1@admin.com",
        "password": "Admin123",
    }
    response = client.post("/login/", data=data)
    assert response.status_code == 201

def test_post_login_wrong_password():
    data = {
        "username": "Admin_1",
        "password": "Admin1234",
    }
    response = client.post("/login/", data=data)
    assert response.status_code == 401

def test_post_login_wrong_username():
    data = {
        "username": "none",
        "password": "Admin123",
    }
    response = client.post("/login/", data=data)
    assert response.status_code == 401

def test_post_login_wrong_email():
    data = {
        "username": "none@none.com",
        "password": "Admin123",
    }
    response = client.post("/login/", data=data)
    assert response.status_code == 401

#CHANGE PROFILE
def test_put_change_profile_wrong_password():
    login = {
        "username": "Admin_1", 
        "password": "Admin123",
    }
    response = client.post("/login/", data=login)
    token = response.json()['access_token']
    headers={"Authorization" : f'Bearer {token}'}
    data = {
        "email": "none@none.com",
        "password": "none"
    }
    response = client.put("/user/", headers=headers, data=data)
    assert response.status_code == 401

def test_put_change_profile_with_existing_username():
    login = {
        "username": "Admin_1", 
        "password": "Admin123",
    }
    response = client.post("/login/", data=login)
    token = response.json()['access_token']
    headers={"Authorization" : f'Bearer {token}'}
    data = {
        "username": "Admin_2",
        "password": "Admin123"
    }
    response = client.put("/user/", headers=headers, data=data)
    assert response.status_code == 403
"""
#CREATE GAME
def test_post_create_game():
    for i in range(0, 2):
        response = client.post("/game/", 
            data={
            "game_name": f"Juego_{i}",
            "player_name": f"Player_{i}",
            "password": "Player123"
            })
        assert response.status_code == 201
        assert response.json() == {
            "name": f"Juego_{i}",
            "owner_name": f"Player_{i}",
            "owner_username": response.json()["owner_username"],
            "password": "Player123",
            "max_players": 5,
            "status": "CREATED",
            "players": {
                f"Player_{i}": {
                "name": f"Player_{i}",
                "game_name": f"Juego_{i}",
                "is_alive": True,
                "role": None,
                "loyalty": None,
                "status": "COMMON"
                }
            },
            "winner": None,
            "board": None,
            "elections": None,
            "chat": []
            }

def test_post_create_game_with_existing_name():
    data = {
        "game_name": "Juego_0",
        "player_name": "Player_0",
        "password": "Player123"
        }
    response = client.post("/game/", 
        data=data)
    assert response.status_code == 403
    assert response.json() == {'detail': 'Game name already exist'}

#JOIN GAME
def test_put_join_game_not_found():
    data = {
        "game_name": "Juego_5",
        "player_name": "Player_0",
        "password": "Player123"
        }
    response = client.put("/game/", 
        data=data)
    assert response.status_code == 404
    assert response.json() == {'detail': 'Game not found'}

def test_put_join_game_with_wrong_password():
    data = {
        "game_name": "Juego_0",
        "player_name": "Player_1",
        "password": "Player1234"
        }
    response = client.put("/game/", 
        data=data)
    assert response.status_code == 401
    assert response.json() == {'detail': 'Wrong password'}

def test_put_join_game_with_existing_player_name():
    data = {
        "game_name": "Juego_0",
        "player_name": "Player_0",
        "password": "Player123"
        }
    response = client.put("/game/", 
        data=data)
    assert response.status_code == 403
    assert response.json() == {'detail': 'Player name already exist in this game'}

dict = {
    "Player_0": {
        "name": "Player_0",
        "game_name": "Juego_0",
        "is_alive": True,
        "role": None,
        "loyalty": None,
        "status": "COMMON"
        }
    }

def test_put_join_game():
    for i in range(1, 5):
        response = client.put("/game/", 
            data={
            "game_name": f"Juego_0",
            "player_name": f"Player_{i}",
            "password": "Player123"
            })
        assert response.status_code == 200
        dict[f"Player_{i}"] = {
                "name": f"Player_{i}",
                "game_name": "Juego_0",
                "is_alive": True,
                "role": None,
                "loyalty": None,
                "status": "COMMON"
                }
        assert response.json() == {
            "name": f"Juego_0",
            "owner_name": f"Player_0",
            "owner_username": response.json()["owner_username"],
            "password": "Player123",
            "max_players": 5,
            "status": "CREATED",
            "players": dict,
            "winner": None,
            "board": None,
            "elections": None,
            "chat": []
            }

def test_put_join_game_full():
    data = {
        "game_name": "Juego_0",
        "player_name": "Player_5",
        "password": "Player123"
        }
    response = client.put("/game/", 
        data=data)
    assert response.status_code == 403
    assert response.json() == {'detail': 'Game full'}

#START GAME
def test_put_start_game_not_found():
    response = client.put("/game/start/Player_0?game_name=Juego_5")
    assert response.status_code == 404
    assert response.json() == {"detail": "Game not found"}

def test_put_start_game_player_not_found():
    response = client.put("/game/start/Player_5?game_name=Juego_0")
    assert response.status_code == 404
    assert response.json() == {"detail": "Player not found"}

def test_put_start_game_not_owner():
    response = client.put("/game/start/Player_1?game_name=Juego_0")
    assert response.status_code == 403
    assert response.json() == {"detail": "Only game owner can start the game"}

def test_put_start_game():
    response = client.put("/game/start/Player_0?game_name=Juego_0")
    assert response.status_code == 200
    assert response.json() == {
        "name": "Juego_0",
        "owner_name": "Player_0",
        "owner_username": response.json()["owner_username"],
        "password": "Player123",
        "max_players": 5,
        "status": "STARTED",
        "players": dict,
        "winner": None,
        "board": {
            "proclamations": response.json()["board"]["proclamations"],
            "PO_enacted_proclamations": 0,
            "PO_discarded_proclamations": 0,
            "DE_enacted_proclamations": 0,
            "DE_discarded_proclamations": 0,
            "spells": []
        },
        "elections": {
            "minister_candidate": response.json()["elections"]["minister_candidate"],
            "headmaster_candidate": None,
            "votes": {}
        },
        "chat": []
        }

def test_put_start_game_already_started():
    response = client.put("/game/start/Player_0?game_name=Juego_0")
    assert response.status_code == 403
    assert response.json() == {"detail": "Game already started"}

def test_put_start_game_not_enough_players():
    response = client.put("/game/start/Player_1?game_name=Juego_1")
    assert response.status_code == 403
    assert response.json() == {"detail": "Not enough players"}

#ENACT PROCLAMATION
def test_put_enact_proclamation_game_not_found():
    response = client.put("/game/proclamation/enact/Player_0?game_name=Juego_5&loyalty=PHOENIX_ORDER")
    assert response.status_code == 404
    assert response.json() == {"detail": "Game not found"}

def test_put_enact_proclamation_player_not_found():
    response = client.put("/game/proclamation/enact/Player_5?game_name=Juego_0&loyalty=PHOENIX_ORDER")
    assert response.status_code == 404
    assert response.json() == {"detail": "Player not found"}


def test_put_enact_proclamation_game_not_started():
    response = client.put("/game/proclamation/enact/Player_1?game_name=Juego_1&loyalty=PHOENIX_ORDER")
    assert response.status_code == 403
    assert response.json() == {"detail": "Game not started"}

def test_put_enact_proclamation_not_valid_loyaly():
    response = client.put("/game/proclamation/enact/Player_0?game_name=Juego_0&loyalty=SARASA")
    assert response.status_code == 422

def test_put_enact_proclamation_only_headmaster():
    response = client.put("/game/proclamation/enact/Player_0?game_name=Juego_0&loyalty=PHOENIX_ORDER")
    assert response.status_code == 403
    assert response.json() == {"detail": "Only headmaster can enact a proclamation"}

#DISCARD PROCLAMATION
def test_put_discard_proclamation_game_not_found():
    response = client.put("/game/proclamation/discard/Player_0?game_name=Juego_5&loyalty=PHOENIX_ORDER")
    assert response.status_code == 404
    assert response.json() == {"detail": "Game not found"}

def test_put_discard_proclamation_player_not_found():
    response = client.put("/game/proclamation/discard/Player_5?game_name=Juego_0&loyalty=PHOENIX_ORDER")
    assert response.status_code == 404
    assert response.json() == {"detail": "Player not found"}


def test_put_discard_proclamation_game_not_started():
    response = client.put("/game/proclamation/discard/Player_1?game_name=Juego_1&loyalty=PHOENIX_ORDER")
    assert response.status_code == 403
    assert response.json() == {"detail": "Game not started"}

def test_put_discard_proclamation_not_valid_loyaly():
    response = client.put("/game/proclamation/discard/Player_0?game_name=Juego_0&loyalty=SARASA")
    assert response.status_code == 422

def test_put_discard_proclamation_only_headmaster():
    response = client.put("/game/proclamation/discard/Player_0?game_name=Juego_0&loyalty=PHOENIX_ORDER")
    assert response.status_code == 403
    assert response.json() == {"detail": "Only minister or headmaster can discard a proclamation"}
"""