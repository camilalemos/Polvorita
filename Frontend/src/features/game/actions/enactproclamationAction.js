import {
    ENACT_PROCLAMATION,
    ENACT_PROCLAMATION_FAIL,
    ENACT_PROCLAMATION_SUCCESS
} from '../../../constants/actionTypes/enactproclamation';
import axios from 'axios';
import api from '../../../configs/api';

export const joingame = ( loyalty, playerName, gameName) => (dispatch, getState) => _joingame(loyalty, playerName, gameName, dispatch, getState);
const _joingame = async ( loyalty, playerName, gameName, dispatch, getState) => {

    try {

        dispatch({type: ENACT_PROCLAMATION});

        let {access_token} = {...getState().login}
        
        let bodyFormData = new FormData()
        
        bodyFormData.append('loyalty', loyalty);
        bodyFormData.append('player_name', playerName);

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