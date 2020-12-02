from fastapi.testclient import TestClient
from fastapi import status

from .app import app

client = TestClient(app)
num_games = 5
num_players = 5
max_players = 5

def get_header(username):
    login = {
        "username": username,
        "password": "Admin123",
    }
    response = client.post("/login/", data=login)
    token = response.json()['access_token']
    return {"Authorization" : f'Bearer {token}'}

def get_candidates(game):
    minister_candidate = game["elections"]["players"][0]
    minister_username = game["players"][minister_candidate]["user_name"]
    headmaster_candidate = game["elections"]["players"][1]
    headmaster_username = game["players"][headmaster_candidate]["user_name"]
    return {"minister_user": minister_username,
            "headmaster_user": headmaster_username,
            "minister": minister_candidate,
            "headmaster": headmaster_candidate}

#REGISTER
def test_post_register_with_malformed_username():
    data = {
        "username": "Admin?",
        "email": "Admin_0@admin.com",
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

def test_post_register_with_malformed_email():
    data = {
        "username": "Admin_0", 
        "email": "Admin_0",
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

def test_post_register():
    for i in range(num_players + 1):
        data = {
            "username": f"Admin_{i}",
            "email": f"Admin_{i}@admin.com",
            "password": "Admin123"
        }
        response = client.post("/user/", data=data)
        assert response.status_code == 201
        assert response.json() == i+1

def test_post_register_with_existing_username():
    data = {
        "username": "Admin_0",
        "email":"Admin_0@admin.com",
        "password": "Admin123",
    }
    response = client.post("/user/", data=data)
    assert response.status_code == 403
    assert response.json() == {
        "detail":"Username or E-mail already exist"
    }

def test_post_register_with_existing_email():
    data = {
        "username": "Admin_0",
        "email": "Admin_0@admin.com",
        "password": "Admin123",
        }
    response = client.post("/user/", data=data)
    assert response.status_code == 403
    assert response.json() == {
        "detail": "Username or E-mail already exist"
    }

#LOGIN
def test_post_login_wrong_password():
    data = {
        "username": "Admin_0",
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

def test_post_login_with_username():
    data = {
        "username": "Admin_0",
        "password": "Admin123",
    }
    response = client.post("/login/", data=data)
    assert response.status_code == 201

def test_post_login_with_email():
    data = {
        "username": "Admin_0@admin.com",
        "password": "Admin123",
    }
    response = client.post("/login/", data=data)
    assert response.status_code == 201

#CHANGE PROFILE
def test_put_change_profile_with_malformed_username():
    headers = get_header("Admin_0")
    data = {
        "username": "Admin_0?",
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
    headers = get_header("Admin_0")
    data = {
        "email": "Admin_0",
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
    headers = get_header("Admin_0")
    data = {
        "full_name": "Admin_0",
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
    headers = get_header("Admin_0")
    data = {
        "email": "Admin_0@admin.com",
        "password": "none"
    }
    response = client.put("/user/", headers=headers, data=data)
    assert response.status_code == 401
    assert response.json() == {
        "detail": "Incorrect credentials"
    }

def test_put_change_profile_with_existing_username():
    headers = get_header("Admin_0")
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
    headers = get_header("Admin_0")
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
    headers = get_header("Admin_0")
    data = {
        "full_name": "Sergio Rodriguez",
        "password": "Admin123"
    }
    response = client.put("/user/", headers=headers, data=data)
    assert response.status_code == 200
    assert response.json() == {
        "username": "Admin_0",
        "email": "Admin_0@admin.com",
        "full_name": "Sergio Rodriguez",
        "password": response.json()['password'],
        "disabled": False
    }

#CREATE GAME
def test_post_create_game_with_malformed_game_name():
    headers = get_header("Admin_0")
    data={
        "game_name": "Juego_0?",
        "player_name": "Player_0",
        "max_players": max_players,
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
    headers = get_header("Admin_0")
    data={
        "game_name": "Juego_0",
        "player_name": "Player?",
        "max_players": max_players,
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
    headers = get_header("Admin_0")
    data={
        "game_name": "Juego_0",
        "player_name": "Player_0",
        "max_players": max_players,
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
    headers = get_header("Admin_0")
    for i in range(num_games):
        response = client.post("/game/", headers=headers,
            data={
                "game_name": f"Juego_{i}",
                "player_name": "Player_0",
                "max_players": max_players,
                "password": "Player123"
            }
        )
        assert response.status_code == 201
        assert response.json() == {
            "name": f"Juego_{i}",
            "password": "Player123",
            "status": "CREATED",
            "winner": None,
            "min_players": 5,
            "max_players": 5,
            "num_players": 1,
            "owner": "Admin_0",
            "voldemort": None,
            "players": {
                "Player_0": {
                    "name": "Player_0",
                    "user_name": "Admin_0",
                    "is_alive": True,
                    "role": None,
                    "loyalty": None
                }
            },
            "proclamations": None,
            "elections": None,
            "spells": [],
            "chat": ["system: Player_0 has joined the room!"]
        }

def test_post_create_game_with_existing_name():
    headers = get_header("Admin_0")
    data={
        "game_name": "Juego_0",
        "player_name": "Player_0",
        "max_players": max_players,
        "password": "Player123"
    }
    response = client.post("/game/", headers=headers, data=data)
    assert response.status_code == 403
    assert response.json() == {'detail': 'Game name already exist'}

#SEND MESSAGE
def test_post_send_message_game_not_found():
    headers = get_header("Admin_0")
    data = {
        "msg": "HOLA"
    }
    response = client.post("/game/chat/?player_name=Player_0&game_name=none", headers=headers, data=data)
    assert response.status_code == 404
    assert response.json() == {'detail': 'Game not found'}

def test_post_send_message_player_not_found():
    headers = get_header("Admin_0")
    data = {
        "msg": "HOLA"
    }
    response = client.post("/game/chat/?player_name=none&game_name=Juego_0", headers=headers, data=data)
    assert response.status_code == 404
    assert response.json() == {'detail': 'Player not found'}

def test_post_send_message_unauthorized():
    headers = get_header("Admin_1")
    data = {
        "msg": "HOLA"
    }
    response = client.post("/game/chat/?player_name=Player_0&game_name=Juego_0", headers=headers, data=data)
    assert response.status_code == 401
    assert response.json() == {'detail': 'Unauthorized'}

def test_post_send_message():
    headers = get_header("Admin_0")
    data = {
        "msg": "HOLA"
    }
    response = client.post("/game/chat/?player_name=Player_0&game_name=Juego_0", headers=headers, data=data)
    assert response.status_code == 200
    assert "Player_0: HOLA" in response.json()

#JOIN GAME
def test_put_join_game_with_malformed_player_name():
    headers = get_header("Admin_0")
    data = {
        "player_name": "Player?",
        "password": "Player123"
    }
    response = client.put("/game/?game_name=Juego_0", headers=headers, data=data)
    assert response.status_code == 422
    assert response.json() == {
        'detail': [{'ctx': {'pattern': '^[A-Z_a-z0-9]*$'},
                    'loc': ['body', 'player_name'],
                    'msg': 'string does not match regex "^[A-Z_a-z0-9]*$"',
                    'type': 'value_error.str.regex'}],
    }

def test_put_join_game_not_found():
    headers = get_header("Admin_0")
    data = {
        "player_name": "Player_2",
        "password": "Player123"
    }
    response = client.put("/game/?game_name=none", headers=headers, data=data)
    assert response.status_code == 404
    assert response.json() == {'detail': 'Game not found'}

def test_put_join_game_twice():
    headers = get_header("Admin_0")
    data = {
        "player_name": "Player_2",
        "password": "none"
    }
    response = client.put("/game/?game_name=Juego_0", headers=headers, data=data)
    assert response.status_code == 403
    assert response.json() == {'detail': 'A user cannot enter a game twice'}

def test_put_join_game_with_existing_player_name():
    headers = get_header("Admin_2")
    data = {
        "player_name": "Player_0",
        "password": "Player123"
    }
    response = client.put("/game/?game_name=Juego_0", headers=headers, data=data)
    assert response.status_code == 403
    assert response.json() == {'detail': 'Player name already exist in this game'}

def test_put_join_game():
    for i in range(num_games):
        for j in range(1, num_players):
            headers = get_header(f"Admin_{j}")
            data = {
                "player_name": f"Player_{j}",
                "password": "Player123"
            }
            response = client.put(f"/game/?game_name=Juego_{i}", headers=headers, data=data)
            assert response.status_code == 200
            assert len(response.json()['players']) == j+1

def test_put_join_game_full():
    headers = get_header("Admin_5")
    data = {
        "player_name": "Player",
        "password": "Player123"
    }
    response = client.put("/game/?game_name=Juego_0", headers=headers, data=data)
    assert response.status_code == 403
    assert response.json() == {'detail': 'Game full'}

#QUIT GAME
def test_delete_quit_game_not_found():
    headers = get_header("Admin_0")
    response = client.delete("/game/?player_name=Player_0&game_name=none", headers=headers)
    assert response.status_code == 404
    assert response.json() == {'detail': 'Game not found'}

def test_delete_quit_game_player_not_found():
    headers = get_header("Admin_0")
    response = client.delete("/game/?player_name=none&game_name=Juego_0", headers=headers)
    assert response.status_code == 404
    assert response.json() == {'detail': 'Player not found'}

def test_delete_quit_game_unauthorized():
    headers = get_header("Admin_0")
    response = client.delete("/game/?player_name=Player_1&game_name=Juego_0", headers=headers)
    assert response.status_code == 401
    assert response.json() == {'detail': 'Unauthorized'}

def test_delete_quit_game_unauthorized():
    headers = get_header(f"Admin_{num_players-1}")
    response = client.delete(f"/game/?player_name=Player_{num_players-1}&game_name=Juego_{num_games-1}", headers=headers)
    assert response.status_code == 200

#START GAME
def test_put_start_game_not_found():
    headers = get_header("Admin_0")
    response = client.put("/game/start/?game_name=none", headers=headers)
    assert response.status_code == 404
    assert response.json() == {"detail": "Game not found"}

def test_put_start_game_not_owner():
    headers = get_header("Admin_5")
    response = client.put("/game/start/?game_name=Juego_0", headers=headers)
    assert response.status_code == 403
    assert response.json() == {"detail": "Only game owner can start the game"}

def test_put_start_game_not_enough_players():
    headers = get_header("Admin_0")
    response = client.put(f"/game/start/?game_name=Juego_{num_games-1}", headers=headers)
    assert response.status_code == 403
    assert response.json() == {"detail": "Not enough players"}

def test_put_start_game():
    global started_games
    started_games = []
    headers = get_header("Admin_0")
    for i in range(num_games-1):
        response = client.put(f"/game/start/?game_name=Juego_{i}", headers=headers)
        assert response.status_code == 200
        assert response.json()['status'] == 'STARTED'
        assert len(response.json()['players']) == response.json()['num_players']
        assert response.json()['proclamations'] == {
            "DE_enacted_proclamations": 0,
            "PO_enacted_proclamations": 0,
            "discarded": [],
            "hand": [],
            "deck": response.json()["proclamations"]["deck"]
        }
        assert response.json()['elections'] == {
            "headmaster": None,
            "headmaster_candidate": None,
            "minister": None,
            "minister_candidate": response.json()["elections"]["minister_candidate"],
            "players": response.json()["elections"]["players"],
            "votes": {},
            "result": None,
            "rejected": 0,
        }
        started_games.append(response.json())

def test_put_start_game_already_started():
    user = started_games[0]["owner"]
    headers = get_header(user)
    response = client.put(f"/game/start/?game_name={started_games[0]['name']}", headers=headers)
    assert response.status_code == 403
    assert response.json() == {"detail": "Game already started"}

#QUIT GAME
def test_delete_quit_game_started():
    headers = get_header("Admin_0")
    response = client.delete("/game/?player_name=Player_0&game_name=Juego_0", headers=headers)
    assert response.status_code == 403
    assert response.json() == {'detail': 'Cannot quit a started game'}

#CHOOSE DIRECTOR
def test_put_choose_director_game_not_found():
    candidates = get_candidates(started_games[0])
    headers = get_header(candidates["minister_user"])
    response = client.put(f"/game/elections/nominate/?candidate_name={candidates['headmaster']}&player_name={candidates['minister']}&game_name=none", headers=headers)
    assert response.status_code == 404
    assert response.json() == {"detail": "Game not found"}

def test_put_choose_director_player_not_found():
    candidates = get_candidates(started_games[0])
    headers = get_header(candidates["minister_user"])
    response = client.put(f"/game/elections/nominate/?candidate_name={candidates['headmaster']}&player_name=none&game_name={started_games[0]['name']}", headers=headers)
    assert response.status_code == 404
    assert response.json() == {"detail": "Player not found"}

def test_put_choose_director_unauthorized():
    candidates = get_candidates(started_games[0])
    headers = get_header("Admin_5")
    response = client.put(f"/game/elections/nominate/?candidate_name={candidates['headmaster']}&player_name={candidates['minister']}&game_name={started_games[0]['name']}", headers=headers)
    assert response.status_code == 401
    assert response.json() == {"detail": "Unauthorized"}

def test_put_choose_director_game_not_started():
    headers = get_header("Admin_0")
    response = client.put(f"/game/elections/nominate/?candidate_name=none&player_name=Player_0&game_name=Juego_{num_games-1}", headers=headers)
    assert response.status_code == 403
    assert response.json() == {"detail": "Game not started"}

def test_put_choose_director_candidate_not_found():
    candidates = get_candidates(started_games[0])
    headers = get_header(candidates["minister_user"])
    response = client.put(f"/game/elections/nominate/?candidate_name=none&player_name={candidates['minister']}&game_name={started_games[0]['name']}", headers=headers)
    assert response.status_code == 404
    assert response.json() == {"detail": "Candidate name not found"}

def test_put_choose_director_not_minister_candidate():
    candidates = get_candidates(started_games[0])
    headers = get_header(candidates["headmaster_user"])
    response = client.put(f"/game/elections/nominate/?candidate_name={candidates['minister']}&player_name={candidates['headmaster']}&game_name={started_games[0]['name']}", headers=headers)
    assert response.status_code == 403
    assert response.json() == {"detail": "Only the minister candidate can choose the headmaster candidate"}

def test_put_choose_director_not_eligible_minister_candidate():
    candidates = get_candidates(started_games[0])
    headers = get_header(candidates["minister_user"])
    response = client.put(f"/game/elections/nominate/?candidate_name={candidates['minister']}&player_name={candidates['minister']}&game_name={started_games[0]['name']}", headers=headers)
    assert response.status_code == 403
    assert response.json() == {"detail": "The candidate is not eligible"}

def test_put_choose_director():
    for i in range(num_games-2):
        candidates = get_candidates(started_games[i])
        headers = get_header(candidates["minister_user"])
        response = client.put(f"/game/elections/nominate/?candidate_name={candidates['headmaster']}&player_name={candidates['minister']}&game_name={started_games[i]['name']}", headers=headers)
        assert response.status_code == 200
        assert response.json()['elections']['headmaster_candidate'] == candidates['headmaster']

#VOTE LUMOS
def test_put_vote_lumos_not_valid_vote():
    headers = get_header(f"Admin_0")
    response = client.put(f"/game/elections/vote/?vote=SARASA&player_name=Player_0&game_name={started_games[0]['name']}", headers=headers)
    assert response.status_code == 422

def test_put_vote_lumos_game_not_found():
    headers = get_header(f"Admin_0")
    response = client.put(f"/game/elections/vote/?vote=LUMOS&player_name=Player_0&game_name=none", headers=headers)
    assert response.status_code == 404
    assert response.json() == {"detail": "Game not found"}

def test_put_vote_lumos_player_not_found():
    headers = get_header(f"Admin_0")
    response = client.put(f"/game/elections/vote/?vote=LUMOS&player_name=none&game_name={started_games[0]['name']}", headers=headers)
    assert response.status_code == 404
    assert response.json() == {"detail": "Player not found"}

def test_put_vote_lumos_unauthorized():
    headers = get_header(f"Admin_5")
    response = client.put(f"/game/elections/vote/?vote=LUMOS&player_name=Player_0&game_name={started_games[0]['name']}", headers=headers)
    assert response.status_code == 401
    assert response.json() == {"detail": "Unauthorized"}

def test_put_vote_lumos_game_not_started():
    headers = get_header(f"Admin_0")
    response = client.put(f"/game/elections/vote/?vote=LUMOS&player_name=Player_0&game_name=Juego_{num_games-1}", headers=headers)
    assert response.status_code == 403
    assert response.json() == {"detail": "Game not started"}

def test_put_vote_lumos_headmaster_not_defined():
    headers = get_header(f"Admin_0")
    response = client.put(f"/game/elections/vote/?vote=LUMOS&player_name=Player_0&game_name={started_games[num_games-2]['name']}", headers=headers)
    assert response.status_code == 403
    assert response.json() == {"detail": "Headmaster candidate not defined"}

def test_put_vote_lumos():
    global voted_games
    voted_games = []
    for i in range(num_games-2):
        candidates = get_candidates(started_games[i])
        for j in range(num_players):
            headers = get_header(f"Admin_{j}")
            response = client.put(f"/game/elections/vote/?vote=LUMOS&player_name=Player_{j}&game_name={started_games[i]['name']}", headers=headers)
            assert response.status_code == 200
            if j == 0:
                response = client.put(f"/game/elections/vote/?vote=LUMOS&player_name=Player_{j}&game_name={started_games[i]['name']}", headers=headers)
                assert response.status_code == 403
                assert response.json() == {"detail": "The player has already voted"}
            if 0 < j < 4:
                assert f"Player_{j}" in response.json()['elections']['votes']

        assert not response.json()['elections']['votes']
        assert response.json()['elections']['minister'] == candidates['minister']
        assert response.json()['elections']['headmaster'] == candidates['headmaster']
        voted_games.append(response.json())

#CHOOSE DIRECTOR
def test_put_choose_director_not_eligible_minister():
    old_candidates = get_candidates(started_games[0])
    new_candidates = get_candidates(voted_games[0])
    headers = get_header(new_candidates["minister_user"])
    response = client.put(f"/game/elections/nominate/?candidate_name={old_candidates['minister']}&player_name={new_candidates['minister']}&game_name={started_games[0]['name']}", headers=headers)
    assert response.status_code == 403
    assert response.json() == {"detail": "The candidate is not eligible"}

def test_put_choose_director_not_eligible_headmaster():
    old_candidates = get_candidates(started_games[0])
    new_candidates = get_candidates(voted_games[0])
    headers = get_header(new_candidates["minister_user"])
    response = client.put(f"/game/elections/nominate/?candidate_name={old_candidates['headmaster']}&player_name={new_candidates['minister']}&game_name={started_games[0]['name']}", headers=headers)
    assert response.status_code == 403
    assert response.json() == {"detail": "The candidate is not eligible"}

#GET PROCLAMATIONS
def test_get_get_proclamations_game_not_found():
    candidates = get_candidates(started_games[0])
    headers = get_header(candidates["minister_user"])
    response = client.get(f"/game/proclamations/?player_name={candidates['minister']}&game_name=none", headers=headers)
    assert response.status_code == 404
    assert response.json() == {"detail": "Game not found"}

def test_get_get_proclamations_player_not_found():
    candidates = get_candidates(started_games[0])
    headers = get_header(candidates["minister_user"])
    response = client.get(f"/game/proclamations/?player_name=none&game_name={started_games[0]['name']}", headers=headers)
    assert response.status_code == 404
    assert response.json() == {"detail": "Player not found"}

def test_get_get_proclamations_unauthorized():
    candidates = get_candidates(started_games[0])
    headers = get_header("Admin_5")
    response = client.get(f"/game/proclamations/?player_name={candidates['minister']}&game_name={started_games[0]['name']}", headers=headers)
    assert response.status_code == 401
    assert response.json() == {"detail": "Unauthorized"}

def test_get_get_proclamations_game_not_started():
    headers = get_header("Admin_0")
    response = client.get(f"/game/proclamations/?player_name=Player_0&game_name=Juego_{num_games-1}", headers=headers)
    assert response.status_code == 403
    assert response.json() == {"detail": "Game not started"}

def test_get_get_proclamations_not_minister():
    candidates = get_candidates(started_games[0])
    headers = get_header(candidates["headmaster_user"])
    response = client.get(f"/game/proclamations/?player_name={candidates['headmaster']}&game_name={started_games[0]['name']}", headers=headers)
    assert response.status_code == 403
    assert response.json() == {"detail": "Only minister can get proclamations"}

def test_get_get_proclamations():
    candidates = get_candidates(started_games[0])
    headers = get_header(candidates["minister_user"])
    response = client.get(f"/game/proclamations/?player_name={candidates['minister']}&game_name={started_games[0]['name']}", headers=headers)
    assert response.status_code == 200
    assert len(response.json()) == 3

def test_get_get_proclamations_still_have_in_hand():
    candidates = get_candidates(started_games[0])
    headers = get_header(candidates["minister_user"])
    response = client.get(f"/game/proclamations/?player_name={candidates['minister']}&game_name={started_games[0]['name']}", headers=headers)
    assert response.status_code == 403
    assert response.json() == {"detail": "Still have proclamations in hand"}

#DISCARD PROCLAMATION
def test_put_discard_proclamation_not_valid_loyaly():
    candidates = get_candidates(started_games[0])
    headers = get_header(candidates["minister_user"])
    response = client.put(f"/game/proclamations/discard/?loyalty=SARASA&player_name={candidates['minister']}&game_name={started_games[0]['name']}", headers=headers)
    assert response.status_code == 422

def test_put_discard_proclamation_game_not_found():
    candidates = get_candidates(started_games[0])
    headers = get_header(candidates["minister_user"])
    response = client.put(f"/game/proclamations/discard/?loyalty=PHOENIX_ORDER&player_name={candidates['minister']}&game_name=none", headers=headers)
    assert response.status_code == 404
    assert response.json() == {"detail": "Game not found"}

def test_put_discard_proclamation_player_not_found():
    candidates = get_candidates(started_games[0])
    headers = get_header(candidates["minister_user"])
    response = client.put(f"/game/proclamations/discard/?loyalty=PHOENIX_ORDER&player_name=none&game_name={started_games[0]['name']}", headers=headers)
    assert response.status_code == 404
    assert response.json() == {"detail": "Player not found"}

def test_put_discard_proclamation_unauthorized():
    candidates = get_candidates(started_games[0])
    headers = get_header("Admin_5")
    response = client.put(f"/game/proclamations/discard/?loyalty=PHOENIX_ORDER&player_name={candidates['minister']}&game_name={started_games[0]['name']}", headers=headers)
    assert response.status_code == 401
    assert response.json() == {"detail": "Unauthorized"}

def test_put_discard_proclamation_game_not_started():
    headers = get_header("Admin_0")
    response = client.put(f"/game/proclamations/discard/?loyalty=PHOENIX_ORDER&player_name=Player_0&game_name=Juego_{num_games-1}", headers=headers)
    assert response.status_code == 403
    assert response.json() == {"detail": "Game not started"}

def test_put_discard_proclamation_not_minister_or_headmaster():
    new_candidates = get_candidates(voted_games[0])
    headers = get_header(new_candidates["headmaster_user"])
    response = client.put(f"/game/proclamations/discard/?loyalty=PHOENIX_ORDER&player_name={new_candidates['headmaster']}&game_name={started_games[0]['name']}", headers=headers)
    assert response.status_code == 403
    assert response.json() == {"detail": "Only minister or headmaster can discard a proclamation"}

def test_put_discard_proclamation():
    candidates = get_candidates(started_games[0])
    headers = get_header(candidates["minister_user"])
    response = client.put(f"/game/proclamations/discard/?loyalty=PHOENIX_ORDER&player_name={candidates['minister']}&game_name={started_games[0]['name']}", headers=headers)
    if response.status_code == 200:
        assert 'PHOENIX_ORDER' in response.json()['proclamations']['discarded']
        headers = get_header(candidates["headmaster_user"])
        response = client.put(f"/game/proclamations/discard/?loyalty=DEATH_EATERS&player_name={candidates['headmaster']}&game_name={started_games[0]['name']}", headers=headers)
        if response.status_code == 200:
            assert 'DEATH_EATERS' in response.json()['proclamations']['discarded']
        elif response.status_code == 403:
            assert response.json() == {"detail": "Proclamation not in hand"}
    elif response.status_code == 403:
        assert response.json() == {"detail": "Proclamation not in hand"}

#CAST SPELL DIVINATION
def test_put_cast_spell_game_not_found():
    candidates = get_candidates(started_games[0])
    headers = get_header(candidates["minister_user"])
    response = client.put(f"/game/spells/?spell=DIVINATION&player_name={candidates['minister']}&game_name=none", headers=headers)
    assert response.status_code == 404
    assert response.json() == {"detail": "Game not found"}

def test_put_cast_spell_player_not_found():
    candidates = get_candidates(started_games[0])
    headers = get_header(candidates["minister_user"])
    response = client.put(f"/game/spells/?spell=DIVINATION&player_name=none&game_name={started_games[0]['name']}", headers=headers)
    assert response.status_code == 404
    assert response.json() == {"detail": "Player not found"}

def test_put_cast_spell_unauthorized():
    candidates = get_candidates(started_games[0])
    headers = get_header(candidates["headmaster_user"])
    response = client.put(f"/game/spells/?spell=DIVINATION&player_name={candidates['minister']}&game_name={started_games[0]['name']}", headers=headers)
    assert response.status_code == 401
    assert response.json() == {"detail": "Unauthorized"}

def test_put_cast_spell_game_not_started():
    headers = get_header("Admin_0")
    response = client.put(f"/game/spells/?spell=DIVINATION&player_name=Player_0&game_name=Juego_{num_games-1}", headers=headers)
    assert response.status_code == 403
    assert response.json() == {"detail": "Game not started"}

def test_put_cast_spell_target_not_found():
    candidates = get_candidates(started_games[0])
    headers = get_header(candidates["minister_user"])
    response = client.put(f"/game/spells/?spell=DIVINATION&target_name=none&player_name={candidates['minister']}&game_name={started_games[0]['name']}", headers=headers)
    assert response.status_code == 404
    assert response.json() == {"detail": "Target name not found"}

def test_put_cast_spell_on_yourself():
    candidates = get_candidates(started_games[0])
    headers = get_header(candidates["minister_user"])
    response = client.put(f"/game/spells/?spell=DIVINATION&target_name={candidates['minister']}&player_name={candidates['minister']}&game_name={started_games[0]['name']}", headers=headers)
    assert response.status_code == 403
    assert response.json() == {"detail": "Cannot cast a spell on yourself"}

def test_put_cast_spell_not_minister():
    candidates = get_candidates(started_games[0])
    headers = get_header(candidates["headmaster_user"])
    response = client.put(f"/game/spells/?spell=DIVINATION&target_name={candidates['minister']}&player_name={candidates['headmaster']}&game_name={started_games[0]['name']}", headers=headers)
    assert response.status_code == 403
    assert response.json() == {"detail": "Only minister can cast a spell"}
"""
def test_put_cast_spell_divination():
    candidates = get_candidates(started_games[0])
    headers = get_header(candidates["minister_user"])
    response = client.put(f"/game/spells/?spell=DIVINATION&player_name={candidates['minister']}&game_name={started_games[0]['name']}", headers=headers)
    assert response.status_code == 200
    assert len(response.json()) == 3

def test_put_cast_spell_divination_not_available():
    candidates = get_candidates(started_games[0])
    headers = get_header(candidates["minister_user"])
    response = client.put(f"/game/spells/?spell=DIVINATION&player_name={candidates['minister']}&game_name={started_games[0]['name']}", headers=headers)
    assert response.status_code == 403
    assert response.json() == {"detail": "Spell is not available"}

def test_put_cast_spell_avada_kedavra():
    candidates = get_candidates(started_games[0])
    headers = get_header(candidates["minister_user"])
    response = client.put(f"/game/spells/?spell=AVADA_KEDAVRA&target_name={candidates['headmaster']}&player_name={candidates['minister']}&game_name={started_games[0]['name']}", headers=headers)
    assert response.status_code == 200
    assert response.json()['players'][candidates['headmaster']]['is_alive'] == False

def test_websocket():
    for i in range(10):
        with client.websocket_connect("/lobby/") as websocket:
            data = websocket.receive_json()
            assert data == []
"""
