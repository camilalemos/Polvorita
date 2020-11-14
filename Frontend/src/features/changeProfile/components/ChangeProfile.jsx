import React, {Component, useState, useEffect} from "react";
import ReactDOM from 'react-dom'
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

const ChangeProfile = function ({ userInfo, getUserInfo, status, open, onClose, enqueueSnackbar }) {
    
   

    const [openModal, setOpenModal] = useState(false);
    const [userName, setUserName] = useState('');
    const [errorUserName, setErrorUserName] = useState(false);
    const [fullName, setFullName] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [email, setEmail] = useState('');
    const [errorEmail, setErrorEmail] = useState(false);
    const [errorPassword, setErrorPassword] = useState(false);
    const [fullNameLabel, setFullNameLabel] = useState('')
    const [userNameLabel, setUserNameLabel] = useState('')
    const [emailLabel, setEmailLabel] = useState('')
    const [renderConfirmPassword, setRenderConfirmPassword] = useState(false)

    
    const tet = "hola"
    
    const handleSave = () => {
        setOpenModal(true)
       //getUserInfo(userName, email, newPassword, password, fullName)
    }
   
    useEffect(() => {
        getUserInfo(password)
    },[])

    
    useEffect(() => {
       
        if (status === 'success'){ 
           setFullName('')
           setFullNameLabel(userInfo.full_name)
           setUserName('')
           setUserNameLabel(userInfo.username)
           setEmail('')
           setEmailLabel(userInfo.email)
           setPassword('')
           setNewPassword('')
           setRenderConfirmPassword(false)
        }
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
                    <TextField 
                        value={fullName} 
                        id="Full Name" 
                        label={fullNameLabel} 
                        variant="filled"
                       // style={{ marginBottom: 40, minWidth:300 }}
                        onChange={(value) => (setFullName(value.target.value))}
                      
                    />
                </ListItem>
                <ListItem button>
                    <ListItemText primary="Username" />
                    <TextField
                        value={userName}   
                        id="Username" 
                        label={userNameLabel} 
                        variant="filled" 
                        //style={{ marginBottom: 40, minWidth:300 }}
                        onChange={(value) => (setUserName(value.target.value))}
                        id="gameName"
                    />
                </ListItem>
                <ListItem button>
                    <ListItemText primary="E-mail" />
                    <TextField 
                        value={email}   
                        id="E-mail" 
                        label={emailLabel} 
                        variant="filled" 
                        onChange={(value) => (setEmail(value.target.value))}
                    />
                </ListItem>
                <ListItem button>
                    <ListItemText primary="Change Password" />
                    <TextField 
                        value={newPassword} 
                        id="Change Password" 
                        label="New password" 
                        type='password'
                        variant="filled" 
                        onChange={(value) => (setNewPassword(value.target.value), setRenderConfirmPassword(true))}
                    />
                </ListItem>
                <div>
                    {renderConfirmPassword 
                    ?
                    <ListItem button>
                        <ListItemText primary="Confirm New Password" />
                        <TextField 
                            id="Confirm New Password" 
                            required
                            label="New Password" 
                            type='password'
                            variant="filled" 
                        // onChange={(value) => (setNewPassword(value.target.value))}
                        /> 
                    </ListItem>
                    :
                        console.log("working")
                    }
                </div>
            </List>
            <PopUp sendNewInfo={() => getUserInfo(userName, email, newPassword, password, fullName)} open={openModal} 
            password={password} setPassword={(value) => setPassword(value)} onClose={() => setOpenModal(false)}/>
            <div style={{ flexDirection:'row'}}>
                        <Button size='small' onClick={onClose} variant="outlined" color="primary" style={{ borderRadius:4, width:120 }}>
                            Cancel
                        </Button>
                        <Button  color="primary" onClick={handleSave}>
                             Save
                        </Button>
            </div>
        </Dialog>
        </div>  
    );
}

export default withSnackbar(ChangeProfile);
  