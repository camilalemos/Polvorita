import React, { useState, useEffect } from "react";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useHistory } from "react-router-dom";
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import { withSnackbar } from 'notistack';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

const CreateGameForm = function ({ createGame, status, statusCode, open, onClose, enqueueSnackbar }) {

    const [gameName, setGameName] = useState('');
    const [playerName, setPlayerName] = useState('');
    const [gamePassword, setPassword] = useState('');
    const [playerNameError, setPlayerNameError] = useState(false);
    const [gameNameError, setGameNameError] = useState(false);
    const [gamePasswordError, setGamePasswordError] = useState(false);
    const history = useHistory();

    const notEmpty = () => {
        let result = true;
        if (gameName.length === 0  || playerName.length === 0){
            enqueueSnackbar( 'Required fields cannot be omitted', { variant: 'error'});
            result = false;
        }
        return result;
    }

    const handleContinue = () => {
        if (!gameName) {
            setGameNameError(true);
        }
        if (!playerName) {
            setPlayerNameError(true);
        }
        if (notEmpty()) {
            createGame({ playerName, gameName, gamePassword })
        }
    }

    const validated = (gameName, playerName, gamePassword) => {
        let isAllowed = true;
        const expression = /^([A-Z_a-z0-9])*$/
        const passwordexpression = /^[A-Za-z0-9]*$/
        
        if (!expression.test(String(gameName).toLowerCase())){
            setGameNameError(true);
            isAllowed = false;
        }
        if (!expression.test(String(playerName).toLowerCase())){
            setPlayerNameError(true);
            isAllowed = false;
        }
        if (!passwordexpression.test(String(gamePassword).toLowerCase())){
            setGamePasswordError(true);
            isAllowed = false;
        }
        return isAllowed
    }
    
    const hasWhiteSpace = (input) => {
        return input.indexOf(' ') >= 0;
    }

    const feedback422 = () =>{
        if ((!validated(gameName, playerName, gamePassword))){
            enqueueSnackbar( 'Special characters or white spaces are not allowed', { variant: 'error'});
        }
        if (gameName.length > 20 || gameName.length < 5){
            enqueueSnackbar( 'Game Name must have 5 to 20 characters', { variant: 'error'});
            setGameNameError(true);
        }
        if (playerName.length > 10 || playerName.length < 3){
            enqueueSnackbar( 'Player Name must have 3 to 10 characters', { variant: 'error'});
            setPlayerNameError(true);
        }
        if (!hasWhiteSpace(gamePassword) && gamePassword.length > 0 && (gamePassword.length > 10 || gamePassword.length < 5)){
            enqueueSnackbar( 'Password is optional, but if you want it, must have 5 to 10 characters', { variant: 'error'});
            setGamePasswordError(true);
        }
    }

    const checkStatusCode = () => {
        switch (statusCode) {
            case '422':
                feedback422();
                break;
            case '403':
                enqueueSnackbar('Game name already in use', { variant: 'error'});
                break;
            default:
                enqueueSnackbar('Something is going wrong, check your conection or try again later', { variant: 'error'});
                break;
        }
    }
    
    useEffect(() => {
        if (status === 'failed') {
            checkStatusCode();
        }
        if (status === 'success') { 
            history.push(`/lobby/${gameName}`);
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
            <a style={{ textAlign: 'center', fontSize:40,  marginBottom:60}} id="alert-dialog-slide-title">{"NEW GAME"}</a>
                <TextField
                    value={gameName}
                    required
                    error={gameNameError}
                    style={{ marginBottom: 40, minWidth:300 }}
                    onChange={(value) => (setGameName(value.target.value), setGameNameError(false))}
                    onKeyPress={(e) => {if (e.key === 'Enter') handleContinue()}}
                    id="gameName"
                    size='small'
                    label="Game Name"
                    variant="outlined"
                />
                <TextField
                    value={playerName}
                    required
                    error={playerNameError}
                    style={{ marginBottom: 40, minWidth:300 }}
                    onChange={(value) => (setPlayerName(value.target.value), setPlayerNameError(false))}
                    onKeyPress={(e) => {if (e.key === 'Enter') handleContinue()}}
                    id="playerName"
                    size='small'
                    label="Player Name"
                    variant="outlined"
                />
                <FormControl size='small' variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-password"
                        type='password'
                        value={gamePassword}
                        error={gamePasswordError}
                        style={{ marginBottom: 40, minWidth:300 }}
                        label = 'password'
                        onChange={(value) => setPassword(value.target.value, setGamePasswordError(false))}
                        onKeyPress={(e) => {if (e.key === 'Enter') handleContinue()}}
                    />
                </FormControl>
            
                <div style={{ display: 'flex', justifyContent:'center' }}>
                    {status === 'loading' ? 
                        <CircularProgress />
                    :
                    <div style={{ flexDirection:'row'}}>
                        <Button size='small' onClick={onClose} variant="outlined" color="primary" style={{ borderRadius:4, width:120 }}>
                            Cancel
                        </Button>
                        <Button size='small' onClick={handleContinue} variant="outlined" color="primary" style={{ borderRadius:4, width:120, marginLeft:20 }}>
                            Create
                        </Button>
                    </div>
                    }
                </div>
            </div>
        </Dialog>
        </div>  
    );
}

export default withSnackbar(CreateGameForm);
