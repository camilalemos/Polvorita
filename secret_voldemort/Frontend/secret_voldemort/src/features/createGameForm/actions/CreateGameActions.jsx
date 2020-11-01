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
		
		let bodyFormData = new FormData();
		
		bodyFormData.append('gamename', data.gameName);
        bodyFormData.append('password', data.password);

        const response = await axios({
            method: 'post',
            url: `${api.url}/game/`,
            data: bodyFormData,
            headers: { 'Content-Type':'multipart/form-data' },
        });
		console.log(response, "RESPONSE");

        dispatch({type: CREATE_GAME_SUCCESS})
        
    } catch (error) {
    	let requestError = error.message.split(' ');
        dispatch({type: CREATE_GAME_FAIL, payload: {statusCode: requestError[requestError.length -1]}});
		
	}
};