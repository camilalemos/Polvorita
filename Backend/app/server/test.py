from fastapi.testclient import TestClient
from fastapi import status

from .app import app

client = TestClient(app)

users = [
    {
        "username": "Admin",
        "email": "Admin@admin.com",
        "password": "Admin123",
    },
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
        "username": "Admin?",
        "email": "Admin@admin.com",
        "password": "Admin123",
    }
    response = client.post("/user/", data=data)
    assert response.status_code == 422
    assert response.json() == {
        'detail':
            [{'ctx': {'pattern': '^[A-Z_a-z0-9]*$'},
              'loc': ['body', 'username'],
              'msg': 'string does not match regex "^[A-Z_a-z0-9]*$"',
              'type': 'value_error.str.regex'}]
    }

def test_post_create_user_with_malformed_email():
    data = {
        "username": "Admin", 
        "email": "Admin",
        "password": "Admin123",
    }
    response = client.post("/user/", data=data)
    assert response.status_code == 422
    assert response.json() == {
        'detail':
            [{'loc': ['body', 'email'],
              'msg': 'value is not a valid email address',
              'type': 'value_error.email'}]
    }

def test_post_create_user_with_existing_username():
    data = {
        "username": "Admin_1", 
        "email":"Admin@admin.com",
        "password": "Admin123",
    }
    response = client.post("/user/", data=data)
    assert response.status_code == 403
    assert response.json() == {
        "detail":"Username or E-mail already exist"
    }

def test_post_create_user_with_existing_email():
    data = {
        "username": "Admin",  
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
        "password": "none",
    }
    response = client.post("/login/", data=data)
    assert response.status_code == 401
    assert response.json() == {
        "detail": "Incorrect credentials"
    }

def test_post_login_wrong_username():
    data = {
        "username": "none",
        "password": "Admin123",
    }
    response = client.post("/login/", data=data)
    assert response.status_code == 401
    assert response.json() == {
        "detail": "Incorrect credentials"
    }

def test_post_login_wrong_email():
    data = {
        "username": "none",
        "password": "Admin123",
    }
    response = client.post("/login/", data=data)
    assert response.status_code == 401
    assert response.json() == {
        "detail": "Incorrect credentials"
    }

def get_header(username):
    login = {
        "username": username, 
        "password": "Admin123",
    }
    response = client.post("/login/", data=login)
    token = response.json()['access_token']
    return {"Authorization" : f'Bearer {token}'}

#CHANGE PROFILE
def test_put_change_profile_with_malformed_username():
    headers = get_header("Admin_1")
    data = {
        "username": "Admin_1?",
        "password": "Admin123"
    }
    response = client.put("/user/", headers=headers, data=data)
    assert response.status_code == 422
    assert response.json() == {
        'detail':
            [{'ctx': {'pattern': '^[A-Z_a-z0-9]*$'},
              'loc': ['body', 'username'],
              'msg': 'string does not match regex "^[A-Z_a-z0-9]*$"',
              'type': 'value_error.str.regex'}]
    }

def test_put_change_profile_with_malformed_email():
    headers = get_header("Admin_1")
    data = {
        "email": "Admin_1",
        "password": "Admin123"
    }
    response = client.put("/user/", headers=headers, data=data)
    assert response.status_code == 422
    assert response.json() == {
        'detail':
            [{'loc': ['body', 'email'],
              'msg': 'value is not a valid email address',
              'type': 'value_error.email'}]
    }

def test_put_change_profile_with_malformed_fullname():
    headers = get_header("Admin_1")
    data = {
        "full_name": "Admin_1",
        "password": "Admin123"
    }
    response = client.put("/user/", headers=headers, data=data)
    assert response.status_code == 422
    assert response.json() == {
        'detail':
            [{'ctx': {'pattern': '^[A-Z a-z0-9]*$'},
              'loc': ['body', 'full_name'],
              'msg': 'string does not match regex "^[A-Z a-z0-9]*$"',
              'type': 'value_error.str.regex'}]
    }

def test_put_change_profile_wrong_password():
    headers = get_header("Admin_1")
    data = {
        "email": "Admin@admin.com",
        "password": "none"
    }
    response = client.put("/user/", headers=headers, data=data)
    assert response.status_code == 401
    assert response.json() == {
        "detail": "Incorrect credentials"
    }

