import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Fab from '@material-ui/core/Fab';
import SendIcon from '@material-ui/icons/Send';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  chatSection: {
    width: '100%',
    height: '80vh'
  },
  headBG: {
      backgroundColor: '#e0e0e0'
  },
  borderRight500: {
      borderRight: '1px solid #e0e0e0',
      
  },
  messageArea: {
    width: '100%',
    height: '70vh',
    overflowY: 'auto'
  }
});

const Chat = function ({ gameInfo, user, sendMessage, status, errorMsg}) {
  
    const [players, setPlayers] = useState([]);
    const classes = useStyles();
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState('')
    const [currentPlayer, setCurrentPlayer] = useState(null)
    const [admin, setAdmin] = useState('admin1')
    const [juego, setJuego] = useState('juego')
    const [remiter, setRemiter] = useState('')

    const handleSend = () => {
        console.log("SENDING " + newMessage)
        if(currentPlayer && gameInfo){
            sendMessage( currentPlayer.name, gameInfo.name, newMessage )
        }
    }

    useEffect(() => {
        if (gameInfo.length !==0 ) {
            setPlayers(Object.values(gameInfo.players));
        }
    }, [gameInfo, setPlayers])

    useEffect(() => {
        if (gameInfo.length !== 0) {
            setCurrentPlayer(players.filter(player => player.user_name === user.username)[0]);
        }
    }, [user, currentPlayer, players])


    useEffect(() => {
        setMessages(gameInfo.chat)
        //console.log("SETTING UP")
    },[gameInfo.chat])

    useEffect(() => {
        if (status === 'failed') console.log(errorMsg)
        if(status === 'success') setNewMessage('')
    },[status])
    //if (messages !== undefined && messages !==null) console.log(messages[0] + " MESSAGES")
    
    //console.log(gameInfo.chat + " CHATINFO")
   
    const splitMessage = (message, type) => {
        let result =  message.split(':')
        if (type === 'sender') {   
            result =  message.split(':')
            result = result[0]
        }
        else {
            result =  message.split(':')
            result = result[1]
        }
        return result
    }

    return (
      <div>
        <Grid container>
            <Grid item xs={12} >
                <Typography variant="h5" className="header-message">Chat</Typography>
            </Grid>
        </Grid>
        <Grid container component={Paper} className={classes.chatSection}>
            <Grid item xs={9}>
                <List className={classes.messageArea}>
                    <ListItem key="Message">
                        <Grid container>
                            <Grid item xs={12}>
                                {messages !== undefined && messages.map((message)=> (
                                     <ListItemText align="right" primary={message}></ListItemText>
                                ))}
                            </Grid>
                        </Grid>
                    </ListItem>
                </List>
                <Grid container style={{padding: '20px'}}>
                    <Grid item xs={11}>
                        <TextField id="outlined-basic-email" label="Type Something" fullWidth 
                            value={newMessage}
                            id="New Message" 
                            onChange={(value) => (setNewMessage(value.target.value))}
                            onKeyPress={(e) => {if (e.key === 'Enter') handleSend()}}
                        />
                    </Grid>
                    <Grid xs={1} align="right">
                        <Fab color="primary" aria-label="add"><SendIcon onClick={handleSend}/></Fab>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
      </div>
  );
}

export default Chat;