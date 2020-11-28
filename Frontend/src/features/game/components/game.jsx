import React, {useEffect, useState, useRef} from 'react';
import Board from '../containers/BoardContainers';
import ShowRoleContainers from '../../../features/showRole/containers/ShowRoleContainers';
import { useParams } from 'react-router-dom';
import PlayersActions from '../containers/PlayerActionsContainers'
import Chat from '../../chat/containers/ChatContainer'
import Spells from '../containers/SpellsContainers'
import PlayerList from '../containers/ListPlayersContainers'
import WinPopUp from './winPopUp.jsx'


export default function Game () {

    const { game } = useParams();

    const [gameInfo, setGameInfo] = useState([]);
    const [gameStatusFinish, setGameStatusFinish ] = useState(false);

    const ws = useRef(null);
    //console.log(ws, "WS");
    useEffect(() => {

	    ws.current = new WebSocket(`ws://localhost:8000/game/${game}`);

		// ws.onopen = () => {
		// ws.send(JSON.stringify({event: 'game:subscribe'}));
		// };

		ws.current.onmessage = (event) => {
        setGameInfo(JSON.parse(event.data));
        // console.log(gameInfo)
        };
        
        ws.current.onerror = function(err) {
			console.log(err, "ERROR")
		}

		// ws.onclose = () => {
		// ws.close();
		// };

		return () => {
		ws.current.close();
		};
    });
    useEffect(() => {
        if ( gameInfo.length !== 0 && gameInfo.status === 'FINISHED')
            setGameStatusFinish(true)
    })

    return (
        <div style={{display:'flex', flex:1, flexDirection:'row', height:'100%'}} >
            <div className="game" style={{display:'flex', flex:1, flexDirection:'column', borderRight:'solid', borderRightWidth:1}}>
                <div style={{ flex:1 }}>
                    <ShowRoleContainers gameInfo={ gameInfo }/>
                </div>
                <div style={{ flex:1, borderTop:'solid', borderTopWidth:1, borderTopColor:'lightgrey' }}>
                    <PlayersActions gameInfo={gameInfo} />
                </div>
                <div style={{ flex:1, borderTop:'solid', borderTopWidth:1, borderTopColor:'lightgrey' }}>
                    <Spells gameInfo={gameInfo} />
                </div>
                <div style={{ flex:1, borderTop:'solid', borderTopWidth:1, borderTopColor:'lightgrey' }}>
                    <PlayerList gameInfo={gameInfo} />
                </div>
            </div>
            <div className="game-board" style={{display:'flex', flex:2.5}}>
                <Board gameInfo={ gameInfo }/>
                <WinPopUp open={gameStatusFinish} onClose={() => setGameStatusFinish(false)} gameInfo= { gameInfo}/>
            </div>
            <div className="game-info" style={{display:'flex', flex:.7, borderLeft:'solid', borderLeftWidth:1, padding: 20}}>
                <Chat gameInfo={ gameInfo }/>
            </div>
        </div>
    );
}