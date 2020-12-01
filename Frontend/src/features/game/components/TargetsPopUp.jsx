import React, {useState} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { makeStyles } from '@material-ui/core/styles';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function PopUp({ open, onClose, players, currentPlayer, castSpell }) {
    
    const classes = useStyles();
    const handleClick = (player) => {
        castSpell(player.name)
        //setAviableSpell(false)
        onClose()
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
                <h style={{color:'white', fontSize:40, textAlign: 'center', paddingTop:20,paddingBottom:20 }} id="alert-dialog-slide-title">Choose target</h>
                <div style={{flex:1, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                    {players.map((player) => {
                        return (
                            player.is_alive && currentPlayer !== null && currentPlayer !== undefined &&
                            player.name !== currentPlayer.name &&
                            <Button  style={{backgroundColor:'', width:120, marginBottom:20}} variant='outlined' size='small' color='secondary' onClick={() => handleClick(player)} >{player.name}</Button>
                        )
                    })}
                </div>
                <DialogActions>
                </DialogActions>
            </Dialog>
        </div>
    );
}

const useStyles = makeStyles((theme) => ({
    backgroundRoot: {
        '& .MuiDialog-paper': {
            backgroundColor: '#6b1e24',
            width:'30%',
            opacity:.8
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
