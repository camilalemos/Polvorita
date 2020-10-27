from pony.orm import db_session
from fastapi import FastAPI, HTTPException, status

from . import db
from .models.user import User


# creating FastAPI instance 
app = FastAPI()


# Endpoint to create user
@app.post("/users/", status_code=201)
async def register_user(user: User):
    with db_session:
        valid_user = db.User.exists(email=user.email) or db.User.exists(userName= user.userName)

        if valid_user:
            raise HTTPException(status_code=403, detail=" E-mail or username already exists")

        db.User(**user.dict()).to_dict()
        results = { "username": user.userName, 
                    "operation_result": " Succesfully created"}
        return results

