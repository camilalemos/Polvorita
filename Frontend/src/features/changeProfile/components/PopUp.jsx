import React from "react";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import TextField from '@material-ui/core/TextField';
import { withSnackbar } from 'notistack';



const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });
  
    const PopUp = function ({ open, password, setPassword, errorPassword, setErrorPassword, onClose, sendNewInfo, enqueueSnackbar}) {
  
    const allowed_password = (password) => {
        let isAllowed = true;
        const passwordexpression = /^[A-Za-z0-9]*$/
        if (!passwordexpression.test(String(password).toLowerCase())){
            enqueueSnackbar( 'Special characters or white spaces are not allowed', { variant: 'error'});
            setErrorPassword(true);
            isAllowed = false;
        }
        if (password.length === 0 ){
            enqueueSnackbar( 'Required fields cannot be omitted', { variant: 'error'});
            setErrorPassword(true);
            isAllowed = false;
        }
        if (password.length > 0 && (password.length > 20 || password.length < 5)) {
            enqueueSnackbar( 'Password must have 5 to 20 characters', { variant: 'error'});
            setErrorPassword(true);
            isAllowed = false;
        }
        return isAllowed
    }
    const handleChange = (value) => {
        setPassword(value.target.value);
        setErrorPassword(false);
    } 
    const handleConfirm = () => {
       
        if (allowed_password(password)) {
            onClose()
            sendNewInfo()
        }
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
              <DialogTitle style={{ textAlign: 'center'}} id="alert-dialog-slide-title">{"ENTER PASSWORD"}</DialogTitle>
              <div id='inputs' style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:20 }}>
                 
                  <TextField

                      style={{ marginBottom: 40, minWidth:300 }}
                      value = {password}
                      error={errorPassword}
                      onChange={(value) => (handleChange(value))}
                      onKeyPress={(e) => {if (e.key === 'Enter') handleConfirm()}}
                      id="Password"
                      required
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
                  <Button onClick={handleConfirm} color="primary">
                      Confirm
                  </Button>
              </DialogActions>
          </Dialog>
      </div>
    );
  }
  
  export default withSnackbar(PopUp);
