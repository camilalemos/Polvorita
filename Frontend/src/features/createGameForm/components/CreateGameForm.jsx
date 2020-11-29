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
import Select from '@material-ui/core/Select';
import { withSnackbar } from 'notistack';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

const CreateGameForm = function ({ createGame, status, statusCode, open, onClose, enqueueSnackbar }) {

    const classes = useStyles();
    const [gameName, setGameName] = useState('');
    const [playerName, setPlayerName] = useState('');
    const [gamePassword, setPassword] = useState('');
    const [maxPlayers, setMaxPlayers] = useState('');
    const [playerNameError, setPlayerNameError] = useState(false);
    const [gameNameError, setGameNameError] = useState(false);
    const [gamePasswordError, setGamePasswordError] = useState(false);
    const [maxPlayersError, setMaxPlayersError] = useState(false);
    const history = useHistory();

    

    const notEmpty = () => {
        let result = true;
        if (gameName.length === 0  || playerName.length === 0 || maxPlayers.length === 0){
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
        if (!maxPlayers) {
            setMaxPlayersError(true);
        }
        if (notEmpty()) {
            createGame({ playerName, gameName, maxPlayers, gamePassword })
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
        if (playerName.length > 15 || playerName.length < 3){
            enqueueSnackbar( 'Player Name must have 3 to 15 characters', { variant: 'error'});
            setPlayerNameError(true);
        }
        if (!hasWhiteSpace(gamePassword) && gamePassword.length > 0 && (gamePassword.length > 10 || gamePassword.length < 5)){
            enqueueSnackbar( 'Password is optional, but if you want it, must have 5 to 10 characters', { variant: 'error'});
            setGamePasswordError(true);
        }
    }

    const createMaxPlayerOptions = () => {
        let menuItems = [];
        for (var i = 5; i <= 10; i++) {
            menuItems.push(<MenuItem value={i}>{i}</MenuItem>);
        }
        return menuItems;
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
        <Dialog
            open={open}
            id='prueba'
            className={classes.backgroundRoot}
            TransitionComponent={Transition}
            keepMounted
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
        >
            <div style={{ display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column', padding: 40}} id='fondo'>
                <a style={{ textAlign: 'center', fontSize:40,  marginBottom:60, color:'white'}} id="alert-dialog-slide-title">{"NEW GAME"}</a>
                <TextField
                    value={gameName}
                    required
                    error={gameNameError}
                    style={{ marginBottom: 40, minWidth:300 }}
                    onChange={(value) => (setGameName(value.target.value), setGameNameError(false))}
                    onKeyPress={(e) => {if (e.key === 'Enter') handleContinue()}}
                    id="gameName"
                    size='small'
                    color='secondary'
                    label="Game Name"
                    variant="outlined"
                    className={classes.inputRoot}
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
                    color='secondary'
                    label="Player Name"
                    variant="outlined"
                    className={classes.inputRoot}
                />
                <FormControl className={classes.inputRoot} size='small' variant="outlined">
                    <InputLabel color='secondary' htmlFor="outlined-adornment-password">Password</InputLabel>
                    <OutlinedInput
                        color='secondary'
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
                <FormControl variant="outlined" 
                    required
                    color='secondary'
                    error={maxPlayersError}
                    style={{ marginBottom: 40, minWidth:300 }}
                    size='small'
                    label="Max Players"
                    variant="outlined"
                    className={classes.inputRoot}
                    >
                    <InputLabel styles={{color:'white', backgroundColor:'white'}} id="Max Players">Max Players</InputLabel>
                    <Select
                        color='secondary'
                        labelId="Max Players"
                        id="Max Players"
                        value={maxPlayers}
                        onChange={(value) => setMaxPlayers(value.target.value, setMaxPlayersError(false))}
                        label="Max Players"
                        displayEmpty
                        size='small'
                        variant="outlined"
                    >
                    {createMaxPlayerOptions()}
                    </Select>
                </FormControl>
                <div style={{ display: 'flex', justifyContent:'center' }}>
                    {status === 'loading' ? 
                        <CircularProgress color='secondary'/>
                    :
                    <div style={{ flexDirection:'row'}}>
                        <Button size='small' onClick={onClose} variant="outlined" color='secondary' style={{ borderRadius:4, width:120 }}>
                            Cancel
                        </Button>
                        <Button size='small' onClick={handleContinue} variant="outlined" color='secondary' style={{ borderRadius:4, width:120, marginLeft:20 }}>
                            Create
                        </Button>
                    </div>
                    }
                </div>
            </div>
        </Dialog>
    );
}

export default withSnackbar(CreateGameForm);

const useStyles = makeStyles((theme) => ({
    backgroundRoot: {
        '& .MuiDialog-paper': {
            backgroundColor: 'dimgrey',
        }
    },
    inputRoot:{
        '& .MuiInputLabel-outlined': {
            color:'white'
        },
        '& .MuiOutlinedInput-input': {
            color:'white'
        }
    }
  }));
