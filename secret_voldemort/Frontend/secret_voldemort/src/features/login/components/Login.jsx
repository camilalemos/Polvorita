import React, { useEffect, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from "react-router-dom";
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withSnackbar } from 'notistack';

const Login = function ({ loginUser, status, enqueueSnackbar }) {

    const history = useHistory();

    const [userNameOrEmail, setUserNameOrEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorUserNameOrEmail, setErrorUserNameOrEmail] = useState(false);
    const [errorPassword, setErrorPassword] = useState(false);

    const handleLogin = () => loginUser({userNameOrEmail, password});

    useEffect(() => {
        if (status === 'failed') enqueueSnackbar('Sign In Failed, Username/email or password do not match', { variant: 'error'});
        if (status === 'success') enqueueSnackbar('Sign In successfully', { variant: 'success'});
    },[status])
    
    return (            
        <div style={{ display:'flex', height:'100%', width:'100%', justifyContent:'center', alignItems:'center', backgroundImage: `url(${require('../../../constants/images/Fondo.jpg')})`}} id='fondo'>
            {/* <div style={{ display: 'flex', flexDirection: 'column' }} id='login'> */}
            <Paper style={{ display: 'flex', flexDirection: 'column', padding: 32, borderRadius:12, opacity:0.7 }} elevation={8} square >
                <b style={{ fontSize:40, textAlign:'center', marginBottom:20}}>
                    SECRET VOLDEMORT
                </b>
                <div id='inputs' style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
                    <TextField
                        value={userNameOrEmail}
                        error={errorUserNameOrEmail}
                        style={{ marginBottom: 40, minWidth:300 }}
                        onChange={value => setUserNameOrEmail(value.target.value)}
                        id="userNameOrEmail"
                        size='small'
                        required
                        label="Username or email"
                        variant="outlined"
                    />

                    <TextField
                        value={password}
                        error={errorPassword}
                        required
                        onChange={value => setPassword(value.target.value)}
                        id="password"
                        type='password'
                        size='small'
                        style={{  marginBottom: 40, minWidth:300 }}
                        label="Password"
                        variant="outlined"
                    />
                </div>

                <div style={{ display: 'flex', justifyContent:'center', marginBottom: 20, marginTop: 20 }}>
                    {false ? 
                        <CircularProgress />
                    :
                        <Button onClick={handleLogin} variant="outlined" color="primary" style={{ borderRadius:4, width:120 }}>
                            Sign in
                        </Button>
                    }
                </div>
                <div style={{flexDirection:'row', textAlign:'center'}}>
                    <a style={{ fontSize: 12, color:'black' }}>You do not have an account? </a>
                    <a style={{ fontSize: 12, color:'blue', cursor:'pointer' }} onClick={() => history.push('/register')}>Create account</a>
                </div>
            </Paper>
            {/* </div> */}
        </div>
    );

}

export default withSnackbar(Login);

const useStyles = makeStyles((theme) => ({
    // root: {
    //   display: 'flex',
    //   flexWrap: 'wrap',
    // },
    // margin: {
    //   margin: theme.spacing(1),
    // },
    // withoutLabel: {
    //   marginTop: theme.spacing(3),
    // },
    // textField: {
    //   width: '25ch',
    // },
  }));