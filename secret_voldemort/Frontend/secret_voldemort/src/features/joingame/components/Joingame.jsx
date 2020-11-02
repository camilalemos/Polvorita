import React,{useEffect,useState} from 'react';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import LockIcon from '@material-ui/icons/Lock';
//import axios from 'axios';

const GameList = () => {
  const [gameInfo, setGameInfo] = useState([]);

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

  const orderGames = (arr) =>
    arr &&
    arr.map((item, index) => (
    <List component="nav" className='asd' aria-label="contacts">
    <ListItem disableGutters>
    <ListItemText primary="Chelsea Otakan"/>
        <tr key={index}>
            <td> {item[1]} </td>
            <td> {item[0]} </td>
        </tr>
        <ListItemIcon>
            <LockIcon/>
        </ListItemIcon>
        <Button variant="contained" >Join Game</Button>
        </ListItem>
    </List>
    ));        

  return (
    <div className="order-container">
      <table>
        <h2>Partidas</h2>
        <tbody>{orderGames(gameInfo)}</tbody>
      </table>
    </div>
  );
};

export default GameList;