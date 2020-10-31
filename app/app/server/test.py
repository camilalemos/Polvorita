from fastapi.testclient import TestClient
from fastapi import status

from .app import app

client = TestClient(app)


def test_post_create_game():
    response = client.post("/game/", 
        json={
        "gameName": "voldemort_secret_1"
        })
    assert response.status_code == 201
    assert response.json() == {
        "201": "game successfully created"
        }

def test_get_show_games():
    response = client.get("/game/")
    assert response.status_code == 201
    assert response.json() == [{
        "gameName": "voldemort_secret_1"
        }]

def test_post_exists_create_game():
    response = client.post("/game/", 
        json={
        "gameName": "voldemort_secret_1"
        })
    assert response.status_code == 403
    assert response.json() == {
        "detail" : "game name already exist"
        }

