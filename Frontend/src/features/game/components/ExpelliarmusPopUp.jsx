import React from "react";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { makeStyles } from '@material-ui/core/styles';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const ExpelliarmusPopUp = function ({ open, onClose, headMaster, expelliarmus }) {

    const classes = useStyles()
    const handleClick = (type) => {
        if (type === 'yes') expelliarmus(true)
        else expelliarmus(false)
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
                <DialogTitle style={{ textAlign: 'center' }} id="alert-dialog-slide-title">{"EXPELLIARMUS ACTIVATED!"}</DialogTitle>
                <h style={{ flex: 1, textAlign: 'center', fontSize: 30 }}>Expelliarmus has been activated by {headMaster}!</h>
                <div style={{display:'flex', justifyContent:'center', paddingBottom:20, paddingTop:20}}>
                    <Button variant='outlined' onClick={() => (handleClick('yes'))} color="primary">
                        EXPELLIARMUS
                    </Button>
                    <Button variant='outlined' style={{marginLeft:20}} onClick={() => (handleClick('no'))} color="primary">
                        CANCEL
                    </Button>
                </div>
            </Dialog>
        </div>
    );
}

export default ExpelliarmusPopUp;

const useStyles = makeStyles((theme) => ({
    backgroundRoot: {
        '& .MuiDialog-paper': {
            backgroundColor: '#6b1e24',
            width: '30%',
            opacity: .9
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
