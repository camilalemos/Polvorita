import React from 'react';
import { useHistory, withRouter } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { makeStyles } from '@material-ui/core/styles';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const SelectDirectorCandidate = function ({ open, gameInfo }) {

    const classes = useStyles();
    const history = useHistory();

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
                <DialogTitle id="alert-dialog-slide-title">{gameInfo.winner}</DialogTitle>
                <div style={{display: 'flex', justifyContent: 'center'}}>
                    <h style={{ fontSize: '25px', fontFamily: 'sans-serif'}}>Are The Winners</h>
            </div>
                <div style={{display: 'flex', justifyContent: 'center'}}>
                    <Button onClick={() => history.push(`/lobby`)} color="primary">
                        <h style={{ fontSize: '20px'}}>Back To lobby</h>
                </Button>
                </div>
            </Dialog>
        </div>
    );
}
export default withRouter(SelectDirectorCandidate)


const useStyles = makeStyles((theme) => ({
    backgroundRoot: {
        '& .MuiDialog-paper': {
            backgroundColor: '#af555e',
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
