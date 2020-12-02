import React, { useState, useEffect } from 'react';
import { useHistory, withRouter } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { makeStyles } from '@material-ui/core/styles';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const WinPopUp = function ({ open, gameInfo, quitGame, user }) {

    const classes = useStyles();
    const history = useHistory();

    const [gameName, setGameName] = useState('');
    const [players, setPlayers] = useState([]);
    const [currentPlayer, setCurrentPlayer] = useState(null);

    useEffect(() => {
        if (gameInfo) {
            setGameName(gameInfo.name);
        }
    }, [gameInfo])

    useEffect(() => {
        if (gameInfo.length !== 0) {
            setPlayers(Object.values(gameInfo.players));
        }
    }, [gameInfo, setPlayers])

    useEffect(() => {
        setCurrentPlayer(players.filter(player => player.user_name === user.username)[0]);
    }, [user, players])
    
    const handleClickRedirectToLobby = () => {
        if (currentPlayer) {
            quitGame(gameName,currentPlayer.name);
            history.push(`/lobby`)
        }
    }

    return (
        <div >
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
                className={classes.backgroundRoot}
            >
                <DialogTitle id="alert-dialog-slide-title" style={{ display: 'flex', justifyContent: 'center' }}>{gameInfo.winner === "PHOENIX_ORDER" ?  'PHOENIX ORDER' : 'DEATH EATERS' }</DialogTitle>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <h style={{ fontSize: '25px', fontFamily: 'sans-serif' }}>Are The Winners</h>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button onClick={() => handleClickRedirectToLobby()} color="primary">
                        <h style={{ fontSize: '20px' }}>Back To lobby{ }</h>
                    </Button>
                </div>
            </Dialog>
        </div>
    );
}
export default withRouter(WinPopUp)


const useStyles = makeStyles((theme) => ({
    backgroundRoot: {
        '& .MuiDialog-paper': {
            backgroundColor: '#af555e',
            width: '30%',
            opacity: .8
        }
    },
    inputRoot: {
        '& .MuiInputLabel-outlined': {
            color: 'white'
        },
        '& .MuiOutlinedInput-input': {
            color: 'white'
        }
    }
}));
