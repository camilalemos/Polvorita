import {
    SEND_MESSAGE,
    SEND_MESSAGE_FAIL,
    SEND_MESSAGE_SUCCESS
} from '../../../constants/actionTypes/chat';

  import axios from 'axios'
  import api from '../../../configs/api'

  export const sendMessage = (playerName, gameName, message) => (dispatch, getState) => _sendMessage(playerName, gameName, message, dispatch, getState);
  const _sendMessage = async (playerName, gameName, message, dispatch, getState) => {
  
    try {

        dispatch({type:  SEND_MESSAGE});

        let {access_token} = {...getState().login}
        console.log(`${api.url}/game/chat/?player_name=${playerName}&game_name=${gameName}`, "URL");
        console.log(message, "MESSAGE")

        let bodyFormData = new FormData();

        bodyFormData.append('msg', message);

        await axios({
            method: 'post',
            url: `${api.url}/game/chat/?player_name=${playerName}&game_name=${gameName}`,
            data: bodyFormData,
            headers: { 
            'Content-Type':'multipart/form-data',
            "Authorization" : `Bearer ${access_token}`
            }
        });

        dispatch({type: SEND_MESSAGE_SUCCESS})
        
    } catch (error){
        console.log(error, "ERROR")
        if (error.response.status === 401) dispatch({type: SEND_MESSAGE_FAIL, payload: {errorMsg: error.response.data.detail }});
        if (error.response.status === 403) dispatch({type: SEND_MESSAGE_FAIL, payload: {errorMsg: error.response.data.detail }});
        if (error.response.status === 400) dispatch({type: SEND_MESSAGE_FAIL, payload: {errorMsg: error.response.data.detail }});
        if (error.response.status === 422) dispatch({type: SEND_MESSAGE_FAIL, payload: {errorMsg: error.response.data.detail[0].msg }});
    }
};