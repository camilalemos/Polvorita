import React from 'react';
import Board from './board';
import ShowRoleContainers from '../../../features/showRole/containers/ShowRoleContainers';
import { useParams } from 'react-router-dom';

export default function Game () {

    const { game } = useParams();

    const [gameInfo, setGameInfo] = useState([]);

    useEffect(() => {

		const ws = new WebSocket(`ws://localhost:8000/game/${game}`);

		ws.onopen = () => {
		ws.send(JSON.stringify({event: 'game:subscribe'}));
		};

		ws.onmessage = (event) => {
        setGameInfo(JSON.parse(event.data));
        console.log(gameInfo)
		};

		ws.onclose = () => {
		ws.close();
		};

		return () => {
		ws.close();
		};
    });

    return (
        <div style={{display:'flex', flex:1, flexDirection:'row', backgroundColor:'blue', height:'100%'}} >
            <div className="game" style={{display:'flex', flex:1}}>
                <ShowRoleContainers gameInfo={ gameInfo }/>
            </div>
            <div className="game-board" style={{display:'flex', flex:2.5, backgroundColor:'red'}}>
                <Board />
            </div>
            <div className="game-info" style={{display:'flex', flex:.7, backgroundColor:'yellow'}}>
                <div>{/* status */}</div>
                <ol>{/* TODO */}</ol>
            </div>
        </div>
    );
}