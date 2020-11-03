import {
    LOGIN_USER,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_FAIL
} from '../../../constants/actionTypes/login';

import axios from 'axios';
import api from '../../../configs/api'


export const loginUser = (data) => (dispatch) => _loginUser(data, dispatch);
const _loginUser = async (data, dispatch) => {

    try {

        dispatch({type: LOGIN_USER});

        let bodyFormData = new FormData();
        bodyFormData.append('username', data.userNameOrEmail);
        bodyFormData.append('password', data.password);

        const response = await axios({
            method: 'POST',
            url: `${api.url}/token/`,
            data: bodyFormData,
            headers: { 'Content-Type':'multipart/form-data' }

        })

        {dispatch({type: LOGIN_USER_SUCCESS, payload : {access_token: response.data.access_token} })}
        
    } catch (error) {
    console.log(error, "ERROR")
        dispatch({type: LOGIN_USER_FAIL});
    }

};