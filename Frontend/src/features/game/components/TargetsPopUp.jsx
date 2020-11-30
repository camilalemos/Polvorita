import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function popUp({ open, onClose, players, currentPlayer, castSpell }) {

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
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title">Choose your target</DialogTitle>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    {players.map((player) => {
                        return (
                            player.is_alive && currentPlayer !== null && currentPlayer !== undefined &&
                            player.name !== currentPlayer.name &&
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
