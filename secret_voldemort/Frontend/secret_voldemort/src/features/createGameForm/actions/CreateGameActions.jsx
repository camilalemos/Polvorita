import {
  CREATE_GAME,
  CREATE_GAME_FAIL,
  CREATE_GAME_SUCCESS
} from '../../../constants/actionTypes/createGame';
import axios from 'axios'
import api from '../../../configs/api'

export const createGame = (data) => (dispatch) => _createGame(dispatch, data);
const _createGame = async (dispatch, data) => {

	try {
        dispatch({type: CREATE_GAME});
        
        let {acces_token} = {...getState().login}
        
        let bodyFormData = new FormData();
    
    
        bodyFormData.append('game_name', data.gameName);
        bodyFormData.append('player_name', data.playername);
        bodyFormData.append('password', data.gamePassword);

        const response = await axios({
            method: 'post',
            url: `${api.url}/game/`,
            data: bodyFormData,
            headers: { 
            'Content-Type':'multipart/form-data',
            "Authorization" : 'Bearer $(acces_tokenn)'
            }
        });
		console.log(response, "RESPONSE");

        dispatch({type: CREATE_GAME_SUCCESS})
        
    } catch (error) {
        console.log(error, "ERROR")
        dispatch({type: CREATE_GAME_FAIL});
		
	}
};