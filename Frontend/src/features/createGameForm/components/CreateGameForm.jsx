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

    const hasWhiteSpace = (gameName, playerName, password) => {
        let result = false;
        if (gameName.indexOf(' ') >= 0){
            setGameNameError(true);
            result = true;
        }
        if (playerName.indexOf(' ') >= 0) {
            setPlayerNameError(true);
            result = true;
        }
        if(password.indexOf(' ') >= 0) {
            setGamePasswordError(true);
            result = true;
        }
        return result;
    }

    const checkStatusCode = () => {
        if (statusCode === '422' && (gameName.length > 20 || gameName.length < 5)){
            enqueueSnackbar( 'Game Name must have 5 to 20 characters', { variant: 'error'});
            setGameNameError(true);
        }
        if (statusCode === '422' && (playerName.length > 10 || playerName.length < 3)){
            enqueueSnackbar( 'Player Name must have 3 to 10 characters', { variant: 'error'});
            setPlayerNameError(true);
        }
        if (statusCode === '422' && ( hasWhiteSpace(gameName, playerName, gamePassword))){
            enqueueSnackbar( 'White Space is not allowed', { variant: 'error'});
        }else{
            enqueueSnackbar( 'Special characters are not allowed', { variant: 'error'});
        }
        if (statusCode === '403'){
            enqueueSnackbar('Game name already in use', { variant: 'error'});
        } 
    }
    
    useEffect(() => {
        if (status === 'failed') {
            checkStatusCode();
        }
        if (status === 'success') { 
            history.push(gameName)
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
