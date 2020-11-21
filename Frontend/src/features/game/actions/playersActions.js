import {
    SELECT_CANDIDATE,
    SELECT_CANDIDATE_SUCCESS,
    SELECT_CANDIDATE_FAIL,
    VOTE,
    VOTE_SUCCESS,
    VOTE_FAIL,
    GET_RESULTS,
    GET_RESULTS_SUCCESS,
    GET_RESULTS_FAIL,
    PUT_RESULTS,
    PUT_RESULTS_SUCCESS,
    PUT_RESULTS_FAIL
} from '../../../constants/actionTypes/playersActions';
import axios from 'axios';
import api from '../../../configs/api';

export const selectDirector = ( candidateName, playerName, gameName) => (dispatch, getState) => _selectDirector(candidateName, playerName, gameName, dispatch, getState);
const _selectDirector = async ( candidateName, playerName, gameName, dispatch, getState) => {

    try {

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

        dispatch({type: SELECT_CANDIDATE_SUCCESS})
        
    } catch (error){
        console.log(error, "ERROR")
        dispatch({type: SELECT_CANDIDATE_FAIL});
    }
};

export const vote = ( vote, playerName, gameName) => (dispatch, getState) => _vote(vote, playerName, gameName, dispatch, getState);
const _vote = async ( vote, playerName, gameName, dispatch, getState) => {

    try {

        dispatch({type: VOTE});

        let {access_token} = {...getState().login}
        console.log(`${api.url}/game/elections/vote?vote=${vote}&player_name=${playerName}&game_name=${gameName}`, "URL");

        const response = await axios({
            method: 'put',
            url: `${api.url}/game/elections/vote?vote=${vote}&player_name=${playerName}&game_name=${gameName}`,
            headers: { 
            'Content-Type':'multipart/form-data',
            "Authorization" : `Bearer ${access_token}`
            }
        });

        dispatch({type: VOTE_SUCCESS})
        
    } catch (error){
        console.log(error, "ERROR")
        dispatch({type: VOTE_FAIL});
    }
};

export const getResults = (gameName) => (dispatch, getState) => _getResults(gameName, dispatch, getState);
const _getResults = async (gameName, dispatch, getState) => {

    try {

        dispatch({type: GET_RESULTS});

        let {access_token} = {...getState().login}

        const response = await axios({
            method: 'get',
            url: `${api.url}/game/elections/result?game_name=${gameName}`,
            headers: { 
            'Content-Type':'multipart/form-data',
            "Authorization" : `Bearer ${access_token}`
            }
        });
        console.log(response , "RESPONSE");
        dispatch({type: GET_RESULTS_SUCCESS, payload: {results: response.data}})
        
    } catch (error){
        console.log(error, "ERROR")
        dispatch({type: GET_RESULTS_FAIL});
    }
};

export const putResults = (gameName) => (dispatch, getState) => _putResults(gameName, dispatch, getState);
const _putResults = async (gameName, dispatch, getState) => {

    try {

        dispatch({type: PUT_RESULTS});

        let {access_token} = {...getState().login}

        const response = await axios({
            method: 'put',
            url: `${api.url}/game/elections/result?game_name=${gameName}`,
            headers: { 
            'Content-Type':'multipart/form-data',
            "Authorization" : `Bearer ${access_token}`
            }
        });

        dispatch({type: PUT_RESULTS_SUCCESS})
        
    } catch (error){
        console.log(error, "ERROR")
        dispatch({type: PUT_RESULTS_FAIL});
    }
};