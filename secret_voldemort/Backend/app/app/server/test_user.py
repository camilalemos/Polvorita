from fastapi.testclient import TestClient
from fastapi import status

from .app import app

client = TestClient(app)


def test_post_create_user():
    response = client.post("/users/", 
        json={
        "userName": "Diana12", 
        "fullName": "Diana Lescano", 
        "password": "2uh218bu3", "email": 
        "wonderwoman@justiceleague.com"
        })
    assert response.status_code == 201
    assert response.json() == {
        "username": "Diana12", 
        "operation_result": " Succesfully created"
        }

def test_post_create_user_with_existing_username():
    response = client.post("/users/", 
        json={
        "userName": "Diana12", 
        "firstName": "Diana Romero", 
        "password": "6654dkdqjh2", "email": 
        "wonderwoman12@justiceleague.com"
        })
    assert response.status_code == 403
    assert response.json() == {
        "detail":" E-mail or username already exists"
        }

def test_post_create_user_with_existing_email():
    response = client.post("/users/", 
        json={
        "userName": "Diana34",  
        "password": "6654dkdqjh2", "email": 
        "wonderwoman@justiceleague.com"
        })
    assert response.status_code == 403
    assert response.json() == {
        "detail": " E-mail or username already exists"
        }
