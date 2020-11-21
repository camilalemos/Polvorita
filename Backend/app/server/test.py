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
    minister_candidate = game["elections"]["players"][0]
    minister_username = game["players"][minister_candidate]["user_name"]
    headmaster_candidate = game["elections"]["players"][1]
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
    for i in range(4):
        response = client.post("/game/", headers=headers,
            data={
                "game_name": f"Juego_{i}",
                "player_name": "Player_0",
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
            "spells": response.json()['spells'],
            "chat": []
        }

def test_post_create_game_with_existing_name():
    headers = get_header("Admin_0")
    data={
        "game_name": "Juego_0",
        "player_name": "Player_0",
        "password": "Player123"
    }
    response = client.post("/game/", headers=headers, data=data)
    assert response.status_code == 403
    assert response.json() == {'detail': 'Game name already exist'}

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
    for i in range(3):
        for j in range(1, 5):
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
    response = client.put("/game/start/?game_name=Juego_3", headers=headers)
    assert response.status_code == 403
    assert response.json() == {"detail": "Not enough players"}

def test_put_start_game():
    global started_Juego_0
    global started_Juego_1
    global started_Juego_2
    headers = get_header("Admin_0")
    response_0 = client.put("/game/start/?game_name=Juego_0", headers=headers)
    started_Juego_0 = response_0.json()
    response_1 = client.put("/game/start/?game_name=Juego_1", headers=headers)
    started_Juego_1 = response_1.json()
    response_2 = client.put("/game/start/?game_name=Juego_2", headers=headers)
    started_Juego_2 = response_2.json()
    assert response_0.status_code == 200
    assert response_0.json()['status'] == 'STARTED'
    assert len(response_0.json()['players']) == response_0.json()['num_players']
    assert response_1.status_code == 200
    assert response_1.json()['status'] == 'STARTED'
    assert len(response_1.json()['players']) == response_1.json()['num_players']
    assert response_2.status_code == 200
    assert response_2.json()['status'] == 'STARTED'
    assert len(response_2.json()['players']) == response_2.json()['num_players']
    assert response_0.json()['proclamations'] == {
        "DE_enacted_proclamations": 0,
        "PO_enacted_proclamations": 0,
        "discarded": [],
        "deck": response_0.json()["proclamations"]["deck"]
    }
    assert response_0.json()['elections'] == {
        "headmaster": None,
        "headmaster_candidate": None,
        "minister": None,
        "minister_candidate": response_0.json()["elections"]["minister_candidate"],
        "players": response_0.json()["elections"]["players"],
        "votes": {},
        "result": None,
        "rejected": 0,
    }

def test_put_start_game_already_started():
    user = started_Juego_0["owner"]
    headers = get_header(user)
    response = client.put("/game/start/?game_name=Juego_0", headers=headers)
    assert response.status_code == 403
    assert response.json() == {"detail": "Game already started"}


#CHOOSE DIRECTOR
def test_put_choose_director_game_not_found():
    candidates = get_candidates(started_Juego_0)
    headers = get_header(candidates["minister_user"])
    response = client.put(f"/game/elections/nominate/?candidate_name={candidates['headmaster']}&player_name={candidates['minister']}&game_name=none", headers=headers)
    assert response.status_code == 404
    assert response.json() == {"detail": "Game not found"}

def test_put_choose_director_game_not_started():
    candidates = get_candidates(started_Juego_0)
    headers = get_header(candidates["minister_user"])
    response = client.put(f"/game/elections/nominate/?candidate_name={candidates['headmaster']}&player_name={candidates['minister']}&game_name=Juego_3", headers=headers)
    assert response.status_code == 403
    assert response.json() == {"detail": "Game not started"}

def test_put_choose_director_player_not_found():
    candidates = get_candidates(started_Juego_0)
    headers = get_header(candidates["minister_user"])
    response = client.put(f"/game/elections/nominate/?candidate_name={candidates['headmaster']}&player_name=none&game_name={started_Juego_0['name']}", headers=headers)
    assert response.status_code == 404
    assert response.json() == {"detail": "Player not found"}

def test_put_choose_director_unauthorized():
    candidates = get_candidates(started_Juego_0)
    headers = get_header("Admin_5")
    response = client.put(f"/game/elections/nominate/?candidate_name={candidates['headmaster']}&player_name={candidates['minister']}&game_name={started_Juego_0['name']}", headers=headers)
    assert response.status_code == 401
    assert response.json() == {"detail": "Unauthorized"}

def test_put_choose_director_candidate_not_found():
    candidates = get_candidates(started_Juego_0)
    headers = get_header(candidates["minister_user"])
    response = client.put(f"/game/elections/nominate/?candidate_name=none&player_name={candidates['minister']}&game_name={started_Juego_0['name']}", headers=headers)
    assert response.status_code == 404
    assert response.json() == {"detail": "Candidate name not found"}

def test_put_choose_director_not_minister_candidate():
    candidates = get_candidates(started_Juego_0)
    headers = get_header(candidates["headmaster_user"])
    response = client.put(f"/game/elections/nominate/?candidate_name={candidates['minister']}&player_name={candidates['headmaster']}&game_name={started_Juego_0['name']}", headers=headers)
    assert response.status_code == 403
    assert response.json() == {"detail": "Only the minister candidate can choose the headmaster candidate"}

def test_put_choose_director_not_eligible_minister_candidate():
    candidates = get_candidates(started_Juego_0)
    headers = get_header(candidates["minister_user"])
    response = client.put(f"/game/elections/nominate/?candidate_name={candidates['minister']}&player_name={candidates['minister']}&game_name={started_Juego_0['name']}", headers=headers)
    assert response.status_code == 403
    assert response.json() == {"detail": "The candidate is not eligible"}

#VOTE LUMOS
def test_put_vote_lumos_headmaster_not_defined():
    headers = get_header(f"Admin_0")
    response = client.put(f"/game/elections/vote/?vote=LUMOS&player_name=Player_0&game_name=Juego_0", headers=headers)
    assert response.status_code == 403
    assert response.json() == {"detail": "Headmaster candidate not defined"}

#CHOOSE DIRECTOR
def test_put_choose_director():
    candidates_0 = get_candidates(started_Juego_0)
    candidates_1 = get_candidates(started_Juego_1)
    candidates_2 = get_candidates(started_Juego_2)
    headers_0 = get_header(candidates_0["minister_user"])
    headers_1 = get_header(candidates_1["minister_user"])
    headers_2 = get_header(candidates_2["minister_user"])
    response_0 = client.put(f"/game/elections/nominate/?candidate_name={candidates_0['headmaster']}&player_name={candidates_0['minister']}&game_name={started_Juego_0['name']}", headers=headers_0)
    response_1 = client.put(f"/game/elections/nominate/?candidate_name={candidates_1['headmaster']}&player_name={candidates_1['minister']}&game_name={started_Juego_1['name']}", headers=headers_1)
    response_2 = client.put(f"/game/elections/nominate/?candidate_name={candidates_2['headmaster']}&player_name={candidates_2['minister']}&game_name={started_Juego_2['name']}", headers=headers_2)
    assert response_0.status_code == 200
    assert response_0.json()['elections']['headmaster_candidate'] == candidates_0['headmaster']
    assert response_1.status_code == 200
    assert response_1.json()['elections']['headmaster_candidate'] == candidates_1['headmaster']
    assert response_2.status_code == 200
    assert response_2.json()['elections']['headmaster_candidate'] == candidates_2['headmaster']

#VOTE LUMOS
def test_put_vote_lumos_game_not_found():
    headers = get_header(f"Admin_0")
    response = client.put(f"/game/elections/vote/?vote=LUMOS&player_name=Player_0&game_name=none", headers=headers)
    assert response.status_code == 404
    assert response.json() == {"detail": "Game not found"}

def test_put_vote_lumos_game_not_started():
    headers = get_header(f"Admin_0")
    response = client.put(f"/game/elections/vote/?vote=LUMOS&player_name=Player_0&game_name=Juego_3", headers=headers)
    assert response.status_code == 403
    assert response.json() == {"detail": "Game not started"}

def test_put_vote_lumos_player_not_found():
    headers = get_header(f"Admin_0")
    response = client.put(f"/game/elections/vote/?vote=LUMOS&player_name=none&game_name=Juego_0", headers=headers)
    assert response.status_code == 404
    assert response.json() == {"detail": "Player not found"}

def test_put_vote_lumos_unauthorized():
    headers = get_header(f"Admin_5")
    response = client.put(f"/game/elections/vote/?vote=LUMOS&player_name=Player_0&game_name=Juego_0", headers=headers)
    assert response.status_code == 401
    assert response.json() == {"detail": "Unauthorized"}

def test_put_vote_lumos_not_valid_vote():
    headers = get_header(f"Admin_0")
    response = client.put(f"/game/elections/vote/?vote=SARASA&player_name=Player_0&game_name=Juego_0", headers=headers)
    assert response.status_code == 422

def test_put_vote_lumos():
    headers = get_header(f"Admin_0")
    response_0 = client.put(f"/game/elections/vote/?vote=LUMOS&player_name=Player_0&game_name=Juego_0", headers=headers)
    response_1 = client.put(f"/game/elections/vote/?vote=LUMOS&player_name=Player_0&game_name=Juego_1", headers=headers)
    response_2 = client.put(f"/game/elections/vote/?vote=LUMOS&player_name=Player_0&game_name=Juego_2", headers=headers)
    assert response_0.status_code == 200
    assert response_0.json()['elections']['votes'] == {"Player_0": 'LUMOS'}
    assert response_1.status_code == 200
    assert response_1.json()['elections']['votes'] == {"Player_0": 'LUMOS'}
    assert response_2.status_code == 200
    assert response_2.json()['elections']['votes'] == {"Player_0": 'LUMOS'}

def test_put_vote_lumos_player_already_voted():
    headers = get_header(f"Admin_0")
    response = client.put(f"/game/elections/vote/?vote=LUMOS&player_name=Player_0&game_name=Juego_0", headers=headers)
    assert response.status_code == 403
    assert response.json() == {"detail": "The player has already voted"}

def test_put_vote_lumos_rest():
    global voted_Juego_0
    global voted_Juego_2
    candidates = get_candidates(started_Juego_0)
    for i in range(1, 5):
        headers = get_header(f"Admin_{i}")
        response_0 = client.put(f"/game/elections/vote/?vote=LUMOS&player_name=Player_{i}&game_name=Juego_0", headers=headers)
        assert response_0.status_code == 200
        client.put(f"/game/elections/vote/?vote=LUMOS&player_name=Player_{i}&game_name=Juego_1", headers=headers)
        response_2 = client.put(f"/game/elections/vote/?vote=LUMOS&player_name=Player_{i}&game_name=Juego_2", headers=headers)
        assert response_2.status_code == 200
        if i == 4:
            assert not response_0.json()['elections']['votes']
            assert len(response_0.json()['elections']['votes']) == 0
            assert response_0.json()['elections']['minister'] == candidates['minister']
            assert response_0.json()['elections']['headmaster'] == candidates['headmaster']
        else:
            assert f"Player_{i}" in response_0.json()['elections']['votes']
            assert len(response_0.json()['elections']['votes']) == i+1
    voted_Juego_0 = response_0.json()
    voted_Juego_2 = response_2.json()

def test_put_vote_lumos_DE_win():
    new_candidates = get_candidates(voted_Juego_2)
    old_candidates = get_candidates(started_Juego_2)
    headers = get_header(old_candidates["headmaster_user"])
    for i in range(3):
        response = client.put(f"/game/proclamations/enact/?loyalty=DEATH_EATERS&player_name={old_candidates['headmaster']}&game_name=Juego_2", headers=headers)
        assert response.status_code == 200
        assert response.json()['proclamations']['DE_enacted_proclamations'] == i+1
    headers = get_header(new_candidates["minister_user"])
    response = client.put(f"/game/elections/nominate/?candidate_name={started_Juego_2['voldemort']}&player_name={new_candidates['minister']}&game_name=Juego_2", headers=headers)
    assert response.status_code == 200
    for i in range(5):
        headers = get_header(f"Admin_{i}")
        response = client.put(f"/game/elections/vote/?vote=LUMOS&player_name=Player_{i}&game_name=Juego_2", headers=headers)
        assert response.status_code == 200
        if i == 4:
            assert response.json()['status'] == 'FINISHED'
            assert response.json()['winner'] == 'DEATH_EATERS'

#CHOOSE DIRECTOR
def test_put_choose_director_not_eligible_minister():
    old_candidates = get_candidates(started_Juego_0)
    new_candidates = get_candidates(voted_Juego_0)
    headers = get_header(new_candidates["minister_user"])
    response = client.put(f"/game/elections/nominate/?candidate_name={old_candidates['minister']}&player_name={new_candidates['minister']}&game_name=Juego_0", headers=headers)
    assert response.status_code == 403
    assert response.json() == {"detail": "The candidate is not eligible"}

def test_put_choose_director_not_eligible_headmaster():
    old_candidates = get_candidates(started_Juego_0)
    new_candidates = get_candidates(voted_Juego_0)
    headers = get_header(new_candidates["minister_user"])
    response = client.put(f"/game/elections/nominate/?candidate_name={old_candidates['headmaster']}&player_name={new_candidates['minister']}&game_name=Juego_0", headers=headers)
    assert response.status_code == 403
    assert response.json() == {"detail": "The candidate is not eligible"}

#GET PROCLAMATIONS
def test_get_get_proclamations_game_not_found():
    old_candidates = get_candidates(started_Juego_0)
    headers = get_header(old_candidates["minister_user"])
    response = client.get(f"/game/proclamations/?player_name={old_candidates['minister']}&game_name=none", headers=headers)
    assert response.status_code == 404
    assert response.json() == {"detail": "Game not found"}

def test_get_get_proclamations_game_not_started():
    old_candidates = get_candidates(started_Juego_0)
    headers = get_header(old_candidates["minister_user"])
    response = client.get(f"/game/proclamations/?player_name={old_candidates['minister']}&game_name=Juego_3", headers=headers)
    assert response.status_code == 403
    assert response.json() == {"detail": "Game not started"}

def test_get_get_proclamations_player_not_found():
    old_candidates = get_candidates(started_Juego_0)
    headers = get_header(old_candidates["minister_user"])
    response = client.get(f"/game/proclamations/?player_name=none&game_name=Juego_0", headers=headers)
    assert response.status_code == 404
    assert response.json() == {"detail": "Player not found"}

def test_get_get_proclamations_unauthorized():
    old_candidates = get_candidates(started_Juego_0)
    headers = get_header("Admin_5")
    response = client.get(f"/game/proclamations/?player_name={old_candidates['minister']}&game_name=Juego_0", headers=headers)
    assert response.status_code == 401
    assert response.json() == {"detail": "Unauthorized"}

def test_get_get_proclamations_not_minister():
    old_candidates = get_candidates(started_Juego_0)
    headers = get_header(old_candidates["headmaster_user"])
    response = client.get(f"/game/proclamations/?player_name={old_candidates['headmaster']}&game_name=Juego_0", headers=headers)
    assert response.status_code == 403
    assert response.json() == {"detail": "Only minister can get proclamations"}

def test_get_get_proclamations():
    old_candidates = get_candidates(started_Juego_0)
    headers = get_header(old_candidates["minister_user"])
    response = client.get(f"/game/proclamations/?player_name={old_candidates['minister']}&game_name=Juego_0", headers=headers)
    assert response.status_code == 200
    assert len(response.json()) == 3


#DISCARD PROCLAMATION
def test_put_discard_proclamation_game_not_found():
    old_candidates = get_candidates(started_Juego_0)
    headers = get_header(old_candidates["minister_user"])
    response = client.put(f"/game/proclamations/discard/?loyalty=PHOENIX_ORDER&player_name={old_candidates['minister']}&game_name=none", headers=headers)
    assert response.status_code == 404
    assert response.json() == {"detail": "Game not found"}

def test_put_discard_proclamation_game_not_started():
    old_candidates = get_candidates(started_Juego_0)
    headers = get_header(old_candidates["minister_user"])
    response = client.put(f"/game/proclamations/discard/?loyalty=PHOENIX_ORDER&player_name={old_candidates['minister']}&game_name=Juego_3", headers=headers)
    assert response.status_code == 403
    assert response.json() == {"detail": "Game not started"}

def test_put_discard_proclamation_player_not_found():
    old_candidates = get_candidates(started_Juego_0)
    headers = get_header(old_candidates["minister_user"])
    response = client.put(f"/game/proclamations/discard/?loyalty=PHOENIX_ORDER&player_name=none&game_name=Juego_0", headers=headers)
    assert response.status_code == 404
    assert response.json() == {"detail": "Player not found"}

def test_put_discard_proclamation_unauthorized():
    old_candidates = get_candidates(started_Juego_0)
    headers = get_header("Admin_5")
    response = client.put(f"/game/proclamations/discard/?loyalty=PHOENIX_ORDER&player_name={old_candidates['minister']}&game_name=Juego_0", headers=headers)
    assert response.status_code == 401
    assert response.json() == {"detail": "Unauthorized"}

def test_put_discard_proclamation_not_valid_loyaly():
    old_candidates = get_candidates(started_Juego_0)
    headers = get_header(old_candidates["minister_user"])
    response = client.put(f"/game/proclamations/discard/?loyalty=SARASA&player_name={old_candidates['minister']}&game_name=Juego_0", headers=headers)
    assert response.status_code == 422

def test_put_discard_proclamation_not_minister_or_headmaster():
    new_candidates = get_candidates(voted_Juego_0)
    headers = get_header(new_candidates["headmaster_user"])
    response = client.put(f"/game/proclamations/discard/?loyalty=PHOENIX_ORDER&player_name={new_candidates['headmaster']}&game_name=Juego_0", headers=headers)
    assert response.status_code == 403
    assert response.json() == {"detail": "Only minister or headmaster can discard a proclamation"}

def test_put_discard_proclamation_minister():
    old_candidates = get_candidates(started_Juego_0)
    headers = get_header(old_candidates["minister_user"])
    response = client.put(f"/game/proclamations/discard/?loyalty=PHOENIX_ORDER&player_name={old_candidates['minister']}&game_name=Juego_0", headers=headers)
    assert response.status_code == 200
    assert response.json()['proclamations']['discarded'] == ['PHOENIX_ORDER']

def test_put_discard_proclamation_headmaster():
    old_candidates = get_candidates(started_Juego_0)
    headers = get_header(old_candidates["headmaster_user"])
    response = client.put(f"/game/proclamations/discard/?loyalty=DEATH_EATERS&player_name={old_candidates['headmaster']}&game_name=Juego_0", headers=headers)
    assert response.status_code == 200
    assert response.json()['proclamations']['discarded'] == ['PHOENIX_ORDER', 'DEATH_EATERS']

"""
#CAST SPELL ADIVINATION
def test_put_cast_spell_adivination_game_not_found():
    old_candidates = get_candidates(started_Juego_0)
    headers = get_header(old_candidates["minister_user"])
    response = client.put(f"/game/spells/?spell=ADIVINATION&player_name={old_candidates['minister']}&game_name=none", headers=headers)
    assert response.status_code == 404
    assert response.json() == {"detail": "Game not found"}

def test_websocket():
    for i in range(10):
        with client.websocket_connect("/lobby/") as websocket:
            data = websocket.receive_json()
            assert data == []
"""