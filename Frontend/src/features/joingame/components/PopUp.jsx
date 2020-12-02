import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import Slide from '@material-ui/core/Slide';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const PopUp = function ({  open, playerName, gamePassword, setPlayerName, setPassword, onClose, join }) {
    const classes = useStyles();
  return (
    <div>
        <Dialog
            open={open}
            className={classes.backgroundRoot}
            TransitionComponent={Transition}
            keepMounted
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
        >
            <div style={{ display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column', padding: 40}} id='fondo'>
                <h style={{ textAlign: 'center', color:'white', fontSize:40}} id="alert-dialog-slide-title">{"JOIN GAME"}</h>
                <div id='inputs' style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:20 }}>
                    <TextField
                        value={playerName}
                        required
                        className={classes.inputRoot}
                        style={{ marginBottom: 40, minWidth:300 }}
                        onChange={(value) => setPlayerName(value.target.value)}
                        onKeyPress={(e) => {if (e.key === 'Enter') join()}}
                        id="playerName"
                        size='small'
                        label="Player Name"
                        variant="outlined"
                    />
                    <TextField
                        value={gamePassword}
                        style={{ marginBottom: 40, minWidth:300 }}
                        onChange={(value) => setPassword(value.target.value)}
                        onKeyPress={(e) => {if (e.key === 'Enter') join()}}
                        id="gamePassword"
                        size='small'
                        className={classes.inputRoot}
                        type='password'
                        label="Game Password"
                        variant="outlined"
                    />
                </div>
                <DialogActions>
                    <Button onClick={onClose} variant="outlined" color='secondary' style={{ borderRadius:4, width:120 }}>
                        Cancel
                    </Button>
                    <Button onClick={join} variant="outlined" color='secondary' style={{ borderRadius:4, width:120, marginLeft:20 }}>
                        Join
                    </Button>
                </DialogActions>
            </div>
        </Dialog>
    </div>
  );
}

export default PopUp;

const useStyles = makeStyles((theme) => ({
    backgroundRoot: {
        '& .MuiDialog-paper': {
            backgroundColor: 'dimgrey',
        }
    },
    inputRoot:{
        '& .MuiInputLabel-outlined': {
            color:'white'
        },
        '& .MuiOutlinedInput-input': {
            color:'white'
        }
    }
  }));