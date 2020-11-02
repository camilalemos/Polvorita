from typing import List

from fastapi import WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse

from .models import game


game = """
<!DOCTYPE html>
<html>
    <head>
        <title>Game</title>
    </head>
    <body>
        <h1>WebSocket Game</h1>
        <h2>Game: <span id="ws-id"></span></h2>
        <form action="" onsubmit="sendMessage(event)">
            <button>View game</button>
        </form>
        <ul id='messages'>
        </ul>
        <script>
            var game_name = "juego"
            document.querySelector("#ws-id").textContent = game_name;
            var ws = new WebSocket(`ws://localhost:8000/game/${game_name}`);
            ws.onmessage = function(event) {
                var messages = document.getElementById('messages')
                var message = document.createElement('li')
                var content = document.createTextNode(event.data)
                message.appendChild(content)
                messages.appendChild(message)
            };
            function sendMessage(event) {
                ws.send(event)
                event.preventDefault()
            }
        </script>
    </body>
</html>
"""

lobby = """
<!DOCTYPE html>
<html>
    <head>
        <title>Lobby</title>
    </head>
    <body>
        <h1>WebSocket Lobby</h1>
        <h2>Player: <span id="ws-id"></span></h2>
        <form action="" onsubmit="sendMessage(event)">
            <button>View lobby</button>
        </form>
        <ul id='messages'>
        </ul>
        <script>
            var player_name = "pepe"
            document.querySelector("#ws-id").textContent = player_name;
            var ws = new WebSocket(`ws://localhost:8000/lobby/`);
            ws.onmessage = function(event) {
                var messages = document.getElementById('messages')
                var message = document.createElement('li')
                var content = document.createTextNode(event.data)
                message.appendChild(content)
                messages.appendChild(message)
            };
            function sendMessage(event) {
                ws.send(event)
                event.preventDefault()
            }
        </script>
    </body>
</html>
"""

class ConnectionManager:
    def __init__(self):
        self.lobby_connections: List[WebSocket] = []
        self.players: Dict[str, WebSocket] = {}
        self.games: Dict[str, Game] = {}
        self.game_connections: Dict[str, List[WebSocket]] = {}

    async def connect_lobby(self, websocket: WebSocket):
        await websocket.accept()
        self.lobby_connections.append(websocket)

    def disconnect_lobby(self, websocket: WebSocket):
        self.lobby_connections.remove(websocket)

    async def connect_game(self, websocket: WebSocket, game_name: str):
        connections = self.game_connections.get(game_name)
        if game_name in self.game_connections and websocket not in connections and len(connections) < 5:
            await websocket.accept()
            connections.append(websocket)

    def disconnect_game(self, websocket: WebSocket, game_name: str):
        connections = self.game_connections.get(game_name)
        if game_name in self.game_connections and websocket in connections:
            connections.remove(websocket)

    async def broadcast_text(self, message: str, dst: List[WebSocket]):
        for connection in dst:
            await connection.send_text(message)

    async def broadcast_json(self, message: any, dst: List[WebSocket]):
        for connection in dst:
            await connection.send_json(message)

manager = ConnectionManager()