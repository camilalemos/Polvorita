import React, { useState, useEffect } from "react";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import { withSnackbar } from 'notistack';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import PopUp from './PopUp.jsx';
import TextField from '@material-ui/core/TextField';



const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

const ChangeProfile = function ({ status, open, onClose, enqueueSnackbar }) {
    
    const [openModal, setOpenModal] = useState(false);
    
    
    useEffect(() => {
        if (status === 'failed') enqueueSnackbar('Game name is already in use', { variant: 'error'});
       // if (status === 'success') history.push(gameName)
    },[status])

    return (    
        
        <div>  
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
        >
            <List component="nav"  aria-label="contacts">
            <ListItem >
            <ListItemText primary="Fullname" />
            <TextField id="filled-basic" label="Filled" variant="filled" />
            </ListItem>
            <ListItem button>
            <ListItemText primary="Username" />
            </ListItem>
            <ListItem button>
            <ListItemText primary="Mail" />
            </ListItem>
            <ListItem button>
            <ListItemText primary="Password" />
            </ListItem>
            </List>
			<PopUp open={openModal} onClose={() => setOpenModal(false)}/>
            <div style={{ flexDirection:'row'}}>
                        <Button size='small' onClick={onClose} variant="outlined" color="primary" style={{ borderRadius:4, width:120 }}>
                            Cancel
                        </Button>
                        <Button  color="primary" onClick={() => setOpenModal(true)}>
                             Save
                        </Button>
            </div>
        </Dialog>
        </div>  
    );
}

export default withSnackbar(ChangeProfile);
  