import {
    GET_PROCLAMATIONS,
    GET_PROCLAMATIONS_FAIL,
    GET_PROCLAMATIONS_SUCCESS,
    DISCARD_PROCLAMATION,
    DISCARD_PROCLAMATION_FAIL,
    DISCARD_PROCLAMATION_SUCCESS,
} from '../../../constants/actionTypes/enactproclamation';
import axios from 'axios';
import api from '../../../configs/api';

export const getProclamationsInfo = (playerName, gameName) => (dispatch, getState) => _getProclamationsInfo(playerName, gameName, dispatch, getState);
const _getProclamationsInfo = async (playerName, gameName, dispatch, getState) => {

	try {
        dispatch({type: GET_PROCLAMATIONS});
        
        let {access_token} = {...getState().login}

        const response = await axios({
            method: 'get',
            url: `${api.url}/game/proclamations/?game_name=${gameName}&player_name=${playerName}`,
            headers: { 
            'Content-Type':'multipart/form-data',
            "Authorization" : `Bearer ${access_token}`
            }
        });
        dispatch({type:  GET_PROCLAMATIONS_SUCCESS, payload: {proclamationsInfo:  response.data}})
    } catch (error) {
        console.log(error, "ERROR")
        dispatch({type: GET_PROCLAMATIONS_FAIL});
	}
};

export const discardproclamation = ( loyalty, playerName, gameName) => (dispatch, getState) => _discardproclamation(loyalty, playerName, gameName, dispatch, getState);
const _discardproclamation = async ( loyalty, playerName, gameName, dispatch, getState) => {

    try {

        dispatch({type: DISCARD_PROCLAMATION});

        let {access_token} = {...getState().login}
        
        const response = await axios({
            method: 'put',
            url: `${api.url}/game/proclamations/discard/?game_name=${gameName}&player_name=${playerName}&loyalty=${loyalty}`,
            headers: { 
            'Content-Type':'multipart/form-data',
            "Authorization" : `Bearer ${access_token}`
            }
        });

        dispatch({type: DISCARD_PROCLAMATION_SUCCESS})
        
    } catch (error){
        console.log(error, "ERROR")
        dispatch({type: DISCARD_PROCLAMATION_FAIL});
    }
};
