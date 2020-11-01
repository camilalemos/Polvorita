import {
     JOIN_GAME_REQUEST,
     JOIN_GAME_SUCCESS,
     JOIN_GAME_ERROR
 } from '../../../constants/actionTypes/joingame';

//import axios from 'axios';
//import { API_BASE } from './config';

export function joinGameRequest(){
    return {
        type: JOIN_GAME_REQUEST
    }
}

export function joinGameSuccess(payload){
    return {
        type: JOIN_GAME_SUCCESS,
        payload
    }
}

export function joinGameError(error){
    return {
        type: JOIN_GAME_ERROR,
        error
    }
}

export const joingame = () => (dispatch) => _joingame(dispatch);
const _joingame = async (dispatch) => {

    try {
 //       const res = await axios.get(`${API_BASE}/game/${gameId}`)
  //      dispatch({type: joinGameSuccess(response.data)
        
    } catch (error){
        dispatch({
            type: joinGameError(error)
        });
    }
};