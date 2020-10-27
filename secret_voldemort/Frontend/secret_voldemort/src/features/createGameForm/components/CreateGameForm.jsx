import React, { useState, useEffect } from "react";
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';

const CreateGameForm = function ({  }) {


    const [gameName, setGameName] = useState('');
    const [values, setValues] = useState({
        password: '',
        confirmPassword: '',
        showPassword: false,
    });

    const handleInputChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const handleShowPassword = (prop) => {
        setValues({ ...values, [prop]: !values[prop] });
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleContinue = () => {
        console.log("Game name: " + gameName, "\nPassword: " + values.password);
    }

    return (            
        <div style={{ display:'flex', height:'100%', width:'100%', justifyContent:'center', alignItems:'center'}} id='fondo'>
            <Paper style={{ display: 'flex', flexDirection: 'column', padding: 32, borderRadius:12 }} elevation={8} square >
                <b style={{ fontSize:40, textAlign:'center', marginBottom:20 }}>
                    New Game
                </b>
                <div id='inputs' style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
                    <TextField
                        value={gameName}
                        style={{ marginBottom: 40, minWidth:300 }}
                        onChange={(value) => setGameName(value.target.value)}
                        id="gameName"
                        size='small'
                        label="Game Name"
                        variant="outlined"
                    />
                    <FormControl size='small' variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-password"
                            type={values.showPassword ? 'text' : 'password'}
                            value={values.password}
                            style={{ marginBottom: 40, minWidth:300 }}
                            label = 'password'
                            onChange={handleInputChange('password')}
                            endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => handleShowPassword('showPassword')}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                                >
                                {values.showPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                            }
                        />
                    </FormControl>
                </div>
                <div style={{ display: 'flex', justifyContent:'center' }}>
                    <Button onClick={handleContinue} variant="outlined" color="primary" style={{ borderRadius:4, width:120 }}>
                        Continue
                    </Button>
                </div>
            </Paper>
        </div>
    );
}

export default CreateGameForm;

