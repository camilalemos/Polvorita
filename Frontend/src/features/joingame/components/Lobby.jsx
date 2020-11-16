import React,  {useEffect, useState} from 'react';
import { useHistory, withRouter, useParams } from 'react-router-dom';
import Button from '@material-ui/core/Button';


const Lobby = function ({ user, startGame, statusStart }) { 
	const [gameInfo, setGameInfo] = useState([]);
	const [playersName, setPlayersName] = useState([]);
    const history = useHistory(); 
    const { game } = useParams();

    useEffect(() => {

		const ws = new WebSocket('ws://localhost:8000/lobby/');

		ws.onopen = () => {
			ws.send(JSON.stringify({event: 'lobby:subscribe'}));
		};
		
		ws.onmessage = (event) => {
			setGameInfo(JSON.parse(event.data).filter(games => games.name === game)[0]);
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
		if (statusStart === 'success') history.push(`/game/${game}`)
	}, [statusStart])
	
	useEffect(() => {
		if(gameInfo.players){
			setPlayersName(Object.keys(gameInfo.players));

		}
	},[gameInfo])

    return (
        <div style={{ display:'flex', flexDirection:'column' ,height:'100%', alignItems:'center',  width:'100%', justifyContent:'space-evenly' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'flex-start', flexDirection:'row' }}>
				<a style={{ fontSize:48 }} >GAME NAME: </a>
				<a style={{ fontSize:40, marginLeft:40 }}>{gameInfo.name}</a>
			</div>

			<div style={{display:'flex' , flexDirection:'column' }}>
				<div style={{ display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'row' }}>
					<a style={{ fontSize:48 }} >Players: </a>
					<a style={{ fontSize:40, marginLeft:40 }}>{gameInfo.num_players}/{gameInfo.max_players}</a>
				</div>
				<div style={{ display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'row' }}>	
					<a style={{ fontSize:48 }} >Owner: </a>
					<a style={{ fontSize:40, marginLeft:40 }}>{playersName[0]}</a>
				</div>
			</div>
			<div style={{display:'flex' , flexDirection:'column' }}>
				{playersName.map((values) => {
					return (
						<a style={{ fontSize:26 }}>- {values}</a>
					)
				})}
			</div>
			<div style={{display:'flex', flexDirection:'row' }}>
				<Button style={{ backgroundColor:'lightblue', marginRight: 20 }} size='small' onClick={() => history.goBack()}>
					BACK
				</Button>
				{gameInfo.num_players === 5 && user.username === Object.values(gameInfo.players)[0].user_name && <Button style={{ backgroundColor:'lightblue' }} size='small' onClick={() => startGame(game)}>
					START GAME
				</Button>}
			</div>
        </div>
    )

}

export default withRouter(Lobby);