import React, { useState, useEffect } from "react";
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import CircularProgress from '@material-ui/core/CircularProgress';

const CreateGameForm = function ({ createGame, status }) {


    const [gameName, setGameName] = useState('');
    const [gamePassword, setPassword] = useState('');
    const [errorGameName, setGameNameError] = useState(false);

    const checkInput = () => {
        if (gameName === '') {
            setGameNameError(true);
        }
    }

    const handleContinue = () => {
        checkInput();
        console.log("Game name: " + gameName, "\nPassword: " + gamePassword);
        createGame({ gameName, gamePassword })
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
                        required
                        error={errorGameName}
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
                            type={'text'}
                            value={gamePassword}
                            style={{ marginBottom: 40, minWidth:300 }}
                            label = 'password'
                            onChange={(value) => setPassword(value.target.value)}
                        />
                    </FormControl>
                </div>
                <div style={{ display: 'flex', justifyContent:'center' }}>
                    {status === 'loading' ? 
                        <CircularProgress />
                    :
                    <Button onClick={handleContinue} variant="outlined" color="primary" style={{ borderRadius:4, width:120 }}>
                    Continue
                    </Button>
                    }
                </div>
            </Paper>
        </div>
    );
}

export default CreateGameForm;

