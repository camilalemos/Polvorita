import React,{useState,useEffect} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function SelectDirectorCandidate({ open, onClose, gameInfo }) {
    
    const [ winner, setWinner] = useState('');

    useEffect (() => {
        setWinner(gameInfo.winner)
    })

    return (
        <div>
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle id="alert-dialog-slide-title">{winner}</DialogTitle>
            <div style={{flex:1, display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
                Are The Winners
            </div>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Back To lobby
                </Button>
            </DialogActions>
        </Dialog>
        </div>
    );
}