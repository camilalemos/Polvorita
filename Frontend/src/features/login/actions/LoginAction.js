import {
    LOGIN_USER,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_FAIL,
    GET_USER_SUCCESS,
    GET_USER_FAIL
} from '../../../constants/actionTypes/login';

import axios from 'axios';
import api from '../../../configs/api'

const PROFILE_KEY = 'profile_v1';

export const loginUser = (data) => (dispatch) => _loginUser(data, dispatch);
const _loginUser = async (data, dispatch) => {

    try {

        dispatch({type: LOGIN_USER});

        let bodyFormData = new FormData();
        bodyFormData.append('username', data.userNameOrEmail);
        bodyFormData.append('password', data.password);

        const response = await axios({
            method: 'POST',
            url: `${api.url}/login/`,
            data: bodyFormData,
            headers: { 'Content-Type':'multipart/form-data' }

        })

        let payload = {access_token: response.data.access_token}

        localStorage.setItem(PROFILE_KEY, JSON.stringify(payload));

        {dispatch({type: LOGIN_USER_SUCCESS, payload })}
        
    } catch (error) {
    console.log(error, "ERROR")
        dispatch({type: LOGIN_USER_FAIL});
    }

};

export const getUserData = () => (dispatch, getState) => _getUserData(dispatch, getState);
const _getUserData = async (dispatch, getState) => {

    try {

        let profile = await localStorage.getItem(PROFILE_KEY);

        if (!profile) throw new Error('User does not exist');

        let { access_token } = JSON.parse(profile);

        let payload = {access_token}

        localStorage.setItem(PROFILE_KEY, JSON.stringify(payload));

        {dispatch({type: GET_USER_SUCCESS, payload })};


    } catch (error) {
console.log(error, 'Error in USER DATA');
    dispatch({type: GET_USER_FAIL});

    }

};