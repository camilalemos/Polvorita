import {
    EXPELLIARMUS,
    EXPELLIARMUS_FAIL,
    EXPELLIARMUS_SUCCESS
} from '../../../constants/actionTypes/expelliarmus';

  import axios from 'axios'
  import api from '../../../configs/api'
 // /game/proclamations/expelliarmus/      minister_exp, player_name, game_name 
//ministerDesicion, playerName, gameName

export const expelliarmus = (ministerDesicion, playerName, gameName) => (dispatch, getState) => _expelliarmus(ministerDesicion, playerName, gameName, dispatch, getState);
const _expelliarmus = async (ministerDesicion, playerName, gameName, dispatch, getState) => {
	try {
        dispatch({type: EXPELLIARMUS});
        let {access_token} = {...getState().login}

        const response = await axios({
            method: 'put',
            url: `${api.url}/game/proclamations/expelliarmus/?&player_name=${playerName}&game_name=${gameName}`,
            headers: { 
            'Content-Type':'multipart/form-data',
            "Authorization" : `Bearer ${access_token}`
            }
        });
        
        dispatch({type:  EXPELLIARMUS_SUCCESS, payload: {userInfo:  response.data}})
    } catch (error) {
        console.log(error, "ERROR")
        
        if (error.response.status === 401) dispatch({type: EXPELLIARMUS_FAIL, payload: {errorMsg: error.response.data.detail }});
        if (error.response.status === 403) dispatch({type: EXPELLIARMUS_FAIL, payload: {errorMsg: error.response.data.detail }});
        if (error.response.status === 422) dispatch({type: EXPELLIARMUS_FAIL, payload: {errorMsg: error.response.data.detail[0].msg }});	
	}
};