def test_put_change_profile_with_existing_username():
    headers = get_header("Admin_1")
    data = {
        "username": "Admin_2",
        "password": "Admin123"
    }
    response = client.put("/user/", headers=headers, data=data)
    assert response.status_code == 403
    assert response.json() == {
        "detail": "Username already exist"
    }

def test_put_change_profile_with_existing_email():
    headers = get_header("Admin_1")
    data = {
        "email": "Admin_2@admin.com",
        "password": "Admin123"
    }
    response = client.put("/user/", headers=headers, data=data)
    assert response.status_code == 403
    assert response.json() == {
        "detail": "E-mail already exist"
    }

def test_put_change_profile():
    headers = get_header("Admin_1")
    data = {
        "full_name": "Sergio Rodriguez",
        "password": "Admin123"
    }
    response = client.put("/user/", headers=headers, data=data)
    assert response.status_code == 200

#CREATE GAME
def test_post_create_game_with_malformed_game_name():
    headers = get_header("Admin_1")
    data={
        "game_name": "juego?",
        "player_name": "Player_1",
        "password": "Player123"
    }
    response = client.post("/game/", headers=headers, data=data)
    assert response.status_code == 422
    assert response.json() == {
        'detail': [{'ctx': {'pattern': '^[A-Z_a-z0-9]*$'},
                    'loc': ['body', 'game_name'],
                    'msg': 'string does not match regex "^[A-Z_a-z0-9]*$"',
                    'type': 'value_error.str.regex'}],
    }

def test_post_create_game_with_malformed_player_name():
    headers = get_header("Admin_1")
    data={
        "game_name": "juego",
        "player_name": "Player?",
        "password": "Player123"
    }
    response = client.post("/game/", headers=headers, data=data)
    assert response.status_code == 422
    assert response.json() == {
        'detail': [{'ctx': {'pattern': '^[A-Z_a-z0-9]*$'},
                    'loc': ['body', 'player_name'],
                    'msg': 'string does not match regex "^[A-Z_a-z0-9]*$"',
                    'type': 'value_error.str.regex'}],
    }

def test_post_create_game_with_malformed_password():
    headers = get_header("Admin_1")
    data={
        "game_name": "juego",
        "player_name": "Player_1",
        "password": "Player123?"
    }
    response = client.post("/game/", headers=headers, data=data)
    assert response.status_code == 422
    assert response.json() == {
        'detail': [{'ctx': {'pattern': '^[A-Za-z0-9]*$'},
                    'loc': ['body', 'password'],
                    'msg': 'string does not match regex "^[A-Za-z0-9]*$"',
                    'type': 'value_error.str.regex'}],
    }

def test_post_create_game():
    headers = get_header("Admin_1")
    data1={
        "game_name": "juego",
        "player_name": "Player_1",
        "password": "Player123"
    }
    data2={
        "game_name": "juego1",
        "player_name": "Player_1",
        "password": "Player123"
    }
    response = client.post("/game/", headers=headers, data=data1)
    client.post("/game/", headers=headers, data=data2)
    assert response.status_code == 201
    assert response.json() == {
        "name": "juego",
        "password": "Player123",
        "status": "CREATED",
        "winner": None,
        "min_players": 5,
        "max_players": 5,
        "num_players": 1,
        "voldemort": None,
        "players": {
            "Player_1": {
                "name": "Player_1",
                "user_name": "Admin_1",
                "is_alive": True,
                "role": None,
                "loyalty": None
            }
        },
        "proclamations": None,
        "elections": None,
        "spells": [
            "ADIVINATION",
            "AVADA_KEDAVRA",
            "CRUCIO",
            "IMPERIUS"
        ],
        "chat": []
    }

def test_post_create_game_with_existing_name():
    headers = get_header("Admin_1")
    data={
        "game_name": "juego",
        "player_name": "Player_1",
        "password": "Player123"
    }
    response = client.post("/game/", headers=headers, data=data)
    assert response.status_code == 403
    assert response.json() == {'detail': 'Game name already exist'}

#JOIN GAME
def test_put_join_game_with_malformed_player_name():
    headers = get_header("Admin_1")
    data = {
        "player_name": "Player?",
        "password": "Player123"
    }
    response = client.put("/game/?game_name=juego", headers=headers, data=data)
    assert response.status_code == 422
    assert response.json() == {
        'detail': [{'ctx': {'pattern': '^[A-Z_a-z0-9]*$'},
                    'loc': ['body', 'player_name'],
                    'msg': 'string does not match regex "^[A-Z_a-z0-9]*$"',
                    'type': 'value_error.str.regex'}],
    }

