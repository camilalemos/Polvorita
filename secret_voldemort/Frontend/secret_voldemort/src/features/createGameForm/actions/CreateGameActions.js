import {
  CREATE_GAME,
  CREATE_GAME_FAIL,
  CREATE_GAME_SUCCESS
} from '../../../constants/actionTypes/createGame';
import axios from 'axios'
import api from '../../../configs/api'

export const createGame = (data) => (dispatch, getState) => _createGame(dispatch, getState, data);
const _createGame = async (dispatch, getState, data) => {

	try {
        dispatch({type: CREATE_GAME});
        
        let {access_token} = {...getState().login}
        
        let bodyFormData = new FormData();

        bodyFormData.append('game_name', data.gameName);
        bodyFormData.append('player_name', data.playerName);
        bodyFormData.append('password', data.gamePassword);

        const response = await axios({
            method: 'post',
            url: `${api.url}/game/`,
            data: bodyFormData,
            headers: { 
            'Content-Type':'multipart/form-data',
            "Authorization" : `Bearer ${access_token}`
            }
        });
		console.log(response, "RESPONSE");

        dispatch({type: CREATE_GAME_SUCCESS})
        
    } catch (error) {
        console.log(error, "ERROR")
        dispatch({type: CREATE_GAME_FAIL});
		
	}
};