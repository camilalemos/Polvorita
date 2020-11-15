import React,  {useEffect, useState} from 'react';
import { useHistory, withRouter, useParams } from 'react-router-dom'

const Lobby = function (props) { 
    const [gameInfo, setGameInfo] = useState([]);
    const history = useHistory(); 
    const { game } = useParams();

    useEffect(() => {

		const ws = new WebSocket('ws://localhost:8000/lobby/');

		ws.onopen = () => {
		ws.send(JSON.stringify({event: 'lobby:subscribe'}));
		};
		
		ws.onmessage = (event) => {
		setGameInfo(JSON.parse(event.data).filter(games => games.name === game));
	    console.log(gameInfo);
		};
		
		ws.onclose = () => {
		ws.close();
		};

		return () => {
		ws.close();
		};
    });

    return (
        <div style={{ display:'flex', height:'100%', alignItems:'center', justifyContent:'center' }}>
            holaa
            <button onClick={() => history.goBack()}>
                atrtas
            </button>
        </div>
    )

}

export default withRouter(Lobby);