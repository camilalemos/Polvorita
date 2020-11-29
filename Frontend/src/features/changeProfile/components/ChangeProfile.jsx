import React, {Component, useState, useEffect} from "react";
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

const ChangeProfile = function ({ userInfo, getUserInfo, status, errorMsg, open, onClose, enqueueSnackbar }) {

    const [openModal, setOpenModal] = useState(false);
    const [userName, setUserName] = useState('');
    const [fullName, setFullName] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    
    const [errorUserName, setErrorUserName] = useState(false);
    const [errorEmail, setErrorEmail] = useState(false);
    const [errorFullName, setErrorFullName] = useState(false);
    const [errorPassword, setErrorPassword] = useState(false);


    const [errorNewPassword, setErrorNewPassword] = useState(false);
    const [errorConfirmPassword, setErrorConfirmPassword] = useState(false);

    
    const [fullNameLabel, setFullNameLabel] = useState('')
    const [userNameLabel, setUserNameLabel] = useState('')
    const [emailLabel, setEmailLabel] = useState('')
    const [renderConfirmPassword, setRenderConfirmPassword] = useState(false)

    const handleUpdateInfo = () =>{
        getUserInfo(userName, email, newPassword, password, fullName);
    }

    const handleChangePassword = (value) => {
        setNewPassword(value.target.value)
        !value.target.value ? setRenderConfirmPassword(false) : setRenderConfirmPassword(true)
        setErrorNewPassword(false)
    }
    const checkNewPassword = () => {
        let isAllowed = true
        if (newPassword.length > 0 && newPassword !== confirmPassword) {
            isAllowed = false
            setErrorNewPassword(true)
            setErrorConfirmPassword(true)
            enqueueSnackbar('Passwords do not match', { variant: 'error'})
        }
        if (confirmPassword.length === 0 && newPassword.length > 0){
            enqueueSnackbar( 'Required fields cannot be omitted', { variant: 'error'});
            isAllowed = false
        }
        return isAllowed
    }

    const handleSave = () => {
        if(checkNewPassword())
        setOpenModal(true)
    }
   
    useEffect(() => {
        getUserInfo(password)
    },[])

    const updateData = () => {
        setFullName('')
        setFullNameLabel(userInfo.full_name)
        setUserName('')
        setUserNameLabel(userInfo.username)
        setEmail('')
        setEmailLabel(userInfo.email)
        setPassword('')
        setNewPassword('')
        setConfirmPassword('')
        setRenderConfirmPassword(false)
        setErrorNewPassword(false)
        setErrorConfirmPassword(false)
    }
    
    useEffect(() => {

        if (status === 'success') { 
            updateData()
            if (password){
                enqueueSnackbar('Profile data successfully updated', { variant: 'success'});
           }
        }
        if (status === 'failed'){
            if (status === 'failed') enqueueSnackbar(errorMsg, { variant: 'error'});
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
            <div style={{ display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column', padding: 40}} id='fondo'>
                <a style={{ textAlign: 'center', fontSize:40,  marginBottom:60}} id="alert-dialog-slide-title">{"MY PROFILE"}</a>
                <List component="nav"  aria-label="contacts">
                    <ListItem >
                        <ListItemText primary="Username" />
                        <TextField
                            value={userName}   
                            error={errorUserName}
                            id="Username" 
                            label={userNameLabel} 
                            variant="filled" 
                            //style={{ marginBottom: 40, minWidth:300 }}
                            onChange={(value) => (setUserName(value.target.value), setErrorUserName(false))}
                            onKeyPress={(e) => {if (e.key === 'Enter') handleSave()}}
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="E-mail" />
                        <TextField 
                            value={email}  
                            error={errorEmail} 
                            id="E-mail" 
                            label={emailLabel} 
                            variant="filled" 
                            onChange={(value) => (setEmail(value.target.value), setErrorEmail(false))}
                            onKeyPress={(e) => {if (e.key === 'Enter') handleSave()}}
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="Fullname" />
                        <TextField 
                            value={fullName} 
                            error={errorFullName}
                            id="Full Name" 
                            label={fullNameLabel} 
                            variant="filled"
                        // style={{ marginBottom: 40, minWidth:300 }}
                            onChange={(value) => (setFullName(value.target.value), setErrorFullName(false))}
                            onKeyPress={(e) => {if (e.key === 'Enter') handleSave()}}
                        
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="Change Password" />
                        <TextField 
                            value={newPassword} 
                            error={errorNewPassword}
                            id="Change Password" 
                            label="New password" 
                            type='password'
                            variant="filled" 
                            onChange={(value) => (handleChangePassword(value))}
                            onKeyPress={(e) => {if (e.key === 'Enter') handleSave()}}
                        />
                    </ListItem>
                    <div>
                        {renderConfirmPassword 
                        ?
                        <ListItem>
                            <ListItemText primary="Confirm New Password" />
                            <TextField 
                                value={confirmPassword}
                                error={errorConfirmPassword}
                                id="Confirm New Password" 
                                required
                                label="New Password" 
                                type='password'
                                variant="filled" 
                                onChange={(value) => (setConfirmPassword(value.target.value), setErrorConfirmPassword(false))}
                                onKeyPress={(e) => {if (e.key === 'Enter') handleSave()}}
                            /> 
                        </ListItem>
                        :
                        <div></div>   
                        }
                    </div>
                </List>
                <PopUp sendNewInfo={handleUpdateInfo} open={openModal} 
                password={password} errorPassword={errorPassword} setPassword={(value) => setPassword(value)} 
                setErrorPassword={(value) => setErrorPassword(value)} onClose={() => setOpenModal(false)}/>
                <div style={{ flexDirection:'row'}}>
                            <Button size='small' onClick={onClose} variant="outlined" color="primary" style={{ borderRadius:4, width:120 }}>
                                Cancel
                            </Button>
                            <Button  color="primary" onClick={handleSave}>
                                Save
                            </Button>
                </div>
            </div>
        </Dialog>
        </div>  
    );
}

export default withSnackbar(ChangeProfile);
  