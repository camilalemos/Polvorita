import React, {useState} from "react";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom'
import { useEffect } from "react";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const ExitPopUp = function ({ open, onClose, quitGame, user, gameInfo }) {

    const classes = useStyles();
    const history = useHistory();
    const [currentPlayer, setCurrentPlayer] = useState(null)

    useEffect(() => {
        if (gameInfo && gameInfo.players) {
            let players = Object.values(gameInfo.players);
            setCurrentPlayer(players.filter(player => player.user_name === user.username)[0]);
        }
    }, [user, gameInfo])

    const handleClick = () => {
        quitGame(gameInfo.name, currentPlayer.name)
        history.push("/lobby/");
    }

    return (
        <div>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                className={classes.backgroundRoot}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <h style={{ textAlign: 'center', color:'white', fontSize:40, marginBottom:20, marginTop:20 }} id="alert-dialog-slide-title">{"QUIT GAME"}</h>
                <h style={{ flex: 1, textAlign: 'center', fontSize: 30, color:'white' }}>Are you sure you want to leave the game?</h>
                <div style={{display:'flex', justifyContent:'center', paddingBottom:20, paddingTop:20}}>
                    <Button variant='outlined' onClick={handleClick} color="secondary">
                        Yes
                    </Button>
                    <Button variant='outlined' style={{marginLeft:20}} onClick={onClose} color="secondary">
                        No
                    </Button>
                </div>
            </Dialog>
        </div>
    );
}

export default ExitPopUp;

const useStyles = makeStyles((theme) => ({
    backgroundRoot: {
        '& .MuiDialog-paper': {
            backgroundColor: 'dimgrey',
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

