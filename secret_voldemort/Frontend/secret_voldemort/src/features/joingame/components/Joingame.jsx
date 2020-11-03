import React,{useEffect,useState} from 'react';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import LockIcon from '@material-ui/icons/Lock';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import TextField from '@material-ui/core/TextField';


const GameList = ({joinGame, status }) => {
  const [gameInfo, setGameInfo] = useState([]);
  const [playerName, setPlayerName] = useState('');
  const [gamePassword, setPassword] = useState('');
  const [playerNameError, setPlayerNameError] = useState(false);
  const [displayForm, setDisplayForm] = useState(false);

  useEffect(() => {

    const ws = new WebSocket('ws://localhost:8000/lobby/');

    ws.onopen = () => {
      ws.send(JSON.stringify({event: 'lobby:subscribe'}));
    };
    
   ws.onmessage = (event) => {
   setGameInfo(JSON.parse(event.data));
   console.log(gameInfo);
    };
    
    ws.onclose = () => {
      ws.close();
    };

    return () => {
      ws.close();
    };
  });

  const handleJoinGame = () => {

    return (
    <div id='inputs' style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
      <TextField
        value={playerName}
        required
        error={playerNameError}
        style={{ marginBottom: 40, minWidth:300 }}
        onChange={(value) => setPlayerName(value.target.value)}
        id="playerName"
        size='small'
        label="Player Name"
        variant="outlined"
      />
      <TextField
        value={gamePassword}
        style={{ marginBottom: 40, minWidth:300 }}
        onChange={(value) => setPlayerName(value.target.value)}
        id="gamePassword"
        size='small'
        label="Game Password"
        variant="outlined"
      />
    </div>
  )};

  return (
    <div className="order-container">
        <h1>Partidas</h1>
        {gameInfo.map(currentGame => (
        <List component="nav" className='asd' aria-label="contacts">
        <ListItem disableGutters>
        <ListItemText primary={currentGame.game_name}/>
        <ListItemText primary= {currentGame.owner_name}/>
            <ListItemIcon>
              {currentGame.password === null ?
              <LockOpenIcon/> : <LockIcon/>} 
            </ListItemIcon>
            <Button onClick={handleJoinGame} variant="contained" >Join Game</Button>
            </ListItem>
        </List>
        ))
        }
    </div>
  );
};

export default GameList;