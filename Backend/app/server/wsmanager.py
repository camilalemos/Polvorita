from typing import List

from fastapi import WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse

from .models import Game, Player


class ConnectionManager:
    def __init__(self):
        self.lobby_connections: List[WebSocket] = []
        self.games: Dict[str, Game] = {}
        self.game_connections: Dict[str, List[WebSocket]] = {}

    def create_game(self, game: Game):
        self.games[game.name] = game
        self.game_connections[game.name] = []

    def delete_game(self, game_name: str):
        self.games.pop(game_name)
        self.game_connections.pop(game_name)

    async def connect_lobby(self, websocket: WebSocket):
        await websocket.accept()
        self.lobby_connections.append(websocket)

    def disconnect_lobby(self, websocket: WebSocket):
        self.lobby_connections.remove(websocket)

    async def connect_game(self, websocket: WebSocket, game_name: str):
        connections = self.game_connections.get(game_name)
        if game_name in self.game_connections and websocket not in connections:
            await websocket.accept()
            connections.append(websocket)

    def disconnect_game(self, websocket: WebSocket, game_name: str):
        connections = self.game_connections.get(game_name)
        if game_name in self.game_connections and websocket in connections:
            connections.remove(websocket)

    async def broadcast_json(self, message: any, dst: List[WebSocket]):
        for connection in dst:
            await connection.send_json(message)