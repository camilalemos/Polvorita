import {
    QUIT_GAME,
    QUIT_GAME_FAIL,
	QUIT_GAME_SUCCESS,
} from '../../../constants/actionTypes/quitGame';
import axios from 'axios';
import api from '../../../configs/api';

export const quitGame = ( gameName, playerName) => (dispatch, getState) => _quitGame( gameName, playerName, dispatch, getState);
const _quitGame = async ( gameName, playerName, dispatch, getState) => {

    try {

        dispatch({type: QUIT_GAME});

        let {access_token} = {...getState().login}

        await axios({
            method: 'delete',
            url: `${api.url}/game/?player_name=${playerName}&game_name=${gameName}`,
            headers: { 
            'Content-Type':'multipart/form-data',
            "Authorization" : `Bearer ${access_token}`
            }
        });

        console.log(response.data , "RESPONSE");
        dispatch({type: QUIT_GAME_SUCCESS})
        
    } catch (error){
        console.log(error, "ERROR")
        dispatch({type: QUIT_GAME_FAIL});
    }
};