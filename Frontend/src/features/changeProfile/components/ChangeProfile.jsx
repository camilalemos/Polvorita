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

const ChangeProfile = function ({ userInfo, getUserInfo, status, statusCode, open, onClose, enqueueSnackbar }) {
    
   

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
    const [errorPasswordLength, setErrorPasswordLength] = useState(false);
    const [errorPasswordSpecialChars, setErrorPasswordSpecialChars] = useState(false);
    const [errorPasswordVoid, setErrorPasswordVoid] = useState(false);


    const [errorNewPassword, setErrorNewPassword] = useState(false);
    const [errorConfirmPassword, setErrorConfirmPassword] = useState(false);

    
    const [fullNameLabel, setFullNameLabel] = useState('')
    const [userNameLabel, setUserNameLabel] = useState('')
    const [emailLabel, setEmailLabel] = useState('')
    const [renderConfirmPassword, setRenderConfirmPassword] = useState(false)
    
    const allowedFullName = () => {
        let isAllowed = true;
        const expression = /^([A-Z_a-z0-9])*$/
        
        if (!expression.test(String(fullName).toLowerCase())){
            enqueueSnackbar( 'Special characters or white spaces are not allowed', { variant: 'error'});
            setErrorUserName(true);
            isAllowed = false;
        }
        if (fullName.length !== 0 && (fullName.length > 30 || fullName.length < 5)){
            enqueueSnackbar( 'Full Name must have 5 to 30 characters', { variant: 'error'});
            setErrorFullName(true);
        }
        return isAllowed;
    }

    const allowedUserName = () => {
        let isAllowed = true;
        const expression = /^([A-Z_a-z0-9])*$/
        
        if (!expression.test(String(userName).toLowerCase())){
            enqueueSnackbar( 'Special characters or white spaces are not allowed', { variant: 'error'});
            setErrorUserName(true);
            isAllowed = false;
        }
        if (userName.length > 0 && (userName.length > 20 || userName.length < 5)){
            enqueueSnackbar( 'User Name must have 5 to 20 characters', { variant: 'error'});
            setErrorUserName(true);
            isAllowed = false;
        }
        return isAllowed;
    }
    const allowedEmail = (email) => {
        
        const expression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
        let isAllowed = true;
        
        if (email.length !== 0 && !expression.test(String(email).toLowerCase())){            
            enqueueSnackbar( 'Enter a valid email', { variant: 'error'});
            setErrorEmail(true);
            isAllowed = false;
        }
        return isAllowed;
    }

    const allowedPasswords = () => {
        
        let isAllowed = true;
        const passwordexpression = /^[A-Za-z0-9]*$/
        
        if (!passwordexpression.test(String(newPassword).toLowerCase()) || !passwordexpression.test(String(confirmPassword).toLowerCase())){
            setErrorNewPassword(true);
            enqueueSnackbar( 'Special characters or white spaces are not allowed', { variant: 'error'});
            isAllowed = false;
        }
        if (confirmPassword.length === 0 && newPassword.length !== 0){
            setErrorConfirmPassword(true);
            enqueueSnackbar( 'Required fields cannot be omitted', { variant: 'error'});
            isAllowed = false;
        }
        if (newPassword !== confirmPassword) {
            setErrorNewPassword(true);
            setErrorConfirmPassword(true);
            enqueueSnackbar('Passwords do not match', { variant: 'error'});
            isAllowed = false;
        }
        if (newPassword.length > 0 && (newPassword.length > 20 || newPassword.length < 5)){
            enqueueSnackbar( 'New password must have 5 to 20 characters', { variant: 'error'});
            setErrorNewPassword(true);
        }
        return isAllowed
    }


    const handleUpdateInfo = () =>{
        getUserInfo(userName, email, newPassword, password, fullName);
    }

    const handleChangePassword = (value) => {
        setNewPassword(value.target.value)
        !value.target.value ? setRenderConfirmPassword(false) : setRenderConfirmPassword(true)
        setErrorNewPassword(false)
    }

    const checkFormInput = () => {
        let isAllowed = true;

        if (!allowedUserName()) {
            isAllowed = false;
        }
        if (!allowedEmail(email)) {
            isAllowed = false;
        }
        if (!allowedPasswords()) {
            isAllowed = false;
        }
        if (!allowedFullName()) {
            isAllowed = false;
        }
        
        return isAllowed;
    }

    const handleSave = () => {

        if (checkFormInput()) {
            setOpenModal(true)
        }
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
    }

    const checkStatusCode = () => {
        switch (statusCode) {
            case '422':
                enqueueSnackbar('Something is going wrong, check your input and try again', { variant: 'error'});
                break;
            case '401':
                enqueueSnackbar('Wrong Credentials', { variant: 'error'});
                break;
            default:
                enqueueSnackbar('Something is going wrong, check your conection or try again later', { variant: 'error'});
                break;
        }
    }
    
    useEffect(() => {
        if (status === 'success'){ 
           updateData()
           enqueueSnackbar('Profile data successfully updated', { variant: 'success'});
        }
        if (status === 'failed'){
            checkStatusCode()
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
        </Dialog>
        </div>  
    );
}

export default withSnackbar(ChangeProfile);
  