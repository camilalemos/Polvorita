import React, {useCallback} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import Slide from '@material-ui/core/Slide';
import { makeStyles } from '@material-ui/core/styles';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function SelectDirectorCandidate({ open, onClose, candidatePlayers, selectDirector }) {

    const classes = useStyles();

    const handleClick = useCallback((player) => {
        selectDirector(player.name)
        onClose()
    }, [onClose, selectDirector])

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
            <h style={{color:'white', fontSize:40, textAlign: 'center', paddingTop:20,paddingBottom:20 }} id="alert-dialog-slide-title">Choose director</h>
            <div style={{flex:1, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                {candidatePlayers.map((player) => {
                    return (
                        <Button onClick={() => handleClick(player)} style={{backgroundColor:'', width:120, marginBottom:20}} variant='outlined' size='small' color='secondary'>{player.name}</Button>
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
