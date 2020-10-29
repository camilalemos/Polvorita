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
        "detail":"Username already exist"
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
        "detail": "E-mail already exist"
        }
