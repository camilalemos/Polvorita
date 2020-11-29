import React, {Component, useState, useEffect} from "react";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';



const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });
  
    const ExpelliarmusPopUp = function ({ open, onClose, minister }) {
  
    const handleClick = () => {
        console.log("click")
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
              <DialogTitle style={{ textAlign: 'center'}} id="alert-dialog-slide-title">{"EXPELLIARMUS ACTIVATED!"}</DialogTitle>
              <a style={{ flex:1, textAlign:'center', fontSize:30 }}>Expelliarmus has beeen activated by {minister}!</a>
              <DialogActions>
                  <Button onClick={handleClick} color="primary">
                      Acept
                  </Button>
                  <Button onClick={onClose} color="primary">
                      Cancel
                  </Button>
              </DialogActions>
          </Dialog>
      </div>
    );
  }
  
  export default ExpelliarmusPopUp;
