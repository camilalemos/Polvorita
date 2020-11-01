
import React,{useEffect,useState} from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import LockIcon from '@material-ui/icons/Lock';
//import axios from 'axios';

//import { socket } from 'socketUtil.js';
import { useDispatch } from 'react-redux';

function ChatRoomComponent(){
    const distpatch = useDispatch();

}

export default function GameList({}) {

    const [gameName, setGameName] = useState('');
    //const [userName, setUserName] = useState('');
    //const [password, setPassword] = useState('');
    
   /* useEffect(() => {
        axios.get('https://restcountries.eu/rest/v2/all')
        .then(res => {
            setGameName(res.data);
            setFormShowPassword(true);
        })
        .catch(err => {
            setPassword(err.message);
            setFormShowPassword(true);
        })
    }, []) */
    
    return (
        <div>
        <h2>Partidas</h2>
        <List component="nav" className='asd' aria-label="contacts">
        <ListItem disableGutters>
            <ListItemText primary="Chelsea Otakan" />
            <ListItemText primary="number players: " />
            <ListItemIcon>
                <LockIcon/>
            </ListItemIcon>
            <Button variant="contained" >Join Game</Button>
        </ListItem>
        </List>
    </div>
    );
}




