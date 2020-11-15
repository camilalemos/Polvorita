import {
     JOIN_GAME,
     JOIN_GAME_SUCCESS,
     JOIN_GAME_FAIL
 } from '../../../constants/actionTypes/joingame';

import axios from 'axios';
import api from '../../../configs/api';

export const joingame = (gameName, playerName, gamePassword) => (dispatch, getState) => _joingame(gameName, playerName, gamePassword, dispatch, getState);
const _joingame = async (gameName, playerName, gamePassword, dispatch, getState) => {

    try {
        console.log(gameName, playerName, gamePassword, "LOG")
        dispatch({type: JOIN_GAME});

        let {access_token} = {...getState().login}
        
        let bodyFormData = new FormData()
        
        bodyFormData.append('player_name', playerName);
        bodyFormData.append('password', gamePassword);

        const response = await axios({
            method: 'put',
            url: `${api.url}/game?game_name=${gameName}`,
            data: bodyFormData,
            headers: { 
            'Content-Type':'multipart/form-data',
            "Authorization" : `Bearer ${access_token}`
            }
        });
		console.log(response, "RESPONSE");

        dispatch({type: JOIN_GAME_SUCCESS})
        
    } catch (error){
        console.log(error, "ERROR")
        dispatch({type: JOIN_GAME_FAIL});
    }
};