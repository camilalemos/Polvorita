import React, { useEffect, useState, useRef } from 'react';
import { useHistory, withRouter, useParams } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Chat from '../../chat/containers/ChatContainer';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import ExitPopUp from '../../../features/game/containers/ExitPopUpContainer';

const Lobby = function ({ user, startGame }) {
	const [gameInfo, setGameInfo] = useState([]);
	const [playersName, setPlayersName] = useState([]);
	const [openModal, setOpenModal] = useState(false);
	const [isInGame, setIsInGame] = useState(false);
	const history = useHistory();
	const { game } = useParams();

	const ws = useRef(null);

	useEffect(() => {

		ws.current = new WebSocket(`ws://190.190.133.175:8000/game/${game}`);

		ws.current.onmessage = (event) => {
			setGameInfo(JSON.parse(event.data));
		};

		ws.current.onerror = function (err) {
			console.log(err, "ERROR")
		}

		return () => {
			ws.current.close();
		};

	});

	useEffect(() => {
		if (gameInfo && gameInfo.players) {
			let players = Object.values(gameInfo.players);
			setIsInGame(false);
			if (players.filter(player => player.user_name === user.username).length) setIsInGame(true);
		}
	},[gameInfo])

	useEffect(() => {
		if (gameInfo.status === 'STARTED') history.push(`/game/${game}`)
	}, [gameInfo.status])

	useEffect(() => {
		if (gameInfo.players) {
			setPlayersName(Object.keys(gameInfo.players));
		}
	}, [gameInfo])

    return (
        <div style={{ display:'flex', flexDirection:'row' ,height:'100%', alignItems:'center',  width:'100%', justifyContent:'space-evenly',backgroundImage: `url(${require('../../../constants/images/fondo3.jpeg')})`, backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: "cover" }}>
			<div style={{flex:1}} />
			<div style={{display:'flex', width:'100%', height:'100%', alignItems: 'center', flex:3, paddingRight:60 }}>
				<Grid component={Paper} className="lobby" style={{display:'flex', flex:1, flexDirection:'column', alignItems: 'center', backgroundColor:'black', opacity:.8, height:'80%', overflowX:'auto'}}>
					<div style={{ display:'flex', justifyContent:'flex-end', alignItems:'flex-end', width:'100%' }}>
						{isInGame && <IconButton  onClick={() => setOpenModal(true)}> <CloseIcon color='secondary' fontSize='large' /> </IconButton>}
					</div>
					{gameInfo && gameInfo.players ?
						<>
							<div style={{ display:'flex', alignItems:'center', justifyContent:'flex-start', flexDirection:'row', paddingTop:30 }}>
								<a style={{ fontSize:48, color:'white' }} >GAME NAME: </a>
								<a style={{ fontSize:40, marginLeft:40, color:'white' }}>{gameInfo.name}</a>
							</div>

							<div style={{display:'flex' , flexDirection:'column', paddingTop:16 }}>
								<div style={{ display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'row'}}>	
									<a style={{ fontSize:48, color:'white'  }} >Owner: </a>
									<a style={{ fontSize:40, marginLeft:40, color:'white'}}>{playersName[0]}</a>
								</div>
								<div style={{ display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'row', paddingTop:16  }}>
									<a style={{ fontSize:48, color:'white' }} >Players: </a>
									<a style={{ fontSize:40, marginLeft:40, color:'white'  }}>{gameInfo.num_players}/{gameInfo.max_players}</a>
								</div>
							</div>
							<div style={{display:'flex' , flexDirection:'column', justifyContent:'center', paddingTop:40 }}>
								{playersName.map((values) => {
									return (
										<a style={{ fontSize:26, color:'white', marginBottom:20 }}>- {values}</a>
									)
								})}
							</div>
							<div style={{display:'flex', flexDirection:'row',alignItems:'flex-end', flex:1, paddingBottom:30 }}>
								<Button style={{ backgroundColor:'black', marginRight: 20 }} variant='outlined' size='small' color='secondary' onClick={() => history.goBack()}>
									BACK
								</Button>
								{gameInfo.num_players >= gameInfo.min_players && gameInfo.owner === user.username && <Button variant='outlined'  color='secondary' style={{ backgroundColor:'black' }} size='small' onClick={() => startGame(game)}>
									START GAME
								</Button>}
							</div>
						</>
					:
						<div style={{flex:1 , display:'flex', alignItems:'center'}}>
							<CircularProgress color='secondary' />
						</div>
					}
				</Grid>
			</div>
			<div className="lobby" style={{display:'flex', flexDirection:'column', alignItems: 'center', width: '20%'}}>
                <Chat gameInfo={ gameInfo }/>
			</div>
			<ExitPopUp open={openModal} onClose={() => setOpenModal(false)} gameInfo={gameInfo} />
		</div>
	)
}

export default withRouter(Lobby);
