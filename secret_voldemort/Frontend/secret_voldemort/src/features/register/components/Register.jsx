import React, { useEffect, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import clsx from 'clsx';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';

const Register = function ({  }) {

    const classes = useStyles();
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [values, setValues] = useState({
        amount: '',
        password: '',
        weight: '',
        weightRange: '',
        showPassword: false,
    });

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const handleClickShowPassword = () => {
        setValues({ ...values, showPassword: !values.showPassword });
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    return (            
        <div style={{ display:'flex', height:'100%', width:'100%', justifyContent:'center', alignItems:'center'}} id='fondo'>
            {/* <div style={{ display: 'flex', flexDirection: 'column' }} id='login'> */}
            <Paper style={{ display: 'flex', flexDirection: 'column', padding: 32, borderRadius:12 }} elevation={8} square >
                <b style={{ fontSize:40, textAlign:'center', marginBottom:20 }}>
                    SECRET VOLDEMORT
                </b>
                <div id='inputs' style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
                    <TextField
                        value={firstName}
                        style={{ marginBottom: 40, minWidth:300 }}
                        onChange={(value) => setFirstName(value.target.value)}
                        id="userName"
                        size='small'
                        label="First Name"
                        variant="outlined"
                    />
                    <TextField
                        value={lastName}
                        onChange={(value) => setLastName(value.target.value)}
                        id="userName"
                        size='small'
                        style={{ marginBottom: 40, minWidth:300 }}
                        label="Last Name"
                        variant="outlined"
                    />
                    <TextField
                        value={userName}
                        required
                        onChange={(value) => setUserName(value.target.value)}
                        id="userName"
                        size='small'
                        style={{ marginBottom: 40, minWidth:300 }}
                        label="Username"
                        variant="outlined"
                    />
                    <TextField
                        value={email}
                        required
                        onChange={(value) => setEmail(value.target.value)}
                        id="email"
                        type='email'
                        size='small'
                        style={{  marginBottom: 40, minWidth:300 }}
                        label="Email"
                        variant="outlined"
                    />
                    <FormControl size='small' required variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-password"
                            type={values.showPassword ? 'text' : 'password'}
                            value={values.password}
                            style={{ marginBottom: 40, minWidth:300 }}
                            onChange={handleChange('password')}
                            endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                                >
                                {values.showPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                            }
                            // labelWidth={70}
                        />
                    </FormControl>
                    <FormControl size='small' required variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-password">Confirm Password</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-password"
                            type={values.showPassword ? 'text' : 'password'}
                            value={values.password}
                            style={{ marginBottom: 60, minWidth:300 }}
                            onChange={handleChange('password')}
                            endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                                >
                                {values.showPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                            }
                            // labelWidth={70}
                        />
                    </FormControl>
                </div>

                <div style={{ display: 'flex', justifyContent:'center' }}>
                    <Button  variant="outlined" color="primary" style={{ borderRadius:4, width:120 }}>
                        Login
                    </Button>
                </div>
            </Paper>
            {/* </div> */}
        </div>
    );

}

export default Register;

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