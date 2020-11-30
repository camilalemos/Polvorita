import React from 'react';
import { useHistory, withRouter } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const SelectDirectorCandidate = function ({ open, gameInfo }) {

    const history = useHistory();

    return (
        <div>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title">{gameInfo.winner}</DialogTitle>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    Are The Winners
            </div>
                <DialogActions>
                    <Button onClick={() => history.push(`/lobby`)} color="primary">
                        Back To lobby
                </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
export default withRouter(SelectDirectorCandidate)