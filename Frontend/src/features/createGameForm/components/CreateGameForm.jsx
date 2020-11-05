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

const CreateGameForm = function ({ createGame, status, open, onClose, enqueueSnackbar }) {

    const [gameName, setGameName] = useState('');
    const [playerName, setPlayerName] = useState('');
    const [gamePassword, setPassword] = useState('');
    const [PlayerOrGameNameError, setPlayerOrGameNameError] = useState(false);
    const history = useHistory();


    const handleContinue = () => {
        if (!gameName || !playerName) {
            setPlayerOrGameNameError(true);
        }else{
            createGame({ playerName, gameName, gamePassword })
        }
	} 
    
    useEffect(() => {
        if (status === 'failed') enqueueSnackbar('Game name is already in use', { variant: 'error'});
        if (status === 'success') history.push(gameName)
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
                    error={PlayerOrGameNameError}
                    style={{ marginBottom: 40, minWidth:300 }}
                    onChange={(value) => setGameName(value.target.value)}
                    id="gameName"
                    size='small'
                    label="Game Name"
                    variant="outlined"
                />
                <TextField
                    value={playerName}
                    required
                    error={PlayerOrGameNameError}
                    style={{ marginBottom: 40, minWidth:300 }}
                    onChange={(value) => setPlayerName(value.target.value)}
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
                        style={{ marginBottom: 40, minWidth:300 }}
                        label = 'password'
                        onChange={(value) => setPassword(value.target.value)}
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
