import {
    ENACT_PROCLAMATION,
    ENACT_PROCLAMATION_FAIL,
    ENACT_PROCLAMATION_SUCCESS,
    GET_PROCLAMATIONS,
    GET_PROCLAMATIONS_FAIL,
    GET_PROCLAMATIONS_SUCCESS
} from '../../../constants/actionTypes/enactproclamation';
import axios from 'axios';
import api from '../../../configs/api';

export const enacproclamation = ( loyalty, playerName, gameName) => (dispatch, getState) => _enacproclamation(loyalty, playerName, gameName, dispatch, getState);
const _enacproclamation = async ( loyalty, playerName, gameName, dispatch, getState) => {

    try {

        dispatch({type: ENACT_PROCLAMATION});

        let {access_token} = {...getState().login}
        
        let bodyFormData = new FormData()
        
        bodyFormData.append('loyalty', loyalty); //Enviar como query
        bodyFormData.append('player_name', playerName); //Enviar como query

        const response = await axios({
            method: 'put',
            url: `${api.url}/game/proclamations/enact?game_name=${gameName}`,
            data: bodyFormData,
            headers: { 
            'Content-Type':'multipart/form-data',
            "Authorization" : `Bearer ${access_token}`
            }
        });

        dispatch({type: ENACT_PROCLAMATION_SUCCESS})
        
    } catch (error){
        console.log(error, "ERROR")
        dispatch({type: ENACT_PROCLAMATION_FAIL});
    }
};

export const getProclamationsInfo = (playerName, gameName) => (dispatch, getState) => _getProclamationsInfo(playerName, gameName, dispatch, getState);
const _getProclamationsInfo = async (playerName, gameName, dispatch, getState) => {
	try {
        dispatch({type: GET_PROCLAMATIONS});
        
        let {access_token} = {...getState().login}
        
        let bodyFormData = new FormData();

            bodyFormData.append('¨Player Name', playerName) //Enviar como query       

        const response = await axios({
            method: 'get',
            url: `${api.url}/game/proclamations/?game_name=${gameName}`,
            data: bodyFormData,
            headers: { 
            'Content-Type':'multipart/form-data',
            "Authorization" : `Bearer ${access_token}`
            }
        });
        dispatch({type:  GET_PROCLAMATIONS_SUCCESS, payload: {userInfo:  response.data}})
    } catch (error) {
        console.log(error, "ERROR")
        
        if (error.response.status === 401) dispatch({type: GET_PROCLAMATIONS_FAIL, payload: {errorMsg: error.response.data.detail }});
        if (error.response.status === 403) dispatch({type: GET_PROCLAMATIONS_FAIL, payload: {errorMsg: error.response.data.detail }});
        if (error.response.status === 422) dispatch({type: GET_PROCLAMATIONS_FAIL, payload: {errorMsg: error.response.data.detail[0].msg }});	
	}
};