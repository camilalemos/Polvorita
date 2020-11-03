import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import TextField from '@material-ui/core/TextField';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function PopUp({  open, playerName, gamePassword, setPlayerName, setPassword, onClose, join }) {

  return (
    <div>
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle style={{ textAlign: 'center'}} id="alert-dialog-slide-title">{"JOIN GAME"}</DialogTitle>
            <div id='inputs' style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:20 }}>
                <TextField
                    value={playerName}
                    required
                    style={{ marginBottom: 40, minWidth:300 }}
                    onChange={(value) => setPlayerName(value.target.value)}
                    id="playerName"
                    size='small'
                    label="Player Name"
                    variant="outlined"
                />
                <TextField
                    value={gamePassword}
                    style={{ marginBottom: 40, minWidth:300 }}
                    onChange={(value) => setPassword(value.target.value)}
                    id="gamePassword"
                    size='small'
                    type='password'
                    label="Game Password"
                    variant="outlined"
                />
            </div>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={join} color="primary">
                    Join
                </Button>
            </DialogActions>
        </Dialog>
    </div>
  );
}