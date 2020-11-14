import React,{useEffect,useState} from 'react';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Button from '@material-ui/core/Button';
import LockIcon from '@material-ui/icons/Lock';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import { withSnackbar } from 'notistack';

import CreateGameContainer from '../../createGameForm/containers/CreateGameContainers';
import PopUp from './PopUp';

const GameList = ({joingame, status, enqueueSnackbar }) => {
	const [gameInfo, setGameInfo] = useState([]);
	const [playerName, setPlayerName] = useState('');
	const [gamePassword, setPassword] = useState('');
	const [openModal, setOpenModal] = useState(false);
	const [openModalCreateGame, setOpenModalCreateGame] = useState(false);

	useEffect(() => {

		const ws = new WebSocket('ws://localhost:8000/lobby/');

		ws.onopen = () => {
		ws.send(JSON.stringify({event: 'lobby:subscribe'}));
		};
		
		ws.onmessage = (event) => {
		setGameInfo(JSON.parse(event.data));
	    // console.log(gameInfo);
		};
		
		ws.onclose = () => {
		ws.close();
		};

		return () => {
		ws.close();
		};
	});

	useEffect(() => {
		if (status === 'failed') enqueueSnackbar('Cannot join the game, you are already the owner', { variant: 'error'});
		if (status === 'success') console.log("ESTOY ADRENTRO DE UNA PERTIDA");
	},[status]);

  return (
    <div style={{display: 'flex', flexDirection:'column', padding:40}}>
		<div style={{ display: 'flex', flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
        	<b style={{ fontSize:70 }}>GAMES</b>
			<Button style={{ backgroundColor:'lightblue' }} size='small' onClick={() => setOpenModalCreateGame(true)} variant="contained" >Create Game</Button>
		</div>
		<div style={{padding:40}}>
		<div style={{display:'flex', marginBottom: 40}}>
			<a style={{flex: 1, fontSize:30}}>Game name</a>
			<a style={{flex: 1, textAlign: 'center', fontSize:30}}>Owner</a>
			<a style={{flex: 1, textAlign: 'center', fontSize:30}}>Num Players</a>
			<a style={{flex: 1, textAlign: 'center', fontSize:30}}></a>
		</div>
        {gameInfo.map(currentGame => (
			<div key={currentGame.name}>
				<div style={{display:'flex',alignItems:'center'}}>
					<a style={{flex: 1, fontSize: 20}}>{currentGame.name}</a>
					<a style={{flex: 1, textAlign: 'center', fontSize: 20}}>{Object.keys(currentGame.players)}</a>
					<a style={{flex: 1, textAlign: 'center', fontSize: 20}}>{currentGame.num_players}/{currentGame.max_players}</a>
					<div style={{flex: 1, textAlign: 'right', display:'flex', alignItems:'center', justifyContent:'flex-end'}}>
					<ListItemIcon >
						{currentGame.password === null ?
						<LockOpenIcon/> : <LockIcon/>} 
					</ListItemIcon>
					<Button onClick={() => setOpenModal(true)} variant="contained" >Join Game</Button>
					</div>
				</div>
				<div style={{  height:.5 , backgroundColor:'lightgrey', display:'flex', marginBottom:20, marginTop:10}} />
				<PopUp join={() => joingame(currentGame.name ,playerName, gamePassword)} open={openModal} playerName={playerName} gamePassword={gamePassword} setPlayerName={(value) => setPlayerName(value)} setPassword={(value) => setPassword(value)} onClose={() => setOpenModal(false)}/>
			</div>	
			))
        }
		</div>
		<CreateGameContainer open={openModalCreateGame} onClose={() => setOpenModalCreateGame(false)}/>
    </div>
  );
};

export default withSnackbar(GameList);