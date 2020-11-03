from fastapi.testclient import TestClient
from fastapi import status

from .app import app

client = TestClient(app)

def test_post_create_user():
    register_data = {
        "username": "Diana12", 
        "email": "wonderwoman@justiceleague.com",
        "password": "2uh218bu3",
        "full_name": "Diana Lescano"
        }
    response = client.post("/user/", 
        data=register_data)
    assert response.status_code == 201

def test_post_create_user_with_existing_username():
    register_data = {
        "username": "Diana12", 
        "email":"wonderwoman12@justiceleague.com",
        "password": "6654dkdqjh2", 
        "full_name": "Diana Romero"
        }
    response = client.post("/user/", 
        data=register_data)
    assert response.status_code == 403
    assert response.json() == {
        "detail":"Username or E-mail already exist"
        }

def test_post_create_user_with_existing_email():
    register_data = {
        "username": "Diana34",  
        "email": "wonderwoman@justiceleague.com", 
        "password": "6654dkdqjh2" 
        }
    response = client.post("/user/", 
        data=register_data)
    assert response.status_code == 403
    assert response.json() == {
        "detail": "Username or E-mail already exist"
        }

def test_post_login_incorrect():
    loguin_data = {
        "username": "Diana12", 
        "password": "jdhfiehwejire"
        }
    response = client.post("/token/", 
        data=loguin_data)
    assert response.status_code == 401
    assert response.json() == {
        "detail":"Incorrect credentials"
        }


def test_post_login():
    loguin_data = {
        "username": "Diana12", 
        "password": "2uh218bu3"
        }
    response = client.post("/token/", 
        data=loguin_data)
    assert response.status_code == 201

