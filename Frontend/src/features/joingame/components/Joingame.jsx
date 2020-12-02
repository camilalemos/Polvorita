import React, { useEffect, useState, useRef } from 'react';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Button from '@material-ui/core/Button';
import LockIcon from '@material-ui/icons/Lock';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import { withSnackbar } from 'notistack';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { useHistory, withRouter } from "react-router-dom";
import CreateGameContainer from '../../createGameForm/containers/CreateGameContainers';
import ChangeProfileContainer from '../../changeProfile/containers/ChangeProfileContainer';
import PopUp from './PopUp';
import IconButton from '@material-ui/core/IconButton';
import ExitToAppOutlinedIcon from '@material-ui/icons/ExitToAppOutlined';
import AccountBoxOutlinedIcon from '@material-ui/icons/AccountBoxOutlined';
import AddBoxOutlinedIcon from '@material-ui/icons/AddBoxOutlined';
import Switch from '@material-ui/core/Switch';

const Joingame = ({ joingame, status, enqueueSnackbar, user, logout, errorMsg, reconnectGame, reconnectGames }) => {
	const history = useHistory();
	const [gameInfo, setGameInfo] = useState([]);
	const [playerName, setPlayerName] = useState('');
	const [gamePassword, setPassword] = useState('');
	const [openModal, setOpenModal] = useState(false);
	const [openModalCreateGame, setOpenModalCreateGame] = useState(false);
	const [openModalChangeProfile, setOpenModalChangeProfile] = useState(false);
	const [routeGame, setRouteGame] = useState('');
	const [reconnect, setReconnet] = useState(false);

	const ws = useRef(null);

	useEffect(() => {

		ws.current = new WebSocket('ws://190.190.133.175:8000/lobby/');

		ws.current.onmessage = (event) => {
			setGameInfo(JSON.parse(event.data));
		};

		return () => {
            ws.current.close();
        };
	});

	useEffect(() => {
		reconnectGame()
	},[gameInfo])

	useEffect(() => {
		if (status === 'failed') if (status === 'failed') enqueueSnackbar(errorMsg, { variant: 'error' });
		if (status === 'success') history.push(`/lobby/${routeGame}`);
	}, [status]);

	const handleJoin = (id) => {
		joingame(id, playerName, gamePassword);
		setRouteGame(id);
	}

	const handleJoinNewGame = (e) => {
		e.stopPropagation();
		setOpenModal(true)
	}

	const isJoing = (currentGame) => {
		let fil = Object.values(currentGame.players).filter(players => players.user_name === user.username)
		if (fil.length) return false;
		return true;

	}

	const handleLogout = () => {
		logout();
		history.push(`/login`);
	}

	return (
		<div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundImage: `url(${require('../../../constants/images/fondo3.jpeg')})`, backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: "cover" }}>
			<div style={{ display: 'flex', flexDirection: 'row', flex: 1 }}>
				<div style={{ flex: 1 }} />
				<div style={{ display: 'flex', flexDirection: 'column', flex: 3, justifyContent: 'center' }}>
					<div style={{ display: 'flex', height: '70%' }}>
						<Grid component={Paper} style={{ padding: 40, flex: 3, opacity: 0.8, overflow: 'auto', backgroundColor: 'black' }}>
							{reconnectGames && reconnectGames.length &&
								<div style={{display:'flex', justifyContent:'flex-end', flexDirection:'row', alignItems:'center', paddingBottom:20}}>
									<h style={{color:'white'}} >Games started</h>
									<Switch
										color="secondary"
										checked={reconnect}
										onChange={() => setReconnet(!reconnect)}
									/>
								</div>
							}
							{!reconnect ?
								<>
									<div style={{ display: 'flex', marginBottom: 40 }}>
										<a style={{ flex: 1, fontSize: 30, color: 'white' }}>Game name</a>
										<a style={{ flex: 1, textAlign: 'center', fontSize: 30, color: 'white' }}>Owner</a>
										<a style={{ flex: 1, textAlign: 'center', fontSize: 30, color: 'white' }}>Num Players</a>
										<a style={{ flex: 1, textAlign: 'center', fontSize: 30, color: 'white' }}></a>
									</div>
									{gameInfo.map(currentGame => {
										return (
											<div key={currentGame.name}>
												<div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', flex: 1 }} onClick={() => history.push(`/lobby/${currentGame.name}`)}>
													<a style={{ flex: 1, fontSize: 20, color: 'white' }}>{currentGame.name}</a>
													<a style={{ flex: 1, textAlign: 'center', fontSize: 20, color: 'white' }}>{currentGame.owner}</a>
													<a style={{ flex: 1, textAlign: 'center', fontSize: 20, color: 'white' }}>{currentGame.num_players}/{currentGame.max_players}</a>
													<div style={{ flex: 1, textAlign: 'right', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
														<ListItemIcon >
															{currentGame.password === null ?
																<LockOpenIcon color='secondary' /> : <LockIcon />}
														</ListItemIcon>
														{isJoing(currentGame) && currentGame.num_players < currentGame.max_players && <Button color='primary' onClick={(e) => handleJoinNewGame(e)} variant="contained" >Join Game</Button>}
													</div>
												</div>
												<div style={{ height: .5, backgroundColor: 'lightgrey', display: 'flex', marginBottom: 20, marginTop: 10 }} />
												<PopUp join={() => handleJoin(currentGame.name, playerName, gamePassword)} open={openModal} playerName={playerName} gamePassword={gamePassword} setPlayerName={(value) => setPlayerName(value)} setPassword={(value) => setPassword(value)} onClose={() => setOpenModal(false)} />
											</div>
										)})
									}
								</>
							:
								<>
									<div style={{ display: 'flex', marginBottom: 40 }}>
										<a style={{ flex: 1, fontSize: 30, color: 'white' }}>Game name</a>
									</div>
									{reconnectGames && reconnectGames.map(games => {
										return (
											<div key={games}>
												<div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', flex: 1 }} onClick={() => history.push(`/game/${games}`)}>
													<a style={{ flex: 1, fontSize: 20, color: 'white' }}>{games}</a>
												</div>
												<div style={{ height: .5, backgroundColor: 'lightgrey', display: 'flex', marginBottom: 20, marginTop: 10 }} />
											</div>
										)})
									}
								</>
							}
						</Grid>
					</div>
				</div>
				<div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
					<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', paddingTop: 40, paddingBottom: 40 }}>
						<div>
							<IconButton size='large' onClick={() => setOpenModalChangeProfile(true)}> <AccountBoxOutlinedIcon color='secondary' fontSize='large' /> </IconButton>
							<IconButton size='large' onClick={() => setOpenModalCreateGame(true)}> <AddBoxOutlinedIcon color='secondary' fontSize='large' /> </IconButton>
							<IconButton size='large' onClick={handleLogout}> <ExitToAppOutlinedIcon color='secondary' fontSize='large' /> </IconButton>
						</div>
					</div>
				</div>
			</div>
			<ChangeProfileContainer open={openModalChangeProfile} onClose={() => setOpenModalChangeProfile(false)} />
			<CreateGameContainer open={openModalCreateGame} onClose={() => setOpenModalCreateGame(false)} />
		</div>
	);
};

export default withRouter(withSnackbar(Joingame));