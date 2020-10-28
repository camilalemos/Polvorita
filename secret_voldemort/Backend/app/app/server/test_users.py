from fastapi.testclient import TestClient
from fastapi import status

from .app import app

client = TestClient(app)




def test_post_login_incorrect():
    loguin_data = {
        "username": "Diana12", 
        "password": "jdhfiehwejire"
        }
    response = client.post("/login", 
        data=loguin_data)
    assert response.status_code == 401

def test_post_login():
    loguin_data = {
        "username": "Diana12", 
        "password": "2uh218bu3"
        }
    response = client.post("/login", 
        data=loguin_data)
    assert response.status_code == 200