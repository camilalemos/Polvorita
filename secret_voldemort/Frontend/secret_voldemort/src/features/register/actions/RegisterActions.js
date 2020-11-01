import {
    REGISTER_USER,
    REGISTER_USER_SUCCESS,
    REGISTER_USER_FAIL
} from '../../../constants/actionTypes/register';

import axios from 'axios';
import api from '../../../configs/api'


export const registerUser = (data) => (dispatch) => _registerUser(data, dispatch);
const _registerUser = async (data, dispatch) => {

    try {

        dispatch({type: REGISTER_USER});

        let bodyFormData = new FormData();
        bodyFormData.append('username', data.userName);
        bodyFormData.append('email', data.email);
        bodyFormData.append('fullname', data.fullName);
        bodyFormData.append('password', data.password);

        const response = await axios({
            method: 'post',
            url: `${api.url}/user/`,
            data: bodyFormData,
            headers: { 'Content-Type':'multipart/form-data' },
        });

        {dispatch({type: REGISTER_USER_SUCCESS})}
        
    } catch (error) {
    console.log(error, "ERROR");
        let requestError = error.message.split(' ');
        dispatch({type: REGISTER_USER_FAIL, payload: {statusCode: requestError[requestError.length -1]}});
    }

};