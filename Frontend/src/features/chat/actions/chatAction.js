import {
    SEND_MESSAGE,
    SEND_MESSAGE_FAIL,
    SEND_MESSAGE_SUCCESS
} from '../../../constants/actionTypes/chat';

  import axios from 'axios'
  import api from '../../../configs/api'

  export const sendMessage = (message, playerName, gameName) => (dispatch, getState) => _sendMessage(message, playerName, gameName, dispatch, getState);
  const _sendMessage = async (message, playerName, gameName, dispatch, getState) => {
  
    try {

        dispatch({type:  SEND_MESSAGE});

        let {access_token} = {...getState().login}
        console.log(`${api.url}/game/chat?player_name=${playerName}&game_name=${gameName}`, "URL");

        const response = await axios({
            method: 'put',
            url: `${api.url}/game/chat?player_name=${playerName}&game_name=${gameName}`,
            headers: { 
            'Content-Type':'multipart/form-data',
            "Authorization" : `Bearer ${access_token}`
            }
        });

        dispatch({type: SEND_MESSAGE_SUCCESS})
        
    } catch (error){
        console.log(error, "ERROR")
        dispatch({type: SEND_MESSAGE_FAIL});
    }
};