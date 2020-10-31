import React, { useEffect, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from "react-router-dom";
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

const Login = function ({ }) {

    const history = useHistory();

    const [userNameOrEmail, setUserNameOrEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorPassword, setErrorPassword] = useState(false);

    const validate = (email) => {
        const expression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
 
        return expression.test(String(email).toLowerCase())
    }

    // const checkForm = () => {

    //     if (!userName) setErrorUserName(true);
    //     if (!validate(email)) setErrorEmail(true);
    //     if (!email) setErrorEmail(true);
        
    //     if (password !== confirmPassword) setErrorConfirmPassword(true);
    //     if (!password || password.length < 8) setErrorPassword(true);
    //     if (!confirmPassword) setErrorConfirmPassword(true);
        
    // }

    // const handleinput = (type) => (value) => {

    //     switch (type) {
    //         case 'userName':
    //                 setUserName(value.target.value);
    //                 setErrorUserName(false);
    //             break;
    //         case 'email':
    //                 setEmail(value.target.value);
    //                 setErrorEmail(false);
    //             break;
    //         case 'password':
    //                 setPassword(value.target.value);
    //                 setErrorPassword(false);
    //             break;
    //         case 'confirmPassword':
    //                 setConfirmPassword(value.target.value);
    //                 setErrorConfirmPassword(false);
    //             break;
        
    //         default:
    //             break;
    //     }
    // }

    const handleLogin = () => {
        // checkForm();
        // registerUser({userName, email, fullName, password});
    }

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
                        style={{ marginBottom: 40, minWidth:300 }}
                        onChange={(value) => setUserNameOrEmail(value.target.value)}
                        id="userNameOrEmail"
                        size='small'
                        label="Username or email"
                        variant="outlined"
                    />

                    <TextField
                        value={password}
                        required
                        error={errorPassword}
                        onChange={null}
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
                        <Button onClick={null} variant="outlined" color="primary" style={{ borderRadius:4, width:120 }}>
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

export default Login;

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