def test_put_join_game_not_found():
    headers = get_header("Admin_1")
    data = {
        "player_name": "Player_2",
        "password": "Player123"
    }
    response = client.put("/game/?game_name=Juego_5", headers=headers, data=data)
    assert response.status_code == 404
    assert response.json() == {'detail': 'Game not found'}

def test_put_join_game_twice():
    headers = get_header("Admin_1")
    data = {
        "player_name": "Player_2",
        "password": "none"
    }
    response = client.put("/game/?game_name=juego", headers=headers, data=data)
    assert response.status_code == 403
    assert response.json() == {'detail': 'A user cannot enter a game twice'}

def test_put_join_game_with_existing_player_name():
    headers = get_header("Admin_2")
    data = {
        "player_name": "Player_1",
        "password": "Player123"
    }
    response = client.put("/game/?game_name=juego", headers=headers, data=data)
    assert response.status_code == 403
    assert response.json() == {'detail': 'Player name already exist in this game'}

def test_put_join_game():
    for i in range(2, 6):
        headers = get_header(f"Admin_{i}")
        data = {
            "player_name": f"Player_{i}",
            "password": "Player123"
        }
        response = client.put("/game/?game_name=juego", headers=headers, data=data)
        assert response.status_code == 200
        assert response.json() == {
            "name": "juego",
            "password": "Player123",
            "status": "CREATED",
            "winner": None,
            "min_players": 5,
            "max_players": 5,
            "num_players": i,
            "voldemort": None,
            "players": response.json()["players"],
            "proclamations": None,
            "elections": None,
            "spells": [
                "ADIVINATION",
                "AVADA_KEDAVRA",
                "CRUCIO",
                "IMPERIUS"
            ],
            "chat": []
        }

def test_put_join_game_full():
    headers = get_header("Admin")
    data = {
        "player_name": "Player",
        "password": "Player123"
    }
    response = client.put("/game/?game_name=juego", headers=headers, data=data)
    assert response.status_code == 403
    assert response.json() == {'detail': 'Game full'}

#START GAME
def test_put_start_game_not_found():
    headers = get_header("Admin_1")
    response = client.put("/game/start/?game_name=juego_1", headers=headers)
    assert response.status_code == 404
    assert response.json() == {"detail": "Game not found"}


def test_put_start_game_not_owner():
    headers = get_header("Admin_2")
    response = client.put("/game/start/?game_name=juego", headers=headers)
    assert response.status_code == 403
    assert response.json() == {"detail": "Only game owner can start the game"}

def test_put_start_game_not_enough_players():
    headers = get_header("Admin_1")
    response = client.put("/game/start/?game_name=juego1", headers=headers)
    assert response.status_code == 403
    assert response.json() == {"detail": "Not enough players"}

def test_put_start_game():
    headers = get_header("Admin_1")
    response = client.put("/game/start/?game_name=juego", headers=headers)
    assert response.status_code == 200
    assert response.json() == {
        "name": "juego",
        "password": "Player123",
        "status": "STARTED",
        "winner": None,
        "min_players": 5,
        "max_players": 5,
        "num_players": 5,
        "voldemort": response.json()["voldemort"],
        "players": response.json()["players"],
        "proclamations": {
            "DE_enacted_proclamations": 0,
            "PO_enacted_proclamations": 0,
            "discarded_proclamations": [],
            "proclamations": response.json()["proclamations"]["proclamations"]
        },
        "elections": {
            "headmaster": None,
            "headmaster_candidate": None,
            "minister": None,
            "minister_candidate": response.json()["elections"]["minister_candidate"],
            "minister_idx": response.json()["elections"]["minister_idx"],
            "rejected": 0,
            "votes": {}
        },
        "spells": [
            "ADIVINATION",
            "AVADA_KEDAVRA",
            "CRUCIO",
            "IMPERIUS"
        ],
        "chat": []
    }

def test_put_start_game_already_started():
    headers = get_header("Admin_1")
    response = client.put("/game/start/?game_name=juego", headers=headers)
    assert response.status_code == 403
    assert response.json() == {"detail": "Game already started"}
"""
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