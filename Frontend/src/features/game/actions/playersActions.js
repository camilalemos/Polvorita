import {
    SELECT_CANDIDATE,
    SELECT_CANDIDATE_SUCCESS,
    SELECT_CANDIDATE_FAIL
} from '../../../constants/actionTypes/playersActions';
import axios from 'axios';
import api from '../../../configs/api';

export const selectDirector = ( candidateName, playerName, gameName) => (dispatch, getState) => _selectDirector(candidateName, playerName, gameName, dispatch, getState);
const _selectDirector = async ( candidateName, playerName, gameName, dispatch, getState) => {

    try {
        console.log(candidateName, playerName, gameName, "DATOS" )
        dispatch({type: SELECT_CANDIDATE});

        let {access_token} = {...getState().login}

        const response = await axios({
            method: 'put',
            url: `${api.url}/game/elections/nominate?candidate_name=${candidateName}&player_name=${playerName}&game_name=${gameName}`,
            headers: { 
            'Content-Type':'multipart/form-data',
            "Authorization" : `Bearer ${access_token}`
            }
        });

        console.log(response, "RESPONSE")

        dispatch({type: SELECT_CANDIDATE_SUCCESS})
        
    } catch (error){
        console.log(error, "ERROR")
        dispatch({type: SELECT_CANDIDATE_FAIL});
    }
};