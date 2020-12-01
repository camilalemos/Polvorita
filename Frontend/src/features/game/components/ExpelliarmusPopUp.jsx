import React from "react";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';



const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });
  
const ExpelliarmusPopUp = function ({ open, onClose, headMaster, expelliarmus}) {
  
    
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
              aria-labelledby="alert-dialog-slide-title"
              aria-describedby="alert-dialog-slide-description"
          >
              <DialogTitle style={{ textAlign: 'center'}} id="alert-dialog-slide-title">{"EXPELLIARMUS ACTIVATED!"}</DialogTitle>
              <h style={{ flex:1, textAlign:'center', fontSize:30 }}>Expelliarmus has beeen activated by {headMaster}!</h>
              <DialogActions>
                  <Button onClick={()=>(handleClick('yes'))} color="primary">
                      Acept
                  </Button>
                  <Button onClick={()=>(handleClick('no'))} color="primary">
                      Cancel
                  </Button>
              </DialogActions>
          </Dialog>
      </div>
    );
  }
  
  export default ExpelliarmusPopUp;
