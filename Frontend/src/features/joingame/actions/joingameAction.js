import {
    JOIN_GAME,
    JOIN_GAME_SUCCESS,
    JOIN_GAME_FAIL,
    START_GAME,
    START_GAME_SUCCESS,
    START_GAME_FAIL,
    RECCONECT_GAME_SUCCESS
} from '../../../constants/actionTypes/joingame';
import axios from 'axios';
import api from '../../../configs/api';

export const joingame = (gameName, playerName, gamePassword) => (dispatch, getState) => _joingame(gameName, playerName, gamePassword, dispatch, getState);
const _joingame = async (gameName, playerName, gamePassword, dispatch, getState) => {

    try {

        dispatch({ type: JOIN_GAME });

        let { access_token } = { ...getState().login }

        let bodyFormData = new FormData()

        bodyFormData.append('player_name', playerName);
        bodyFormData.append('password', gamePassword);

        await axios({
            method: 'put',
            url: `${api.url}/game/?game_name=${gameName}`,
            data: bodyFormData,
            headers: {
                'Content-Type': 'multipart/form-data',
                "Authorization": `Bearer ${access_token}`
            }
        });

        dispatch({ type: JOIN_GAME_SUCCESS })

    } catch (error) {
        console.log(error, "ERROR")
        if (error.response.status === 401) dispatch({ type: JOIN_GAME_FAIL, payload: { errorMsg: error.response.data.detail } });
        if (error.response.status === 403) dispatch({ type: JOIN_GAME_FAIL, payload: { errorMsg: error.response.data.detail } });
    }
};

export const startGame = (gameName) => (dispatch, getState) => _startGame(gameName, dispatch, getState);
const _startGame = async (gameName, dispatch, getState) => {

    try {

        dispatch({ type: START_GAME });

        let { access_token } = { ...getState().login }

        await axios({
            method: 'put',
            url: `${api.url}/game/start/?game_name=${gameName}`,
            headers: {
                'Content-Type': 'multipart/form-data',
                "Authorization": `Bearer ${access_token}`
            }
        });

        dispatch({ type: START_GAME_SUCCESS })

    } catch (error) {
        console.log(error, "ERROR")
        dispatch({ type: START_GAME_FAIL });
    }
};

export const reconnectGame = (gameName) => (dispatch, getState) => _reconnectGame(gameName, dispatch, getState);
const _reconnectGame = async (gameName, dispatch, getState) => {

    try {

        let { access_token } = { ...getState().login }

        const response =await axios({
            method: 'get',
            url: `${api.url}/game/?own=true`,
            headers: {
                'Content-Type': 'multipart/form-data',
                "Authorization": `Bearer ${access_token}`
            }
        });
        console.log(response, "RESPONSE");
        dispatch({ type: RECCONECT_GAME_SUCCESS, payload :  {reconnectGame: response.data }});

    } catch (error) {
        console.log(error, "ERROR")
    }
};
