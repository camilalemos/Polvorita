import React, {useCallback} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function SelectDirectorCandidate({ open, onClose, candidatePlayers, selectDirector }) {

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
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle id="alert-dialog-slide-title">Choose your director</DialogTitle>
            <div style={{flex:1, display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
                {candidatePlayers.map((player) => {
                    return (
                        <Button onClick={() => handleClick(player)} >{player.name}</Button>
                    )
                })}
            </div>
            <DialogActions>
            </DialogActions>
        </Dialog>
        </div>
    );
}