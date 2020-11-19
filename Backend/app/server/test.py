from fastapi.testclient import TestClient
from fastapi import status

from .app import app

client = TestClient(app)


def get_header(username):
    login = {
        "username": username,
        "password": "Admin123",
    }
    response = client.post("/login/", data=login)
    token = response.json()['access_token']
    return {"Authorization" : f'Bearer {token}'}

def get_candidates(game):
    minister_idx = game["elections"]["minister_idx"]
    minister_candidate = list(game["players"])[minister_idx]
    minister_username = game["players"][minister_candidate]["user_name"]
    headmaster_idx = (minister_idx + 1) % game["num_players"]
    headmaster_candidate = list(game["players"])[headmaster_idx]
    headmaster_username = game["players"][headmaster_candidate]["user_name"]
    return {"minister_user": minister_username,
            "headmaster_user": headmaster_username,
            "minister": minister_candidate,
            "headmaster": headmaster_candidate}

#REGISTER
def test_post_register():
    for i in range(6):
        data = {
            "username": f"Admin_{i}",
            "email": f"Admin_{i}@admin.com",
            "password": "Admin123"
        }
        response = client.post("/user/", data=data)
        assert response.status_code == 201
        assert response.json() == i+1

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

def test_post_register_with_existing_username():
    data = {
        "username": "Admin_1", 
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
        "email": "Admin_0@admin.com",
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
    assert response.json() == {
        "username": "Admin_1",
        "email": "Admin_1@admin.com",
        "full_name": "Sergio Rodriguez",
        "password": response.json()['password'],
        "disabled": False
    }

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
    global game
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
    game = response.json()
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
        "owner": "Player_1",
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
        assert len(response.json()['players']) == i

def test_put_join_game_full():
    headers = get_header("Admin_0")
    data = {
        "player_name": "Player",
        "password": "Player123"
    }
    response = client.put("/game/?game_name=juego", headers=headers, data=data)
    assert response.status_code == 403
    assert response.json() == {'detail': 'Game full'}

#START GAME
def test_put_start_game_not_found():
    user = game["players"][game["owner"]]["user_name"]
    headers = get_header(user)
    response = client.put("/game/start/?game_name=juego_1", headers=headers)
    assert response.status_code == 404
    assert response.json() == {"detail": "Game not found"}


def test_put_start_game_not_owner():
    headers = get_header("Admin_2")
    response = client.put("/game/start/?game_name=juego", headers=headers)
    assert response.status_code == 403
    assert response.json() == {"detail": "Only game owner can start the game"}

def test_put_start_game_not_enough_players():
    user = game["players"][game["owner"]]["user_name"]
    headers = get_header(user)
    response = client.put("/game/start/?game_name=juego1", headers=headers)
    assert response.status_code == 403
    assert response.json() == {"detail": "Not enough players"}

def test_put_start_game():
    global started_game
    user = game["players"][game["owner"]]["user_name"]
    headers = get_header(user)
    response = client.put("/game/start/?game_name=juego", headers=headers)
    started_game = response.json()
    assert response.status_code == 200
    assert response.json()['status'] == 'STARTED'
    assert len(response.json()['players']) == response.json()['num_players']
    assert response.json()['proclamations'] == {
        "DE_enacted_proclamations": 0,
        "PO_enacted_proclamations": 0,
        "discarded_proclamations": [],
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
        "minister_idx": response.json()["elections"]["minister_idx"]
    }

def test_put_start_game_already_started():
    user = started_game["players"][started_game["owner"]]["user_name"]
    headers = get_header(user)
    response = client.put("/game/start/?game_name=juego", headers=headers)
    assert response.status_code == 403
    assert response.json() == {"detail": "Game already started"}


#CHOOSE DIRECTOR
def test_put_choose_director_game_not_found():
    candidates = get_candidates(started_game)
    headers = get_header(candidates["minister_user"])
    response = client.put(f"/game/elections/nominate/?candidate_name={candidates['headmaster']}&player_name={candidates['minister']}&game_name=none", headers=headers)
    assert response.status_code == 404
    assert response.json() == {"detail": "Game not found"}

def test_put_choose_director_game_not_started():
    candidates = get_candidates(started_game)
    headers = get_header(candidates["minister_user"])
    response = client.put(f"/game/elections/nominate/?candidate_name={candidates['headmaster']}&player_name={candidates['minister']}&game_name=juego1", headers=headers)
    assert response.status_code == 403
    assert response.json() == {"detail": "Game not started"}

def test_put_choose_director_player_not_found():
    candidates = get_candidates(started_game)
    headers = get_header(candidates["minister_user"])
    response = client.put(f"/game/elections/nominate/?candidate_name={candidates['headmaster']}&player_name=none&game_name={started_game['name']}", headers=headers)
    assert response.status_code == 404
    assert response.json() == {"detail": "Player not found"}

def test_put_choose_director_unauthorized():
    candidates = get_candidates(started_game)
    headers = get_header("Admin_0")
    response = client.put(f"/game/elections/nominate/?candidate_name={candidates['headmaster']}&player_name={candidates['minister']}&game_name={started_game['name']}", headers=headers)
    assert response.status_code == 401
    assert response.json() == {"detail": "Unauthorized"}

def test_put_choose_director_candidate_not_found():
    candidates = get_candidates(started_game)
    headers = get_header(candidates["minister_user"])
    response = client.put(f"/game/elections/nominate/?candidate_name=none&player_name={candidates['minister']}&game_name={started_game['name']}", headers=headers)
    assert response.status_code == 404
    assert response.json() == {"detail": "Candidate name not found"}

def test_put_choose_director_not_minister_candidate():
    candidates = get_candidates(started_game)
    headers = get_header(candidates["headmaster_user"])
    response = client.put(f"/game/elections/nominate/?candidate_name={candidates['minister']}&player_name={candidates['headmaster']}&game_name={started_game['name']}", headers=headers)
    assert response.status_code == 403
    assert response.json() == {"detail": "Only the minister candidate can choose the headmaster candidate"}

def test_put_choose_director_not_eligible_minister_candidate():
    candidates = get_candidates(started_game)
    headers = get_header(candidates["minister_user"])
    response = client.put(f"/game/elections/nominate/?candidate_name={candidates['minister']}&player_name={candidates['minister']}&game_name={started_game['name']}", headers=headers)
    assert response.status_code == 403
    assert response.json() == {"detail": "The candidate is not eligible"}

#VOTE
def test_put_vote_headmaster_not_defined():
    headers = get_header(f"Admin_1")
    response = client.put(f"/game/elections/vote/?vote=LUMOS&player_name=Player_1&game_name=juego", headers=headers)
    assert response.status_code == 403
    assert response.json() == {"detail": "Headmaster candidate not defined"}

#CHOOSE DIRECTOR
def test_put_choose_director():
    candidates = get_candidates(started_game)
    headers = get_header(candidates["minister_user"])
    response = client.put(f"/game/elections/nominate/?candidate_name={candidates['headmaster']}&player_name={candidates['minister']}&game_name={started_game['name']}", headers=headers)
    assert response.status_code == 200
    assert response.json()['elections']['headmaster_candidate'] == candidates['headmaster']

#VOTE
def test_put_vote_game_not_found():
    headers = get_header(f"Admin_1")
    response = client.put(f"/game/elections/vote/?vote=LUMOS&player_name=Player_1&game_name=none", headers=headers)
    assert response.status_code == 404
    assert response.json() == {"detail": "Game not found"}

def test_put_vote_game_not_started():
    headers = get_header(f"Admin_1")
    response = client.put(f"/game/elections/vote/?vote=LUMOS&player_name=Player_1&game_name=juego1", headers=headers)
    assert response.status_code == 403
    assert response.json() == {"detail": "Game not started"}

def test_put_vote_player_not_found():
    headers = get_header(f"Admin_1")
    response = client.put(f"/game/elections/vote/?vote=LUMOS&player_name=none&game_name=juego", headers=headers)
    assert response.status_code == 404
    assert response.json() == {"detail": "Player not found"}

def test_put_vote_unauthorized():
    headers = get_header(f"Admin_0")
    response = client.put(f"/game/elections/vote/?vote=LUMOS&player_name=Player_1&game_name=juego", headers=headers)
    assert response.status_code == 401
    assert response.json() == {"detail": "Unauthorized"}

def test_put_vote_not_valid_vote():
    headers = get_header(f"Admin_1")
    response = client.put(f"/game/elections/vote/?vote=SARASA&player_name=Player_1&game_name=juego", headers=headers)
    assert response.status_code == 422

def test_put_vote():
    headers = get_header(f"Admin_1")
    response = client.put(f"/game/elections/vote/?vote=LUMOS&player_name=Player_1&game_name=juego", headers=headers)
    assert response.status_code == 200
    assert response.json()['elections']['votes'] == {"Player_1": 'LUMOS'}

def test_put_vote_player_already_voted():
    headers = get_header(f"Admin_1")
    response = client.put(f"/game/elections/vote/?vote=LUMOS&player_name=Player_1&game_name=juego", headers=headers)
    assert response.status_code == 403
    assert response.json() == {"detail": "The player has already voted"}

def test_put_vote_rest():
    global voted_game
    for i in range(2, 6):
        headers = get_header(f"Admin_{i}")
        response = client.put(f"/game/elections/vote/?vote=LUMOS&player_name=Player_{i}&game_name=juego", headers=headers)
        assert response.status_code == 200
        if i == 5:
            assert not response.json()['elections']['votes']
            assert len(response.json()['elections']['votes']) == 0
        else:
            assert f"Player_{i}" in response.json()['elections']['votes']
            assert len(response.json()['elections']['votes']) == i
    voted_game = response.json()

#CHOOSE DIRECTOR
def test_put_choose_director_not_eligible_minister():
    old_candidates = get_candidates(started_game)
    new_candidates = get_candidates(voted_game)
    headers = get_header(new_candidates["minister_user"])
    response = client.put(f"/game/elections/nominate/?candidate_name={old_candidates['minister']}&player_name={new_candidates['minister']}&game_name={voted_game['name']}", headers=headers)
    assert response.status_code == 403
    assert response.json() == {"detail": "The candidate is not eligible"}

def test_put_choose_director_not_eligible_headmaster():
    old_candidates = get_candidates(started_game)
    new_candidates = get_candidates(voted_game)
    headers = get_header(new_candidates["minister_user"])
    response = client.put(f"/game/elections/nominate/?candidate_name={old_candidates['headmaster']}&player_name={new_candidates['minister']}&game_name={voted_game['name']}", headers=headers)
    assert response.status_code == 403
    assert response.json() == {"detail": "The candidate is not eligible"}

#GET PROCLAMATIONS
def test_get_get_proclamations_game_not_found():
    old_candidates = get_candidates(started_game)
    headers = get_header(old_candidates["minister_user"])
    response = client.get(f"/game/proclamations/?player_name={old_candidates['minister']}&game_name=none", headers=headers)
    assert response.status_code == 404
    assert response.json() == {"detail": "Game not found"}

def test_get_get_proclamations_game_not_started():
    old_candidates = get_candidates(started_game)
    headers = get_header(old_candidates["minister_user"])
    response = client.get(f"/game/proclamations/?player_name={old_candidates['minister']}&game_name=juego1", headers=headers)
    assert response.status_code == 403
    assert response.json() == {"detail": "Game not started"}

def test_get_get_proclamations_player_not_found():
    old_candidates = get_candidates(started_game)
    headers = get_header(old_candidates["minister_user"])
    response = client.get(f"/game/proclamations/?player_name=none&game_name={voted_game['name']}", headers=headers)
    assert response.status_code == 404
    assert response.json() == {"detail": "Player not found"}

def test_get_get_proclamations_unauthorized():
    old_candidates = get_candidates(started_game)
    headers = get_header("Admin_0")
    response = client.get(f"/game/proclamations/?player_name={old_candidates['minister']}&game_name={voted_game['name']}", headers=headers)
    assert response.status_code == 401
    assert response.json() == {"detail": "Unauthorized"}

def test_get_get_proclamations_not_minister():
    old_candidates = get_candidates(started_game)
    headers = get_header(old_candidates["headmaster_user"])
    response = client.get(f"/game/proclamations/?player_name={old_candidates['headmaster']}&game_name={voted_game['name']}", headers=headers)
    assert response.status_code == 403
    assert response.json() == {"detail": "Only minister can get proclamations"}

def test_get_get_proclamations():
    old_candidates = get_candidates(started_game)
    headers = get_header(old_candidates["minister_user"])
    response = client.get(f"/game/proclamations/?player_name={old_candidates['minister']}&game_name={voted_game['name']}", headers=headers)
    assert response.status_code == 200
    assert len(response.json()) == 3


#DISCARD PROCLAMATION
def test_put_discard_proclamation_game_not_found():
    old_candidates = get_candidates(started_game)
    headers = get_header(old_candidates["minister_user"])
    response = client.put(f"/game/proclamations/discard/?loyalty=PHOENIX_ORDER&player_name={old_candidates['minister']}&game_name=none", headers=headers)
    assert response.status_code == 404
    assert response.json() == {"detail": "Game not found"}

def test_put_discard_proclamation_game_not_started():
    old_candidates = get_candidates(started_game)
    headers = get_header(old_candidates["minister_user"])
    response = client.put(f"/game/proclamations/discard/?loyalty=PHOENIX_ORDER&player_name={old_candidates['minister']}&game_name=juego1", headers=headers)
    assert response.status_code == 403
    assert response.json() == {"detail": "Game not started"}

def test_put_discard_proclamation_player_not_found():
    old_candidates = get_candidates(started_game)
    headers = get_header(old_candidates["minister_user"])
    response = client.put(f"/game/proclamations/discard/?loyalty=PHOENIX_ORDER&player_name=none&game_name={voted_game['name']}", headers=headers)
    assert response.status_code == 404
    assert response.json() == {"detail": "Player not found"}

def test_put_discard_proclamation_unauthorized():
    old_candidates = get_candidates(started_game)
    headers = get_header("Admin_0")
    response = client.put(f"/game/proclamations/discard/?loyalty=PHOENIX_ORDER&player_name={old_candidates['minister']}&game_name={voted_game['name']}", headers=headers)
    assert response.status_code == 401
    assert response.json() == {"detail": "Unauthorized"}

def test_put_discard_proclamation_not_valid_loyaly():
    old_candidates = get_candidates(started_game)
    headers = get_header(old_candidates["minister_user"])
    response = client.put(f"/game/proclamations/discard/?loyalty=SARASA&player_name={old_candidates['minister']}&game_name={voted_game['name']}", headers=headers)
    assert response.status_code == 422

def test_put_discard_proclamation_not_minister_or_headmaster():
    new_candidates = get_candidates(voted_game)
    headers = get_header(new_candidates["headmaster_user"])
    response = client.put(f"/game/proclamations/discard/?loyalty=PHOENIX_ORDER&player_name={new_candidates['headmaster']}&game_name={voted_game['name']}", headers=headers)
    assert response.status_code == 403
    assert response.json() == {"detail": "Only minister or headmaster can discard a proclamation"}

def test_put_discard_proclamation_minister():
    old_candidates = get_candidates(started_game)
    headers = get_header(old_candidates["minister_user"])
    response = client.put(f"/game/proclamations/discard/?loyalty=PHOENIX_ORDER&player_name={old_candidates['minister']}&game_name={voted_game['name']}", headers=headers)
    assert response.status_code == 200
    assert response.json()['proclamations']['discarded_proclamations'] == ['PHOENIX_ORDER']

def test_put_discard_proclamation_headmaster():
    old_candidates = get_candidates(started_game)
    headers = get_header(old_candidates["headmaster_user"])
    response = client.put(f"/game/proclamations/discard/?loyalty=DEATH_EATERS&player_name={old_candidates['headmaster']}&game_name={voted_game['name']}", headers=headers)
    assert response.status_code == 200
    assert response.json()['proclamations']['discarded_proclamations'] == ['PHOENIX_ORDER', 'DEATH_EATERS']

#ENACT PROCLAMATION
def test_put_enact_proclamation_game_not_found():
    old_candidates = get_candidates(started_game)
    headers = get_header(old_candidates["minister_user"])
    response = client.put(f"/game/proclamations/enact/?loyalty=DEATH_EATERS&player_name={old_candidates['minister']}&game_name=none", headers=headers)
    assert response.status_code == 404
    assert response.json() == {"detail": "Game not found"}

def test_put_enact_proclamation_game_not_started():
    old_candidates = get_candidates(started_game)
    headers = get_header(old_candidates["minister_user"])
    response = client.put(f"/game/proclamations/enact/?loyalty=DEATH_EATERS&player_name={old_candidates['minister']}&game_name=juego1", headers=headers)
    assert response.status_code == 403
    assert response.json() == {"detail": "Game not started"}

def test_put_enact_proclamation_player_not_found():
    old_candidates = get_candidates(started_game)
    headers = get_header(old_candidates["minister_user"])
    response = client.put(f"/game/proclamations/enact/?loyalty=DEATH_EATERS&player_name=none&game_name={voted_game['name']}", headers=headers)
    assert response.status_code == 404
    assert response.json() == {"detail": "Player not found"}

def test_put_enact_proclamation_unauthorized():
    old_candidates = get_candidates(started_game)
    headers = get_header("Admin_0")
    response = client.put(f"/game/proclamations/enact/?loyalty=DEATH_EATERS&player_name={old_candidates['minister']}&game_name={voted_game['name']}", headers=headers)
    assert response.status_code == 401
    assert response.json() == {"detail": "Unauthorized"}

def test_put_enact_proclamation_not_valid_loyaly():
    old_candidates = get_candidates(started_game)
    headers = get_header(old_candidates["minister_user"])
    response = client.put(f"/game/proclamations/enact/?loyalty=SARASA&player_name={old_candidates['minister']}&game_name={voted_game['name']}", headers=headers)
    assert response.status_code == 422

def test_put_enact_proclamation_not_headmaster():
    old_candidates = get_candidates(started_game)
    headers = get_header(old_candidates["minister_user"])
    response = client.put(f"/game/proclamations/enact/?loyalty=DEATH_EATERS&player_name={old_candidates['minister']}&game_name={voted_game['name']}", headers=headers)
    assert response.status_code == 403
    assert response.json() == {"detail": "Only headmaster can enact a proclamation"}

def test_put_enact_proclamation_headmaster():
    old_candidates = get_candidates(started_game)
    headers = get_header(old_candidates["headmaster_user"])
    response = client.put(f"/game/proclamations/enact/?loyalty=DEATH_EATERS&player_name={old_candidates['headmaster']}&game_name={voted_game['name']}", headers=headers)
    assert response.status_code == 200
    assert response.json()['proclamations']['DE_enacted_proclamations'] == 1
