import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import TextField from '@material-ui/core/TextField';


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });
  
  export default function PopUp({ open, onClose }) {
  
    return (
      <div>
          <Dialog
              open={open}
              TransitionComponent={Transition}
              keepMounted
              aria-labelledby="alert-dialog-slide-title"
              aria-describedby="alert-dialog-slide-description"
          >
              <DialogTitle style={{ textAlign: 'center'}} id="alert-dialog-slide-title">{"ENTER PASSWORD"}</DialogTitle>
              <div id='inputs' style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:20 }}>
                 
                  <TextField
        
                      style={{ marginBottom: 40, minWidth:300 }}

                      id="gamePassword"
                      size='small'
                      type='password'
                      label="Password"
                      variant="outlined"
                  />
                   <TextField
                        style={{ marginBottom: 40, minWidth:300 }}

                        id="gamePassword"
                        size='small'
                        type='password'
                        label="Password"
                        variant="outlined"
                    />
              </div>
              <DialogActions>
                  <Button onClick={onClose} color="primary">
                      Cancel
                  </Button>
                  <Button  color="primary">
                      Confirm
                  </Button>
              </DialogActions>
          </Dialog>
      </div>
    );
  }