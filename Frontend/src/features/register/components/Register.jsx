import React, { useEffect, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from "react-router-dom";
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withSnackbar } from 'notistack';
import useDidMountEffect from '../../../constants/hooks/useDidMountEffect'

const Register = function ({ registerUser, status, enqueueSnackbar, statusCode }) {

    const history = useHistory();
    const [userName, setUserName] = useState('');
    const [errorUserName, setErrorUserName] = useState(false);
    const [email, setEmail] = useState('');
    const [errorEmail, setErrorEmail] = useState(false);
    const [fullName, setFullName] = useState('');
    const [password, setPassword] = useState('');
    const [errorPassword, setErrorPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorConfirmPassword, setErrorConfirmPassword] = useState(false);

    const validate = (email) => {
        const expression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;

        return expression.test(String(email).toLowerCase())
    }

    const checkForm = () => {

        if (!userName) setErrorUserName(true);
        if (validate(userName) || userName.search('@') !== -1) setErrorUserName(true);
        if (!validate(email)) setErrorEmail(true);
        if (!email) setErrorEmail(true);
        if (password !== confirmPassword){ 
            setErrorConfirmPassword(true);
            enqueueSnackbar('Passwords do not match', { variant: 'error'});
        }
        if (!password || password.length < 8){ 
            setErrorPassword(true);
            enqueueSnackbar('Password must have a minimum of 8 characters', { variant: 'error'});
        }
        if (!confirmPassword) setErrorConfirmPassword(true);

    }

    const handleinput = (type) => (value) => {

        switch (type) {
            case 'userName':
                    setUserName(value.target.value);
                    setErrorUserName(false);
                break;
            case 'email':
                    setEmail(value.target.value);
                    setErrorEmail(false);
                break;
            case 'password':
                    setPassword(value.target.value);
                    setErrorPassword(false);
                break;
            case 'confirmPassword':
                    setConfirmPassword(value.target.value);
                    setErrorConfirmPassword(false);
                break;
        
            default:
                break;
        }
    }

    useDidMountEffect(() => {
        if (statusCode === '403') enqueueSnackbar('Sign up Failed, Username/email al ready exists', { variant: 'error'});
    },[statusCode])

    useDidMountEffect(() => {
        if (status === 'success') {
            enqueueSnackbar('Sign In successfully', { variant: 'success'});
            history.push('/login');
        }
    },[status])

    const handleRegister = () => {
        checkForm();
        if (userName && 
            !validate(userName) && 
            userName.search('@') === -1 &&
            validate(email) &&
            email &&
            password === confirmPassword && 
            password &&
            password.length >= 8 && 
            confirmPassword
        )

        registerUser({userName, email, fullName, password});
    }

    return (            
        <div style={{ display:'flex', height:'100%', justifyContent:'center', alignItems:'center', backgroundImage: `url(${require('../../../constants/images/Fondo.jpg')})`}} id='fondo'>
            {/* <div style={{ display: 'flex', flexDirection: 'column' }} id='login'> */}
            <Paper style={{ display: 'flex', flexDirection: 'column', padding: 32, borderRadius:12, opacity:.8 }} elevation={8} square >
                <b style={{ fontSize:40, textAlign:'center', marginBottom:20}}>
                    SECRET VOLDEMORT
                </b>
                <div id='inputs' style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
                    <TextField
                        value={fullName}
                        style={{ marginBottom: 40, minWidth:300 }}
                        onChange={(value) => setFullName(value.target.value)}
                        id="userName"
                        size='small'
                        label="Full Name"
                        variant="outlined"
                    />
                    <TextField
                        value={userName}
                        required
                        error={errorUserName}
                        onChange={handleinput('userName')}
                        id="userName"
                        size='small'
                        style={{ marginBottom: 40, minWidth:300 }}
                        label="Username"
                        variant="outlined"
                    />
                    <TextField
                        value={email}
                        required
                        error={errorEmail}
                        onChange={handleinput('email')}
                        id="email"
                        type='email'
                        size='small'
                        style={{  marginBottom: 40, minWidth:300 }}
                        label="Email"
                        variant="outlined"
                    />
                    <TextField
                        value={password}
                        required
                        error={errorPassword}
                        onChange={handleinput('password')}
                        id="password"
                        type='password'
                        size='small'
                        style={{  marginBottom: 40, minWidth:300 }}
                        label="Password"
                        variant="outlined"
                    />
                    <TextField
                        value={confirmPassword}
                        required
                        error={errorConfirmPassword}
                        onChange={handleinput('confirmPassword')}
                        id="confirm-password"
                        type='password'
                        size='small'
                        style={{  marginBottom: 40, minWidth:300 }}
                        label="Confirm Password"
                        variant="outlined"
                    />
                </div>
                <a style={{ textAlign: 'center', fontSize: 12, color:'black' }}>Password: minimum 8 characters</a>
                <a style={{ textAlign: 'center', fontSize: 12, color:'black' }}>Username: symbols are not accepted</a>
                <div style={{ display: 'flex', justifyContent:'center', marginBottom: 20, marginTop: 20 }}>
                    {status === 'loading' ? 
                        <CircularProgress />
                    :
                        <Button onClick={handleRegister} variant="outlined" color="primary" style={{ borderRadius:4, width:120 }}>
                            Sign up
                        </Button>
                    }
                </div>
                <div style={{flexDirection:'row', textAlign:'center'}}>
                    <a style={{ fontSize: 12, color:'black' }}>Already have an account? </a>
                    <a style={{ fontSize: 12, color:'blue', cursor:'pointer' }} onClick={() => history.push('/login')}>Login</a>
                </div>
            </Paper>
            {/* </div> */}
        </div>
    );

}

export default withSnackbar(Register);
