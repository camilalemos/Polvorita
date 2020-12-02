import {
    LOGIN_USER,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_FAIL,
    GET_USER,
    GET_USER_SUCCESS,
    GET_USER_FAIL,
    USER_DATA,
    LOGOUT_USER
} from '../../../constants/actionTypes/login';

import axios from 'axios';
import api from '../../../configs/api'

const PROFILE_KEY = 'profile_v1';

export const loginUser = (data) => (dispatch) => _loginUser(data, dispatch);
const _loginUser = async (data, dispatch) => {

    try {

        dispatch({ type: LOGIN_USER });

        let bodyFormData = new FormData();
        bodyFormData.append('username', data.userNameOrEmail);
        bodyFormData.append('password', data.password);

        const response = await axios({
            method: 'POST',
            url: `${api.url}/login/`,
            data: bodyFormData,
            headers: { 'Content-Type': 'multipart/form-data' }

        })

        let payload = { access_token: response.data.access_token }

        localStorage.setItem(PROFILE_KEY, JSON.stringify(payload));

        { dispatch({ type: LOGIN_USER_SUCCESS, payload }) }

    } catch (error) {
        console.log(error, "ERROR")
        dispatch({ type: LOGIN_USER_FAIL });
    }
};

export const getUserData = () => (dispatch, getState) => _getUserData(dispatch, getState);
const _getUserData = async (dispatch, getState) => {

    try {

        dispatch({ type: GET_USER })

        let profile = await localStorage.getItem(PROFILE_KEY);

        if (!profile) throw new Error('User does not exist');

        let { access_token } = JSON.parse(profile);

        let payload = { access_token }

        localStorage.setItem(PROFILE_KEY, JSON.stringify(payload));

        dispatch({ type: GET_USER_SUCCESS, payload })


    } catch (error) {
        console.log(error, 'Error in USER DATA');
        dispatch({ type: GET_USER_FAIL });

    }
};

export const getLoginData = () => (dispatch, getState) => _getLoginData(dispatch, getState);
const _getLoginData = async (dispatch, getState) => {

    try {
        let { access_token } = { ...getState().login }

        let bodyFormData = new FormData();
        bodyFormData.append('email', "");
        bodyFormData.append('username', "");
        bodyFormData.append('full_name', "");
        bodyFormData.append('new_password', "");
        bodyFormData.append('password', " ");

        const response = await axios({
            method: 'PUT',
            url: `${api.url}/user/`,
            data: bodyFormData,
            headers: {
                'Content-Type': 'multipart/form-data',
                "Authorization": `Bearer ${access_token}`
            }
        })

        { dispatch({ type: USER_DATA, payload: { user: response.data } }) }

    } catch (error) {
        console.log(error, "ERROR")
    }
};

export const logout = () => (dispatch) => _logout(dispatch);
const _logout = (dispatch) => {
    localStorage.removeItem(PROFILE_KEY);
    dispatch({ type: LOGOUT_USER })
};
