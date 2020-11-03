import {
     JOIN_GAME,
     JOIN_GAME_SUCCESS,
     JOIN_GAME_FAIL
 } from '../../../constants/actionTypes/joingame';

import axios from 'axios';
import api from '../../../configs/api';

export const joingame = (data) => (dispatch, getState) => _joingame(dispatch, getState, data);
const _joingame = async (dispatch, getState, data) => {

    try {
        dispatch({type: JOIN_GAME});

        let {access_token} = {...getState().login}
        
        let bodyFormData = new FormData()

        bodyFormData.append('game_name', data.gameName);
        bodyFormData.append('player_name', data.playerName);
        bodyFormData.append('password', data.gamePassword);

        const response = await axios({
            method: 'put',
            url: `${api.url}/game/`,
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