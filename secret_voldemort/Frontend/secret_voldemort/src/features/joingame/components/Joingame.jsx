import React,{useEffect,useState} from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import LockIcon from '@material-ui/icons/Lock';
import LockOpenIcon from '@material-ui/icons/LockOpen';

import PopUp from './PopUp';

const GameList = ({joingame, status }) => {
	const [gameInfo, setGameInfo] = useState([]);
	const [playerName, setPlayerName] = useState('');
	const [gamePassword, setPassword] = useState('');
	const [openModal, setOpenModal] = useState(false);

	useEffect(() => {

		const ws = new WebSocket('ws://localhost:8000/lobby/');

		ws.onopen = () => {
		ws.send(JSON.stringify({event: 'lobby:subscribe'}));
		};
		
	ws.onmessage = (event) => {
	setGameInfo(JSON.parse(event.data));
	//    console.log(gameInfo);
		};
		
		ws.onclose = () => {
		ws.close();
		};

		return () => {
		ws.close();
		};
	});

	useEffect(() => {
		if (status === 'success') console.log("ESTOY ADRENTRO DE UNA PERTIDA");
	},[status]);

  return (
    <div style={{display: 'flex', flexDirection:'column', padding:40}}>
		<div style={{ display: 'flex', flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
        	<h1>Partidas</h1>
			<Button color='secondary' size='small' onClick={null} variant="contained" >Create Game</Button>
		</div>
		<div style={{padding:40}}>
        {gameInfo.map(currentGame => (
			<List component="nav" className='asd' aria-label="contacts">
			<ListItem disableGutters>
			<ListItemText primary={currentGame.game_name}/>
			<ListItemText primary= {currentGame.owner_name}/>
				<ListItemIcon>
				{currentGame.password === null ?
				<LockOpenIcon/> : <LockIcon/>} 
				</ListItemIcon>
				<Button onClick={() => setOpenModal(true)} variant="contained" >Join Game</Button>
				</ListItem>
				<PopUp join={() => joingame(currentGame.game_name ,playerName, gamePassword)} open={openModal} playerName={playerName} gamePassword={gamePassword} setPlayerName={(value) => setPlayerName(value)} setPassword={(value) => setPassword(value)} onClose={() => setOpenModal(false)}/>
			</List>))
        }
		</div>
    </div>
  );
};

export default GameList;