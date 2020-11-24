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
      borderRight: '1px solid #e0e0e0'
  },
  messageArea: {
    height: '70vh',
    overflowY: 'auto'
  }
});

const Chat = function ({ gameInfo, sendMessage }) {
  
    const classes = useStyles();
    const [messages, setMessages] = useState(null)
    const [newMessage, setNewMessage] = useState('')
    const [currentPlayer, setCurrentPlayer] = useState(null)

    const handleSend = () => {
        console.log("SENDING " + newMessage)
    }

    useEffect(() => {
        setMessages(gameInfo.chat)
        //console.log("SETTING UP")
    },[gameInfo.chat])
    //if (messages !== undefined && messages !==null) console.log(messages[0] + " MESSAGES")
    
   // console.log(gameInfo.chat + " CHATINFO")


    return (
      <div>
        <Grid container>
            <Grid item xs={12} >
                <Typography variant="h5" className="header-message">Chat</Typography>
            </Grid>
        </Grid>
        <Grid container component={Paper} className={classes.chatSection}>
            <Grid item xs={3} className={classes.borderRight500}>
                <List>
                    <ListItem button key="RemySharp">
                        <ListItemText></ListItemText>
                    </ListItem>
                </List>
            </Grid>
            <Grid item xs={9}>
                <List className={classes.messageArea}>
                    <ListItem key="1">
                        <Grid container>
                            <Grid item xs={12}>
                                {messages !== undefined && messages !==null &&
                                <ListItemText align="right" primary={messages[0]}></ListItemText>
                                }
                            </Grid>
                        </Grid>
                    </ListItem>
                </List>
                <Grid container style={{padding: '20px'}}>
                    <Grid item xs={11}>
                        <TextField id="outlined-basic-email" label="Type Something" fullWidth 
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