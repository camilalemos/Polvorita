import React, { useEffect, useState, useRef } from 'react';
import { useHistory, withRouter, useParams } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Chat from '../../chat/containers/ChatContainer'

const Lobby = function ({ user, startGame }) {
	const [gameInfo, setGameInfo] = useState([]);
	const [playersName, setPlayersName] = useState([]);
	const history = useHistory();
	const { game } = useParams();

	const ws = useRef(null);

	useEffect(() => {

		ws.current = new WebSocket(`ws://localhost:8000/game/${game}`);

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
		if (gameInfo.status === 'STARTED') history.push(`/game/${game}`)
	}, [gameInfo.status])

	useEffect(() => {
		if (gameInfo.players) {
			setPlayersName(Object.keys(gameInfo.players));
		}
	}, [gameInfo])

	return (
		<div style={{ display: 'flex', flexDirection: 'row', height: '100%', alignItems: 'center', width: '100%', justifyContent: 'space-evenly', backgroundImage: `url(${require('../../../constants/images/fondo3.jpeg')})`, backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: "cover" }}>
			<div className="lobby" style={{ display: 'flex', flex: 1, flexDirection: 'column', alignItems: 'center' }}>
				<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row' }}>
					<a style={{ fontSize: 48 }} >GAME NAME: </a>
					<a style={{ fontSize: 40, marginLeft: 40 }}>{gameInfo.name}</a>
				</div>

				<div style={{ display: 'flex', flexDirection: 'column' }}>
					<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
						<a style={{ fontSize: 48 }} >Players: </a>
						<a style={{ fontSize: 40, marginLeft: 40 }}>{gameInfo.num_players}/{gameInfo.max_players}</a>
					</div>
					<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
						<a style={{ fontSize: 48 }} >Owner: </a>
						<a style={{ fontSize: 40, marginLeft: 40 }}>{playersName[0]}</a>
					</div>
				</div>
				<div style={{ display: 'flex', flexDirection: 'column' }}>
					{playersName.map((values) => {
						return (
							<a style={{ fontSize: 26 }}>- {values}</a>
						)
					})}
				</div>
				<div style={{ display: 'flex', flexDirection: 'row' }}>
					<Button style={{ backgroundColor: 'lightblue', marginRight: 20 }} size='small' onClick={() => history.goBack()}>
						BACK
					</Button>
					{gameInfo.num_players >= gameInfo.min_players && gameInfo.owner === user.username && <Button style={{ backgroundColor: 'lightblue' }} size='small' onClick={() => startGame(game)}>
						START GAME
					</Button>}
				</div>
			</div>
			<div className="lobby" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2%', width: '20%' }}>
				<Chat gameInfo={gameInfo} />
			</div>
		</div>
	)
}

export default withRouter(Lobby);
