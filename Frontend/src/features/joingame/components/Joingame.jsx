import React,{useEffect,useState, useRef} from 'react';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Button from '@material-ui/core/Button';
import LockIcon from '@material-ui/icons/Lock';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import { withSnackbar } from 'notistack';
import { useHistory,withRouter } from "react-router-dom";

import CreateGameContainer from '../../createGameForm/containers/CreateGameContainers';
import ChangeProfileContainer from '../../changeProfile/containers/ChangeProfileContainer';
import PopUp from './PopUp';

const Joingame = ({joingame, status, enqueueSnackbar, user, logout }) => {
	const history = useHistory();
	const [gameInfo, setGameInfo] = useState([]);
	const [playerName, setPlayerName] = useState('');
	const [gamePassword, setPassword] = useState('');
	const [openModal, setOpenModal] = useState(false);
	const [openModalCreateGame, setOpenModalCreateGame] = useState(false);
	const [openModalChangeProfile, setOpenModalChangeProfile] = useState(false);
	const [routeGame, setRouteGame] = useState('')

    const ws = useRef(null);
    console.log(ws, "WS");
    useEffect(() => {

		ws.current = new WebSocket('ws://localhost:8000/lobby/');
		
		ws.current.onmessage = (event) => {
		setGameInfo(JSON.parse(event.data));
	    console.log(gameInfo);
		};
		
		return () => {
		ws.current.close();
		};
	});

	useEffect(() => {
		if (status === 'failed') enqueueSnackbar('Cannot join the game, you are already the owner', { variant: 'error'});
		if (status === 'success') history.push(`/lobby/${routeGame}`);
	},[status]);

	const handleJoin = (id) => {
		joingame(id ,playerName, gamePassword);
		setRouteGame(id);
	}

	const handleJoinNewGame = (e) => {
		e.stopPropagation();
		setOpenModal(true)
	}

	const isJoing = (currentGame) => {
		console.log(user, "ISER");
		let fil = Object.values(currentGame.players).filter(players => players.user_name === user.username)
		if (fil.length) return false;
		return true;

	}

	const handleLogout = () => {
		logout();
		history.push(`/login`);
	}

  return (
    <div style={{display: 'flex', flexDirection:'column', padding:40}}>
		<div style={{ display: 'flex', flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
        	<b style={{ fontSize:70 }}>GAMES</b>
			<div>
				<Button style={{ backgroundColor:'lightblue', marginRight:20 }} size='small' onClick={() => setOpenModalChangeProfile(true)} variant="contained" >Profile</Button>
				<Button style={{ backgroundColor:'lightblue', marginRight:20 }} size='small' onClick={() => setOpenModalCreateGame(true)} variant="contained" >Create Game</Button>
				<Button style={{ backgroundColor:'lightblue' }} size='small' onClick={handleLogout} variant="contained" >Logout</Button>
			</div>
		</div>
		<div style={{padding:40}}>
		<div style={{display:'flex', marginBottom: 40}}>
			<a style={{flex: 1, fontSize:30}}>Game name</a>
			<a style={{flex: 1, textAlign: 'center', fontSize:30}}>Owner</a>
			<a style={{flex: 1, textAlign: 'center', fontSize:30}}>Num Players</a>
			<a style={{flex: 1, textAlign: 'center', fontSize:30}}></a>
		</div>
        {gameInfo.map(currentGame => {
			
			return (
			<div key={currentGame.name}>
				<div style={{display:'flex',alignItems:'center', cursor:'pointer'}} onClick={() => history.push(`/lobby/${currentGame.name}`)}>
					<a style={{flex: 1, fontSize: 20}}>{currentGame.name}</a>
					<a style={{flex: 1, textAlign: 'center', fontSize: 20}}>{currentGame.owner}</a>
					<a style={{flex: 1, textAlign: 'center', fontSize: 20}}>{currentGame.num_players}/{currentGame.max_players}</a>
					<div style={{flex: 1, textAlign: 'right', display:'flex', alignItems:'center', justifyContent:'flex-end'}}>
					<ListItemIcon >
						{currentGame.password === null ?
						<LockOpenIcon/> : <LockIcon/>} 
					</ListItemIcon>
					{isJoing(currentGame) && currentGame.num_players < currentGame.max_players && <Button onClick={(e) => handleJoinNewGame(e)} variant="contained" >Join Game</Button>}
					</div>
				</div>
				<div style={{  height:.5 , backgroundColor:'lightgrey', display:'flex', marginBottom:20, marginTop:10}} />
				<PopUp join={() => handleJoin(currentGame.name ,playerName, gamePassword)} open={openModal} playerName={playerName} gamePassword={gamePassword} setPlayerName={(value) => setPlayerName(value)} setPassword={(value) => setPassword(value)} onClose={() => setOpenModal(false)}/>
			</div>	
		)})
        }
		</div>
		<ChangeProfileContainer open={openModalChangeProfile} onClose={() => setOpenModalChangeProfile(false)}/>
		<CreateGameContainer open={openModalCreateGame} onClose={() => setOpenModalCreateGame(false)}/>
    </div>
  );
};

export default withRouter(withSnackbar(Joingame));