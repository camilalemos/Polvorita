import React, { useEffect, useState, useRef } from 'react';
import Board from '../containers/BoardContainers';
import ShowRoleContainers from '../../../features/showRole/containers/ShowRoleContainers';
import { useParams, useHistory } from 'react-router-dom';
import PlayersActions from '../containers/PlayerActionsContainers'
import Chat from '../../chat/containers/ChatContainer'
import Spells from '../containers/SpellsContainers'
import PlayerList from '../containers/ListPlayersContainers'
import WinPopUp from './winPopUp.jsx'
import Expelliarmus from '../containers/ExpelliarmusContainer';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

export default function Game() {

    const { game } = useParams();
    const history = useHistory();
    const [gameInfo, setGameInfo] = useState([]);
    const [gameStatusFinish, setGameStatusFinish] = useState(false);

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
        if (gameInfo && gameInfo.status === 'FINISHED')
            setGameStatusFinish(true)
    }, [gameInfo])

    return (
        <div style={{ display: 'flex', flex: 1, flexDirection: 'row', height: '100%' }} >
            <div className="game" style={{overflowY:'auto',overflowX:'hidden', display: 'flex', flex: 1, flexDirection: 'column', borderRight: 'solid', borderRightWidth: 1,backgroundImage: `url(${require('../../../constants/images/fondo_izq.png')})`, backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: "cover" }}>
                <div style={{ flex: 1 }}>
                    <ShowRoleContainers gameInfo={gameInfo} />
                </div>
                <div style={{ flex: 1, borderTop: 'solid', borderTopWidth: 1, borderTopColor: '#34203b', borderTopWidth:20 }}>
                    <PlayersActions gameInfo={gameInfo} />
                </div>
                <div style={{ flex: 1, borderTop: 'solid', borderTopWidth: 1, borderTopColor: '#34203b', borderTopWidth:20 }}>
                    <div style={{flex:1, display:'flex', justifyContent:'center'}}><Spells gameInfo={gameInfo} /></div>
                    <div style={{flex:1, display:'flex', justifyContent:'center'}}><Expelliarmus gameInfo={gameInfo} /></div>
                </div>
                <div style={{ flex: 1, borderTop: 'solid', borderTopWidth: 1, borderTopColor: '#34203b', borderTopWidth:20 }}>
                    <PlayerList gameInfo={gameInfo} />
                </div>
            </div>
            <div className="game-board" style={{ display: 'flex', flex: 2.8, borderLeft: 'solid', borderLeftWidth: 1, padding: 20,backgroundImage: `url(${require('../../../constants/images/FondoBoard.png')})`, backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: "cover" }}>
                <Board gameInfo={gameInfo} />
                <WinPopUp open={gameStatusFinish} onClose={() => setGameStatusFinish(false)} gameInfo={gameInfo} />
            </div>
            <div className="game-info" style={{ display: 'flex', flexDirection:'column', flex: .7, borderLeft: 'solid', borderLeftWidth: 1, padding: 20,backgroundImage: `url(${require('../../../constants/images/fondo_chat.jpeg')})`, backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: "cover" }}>
                <div style={{ display:'flex', flexDirection:'row', justifyContent:'flex-end' }}>
                    <IconButton  onClick={() => null}> <CloseIcon color='primary' fontSize='large' /> </IconButton>
                    <IconButton  onClick={() => history.push('/lobby/')}> <ExitToAppIcon color='primary' fontSize='large' /> </IconButton>
                </div>
                <Chat gameInfo={gameInfo} />
            </div>
        </div>
    );
}
