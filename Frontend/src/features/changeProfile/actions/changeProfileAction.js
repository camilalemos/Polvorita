import {
    GET_PROFILE_INFO,
    GET_PROFILE_INFO_FAIL,
    GET_PROFILE_INFO_SUCCESS
} from '../../../constants/actionTypes/changeProfile';

  import axios from 'axios'
  import api from '../../../configs/api'


export const getUserInfo = (data) => (dispatch, getState) => _getUserInfo(data, dispatch, getState);
const _getUserInfo = async (data, dispatch, getState) => {
	try {
        dispatch({type: GET_PROFILE_INFO});
        
        let {access_token} = {...getState().login}
        
        let bodyFormData = new FormData();
        console.log("PASSWORD ANTES DEL IF" + data.password) 
        console.log("FULLNAME ANTES DEL IF" + data.fullName) 
        if (data.password === undefined){
            bodyFormData.append('password', data.password);
            console.log("PASSWORD INDEFINIDA: " + data.password) 
        }
        else{
            console.log("PASSWORD: " + data.password) 
            bodyFormData.append('username',data.userName);
            bodyFormData.append('email',data.email);
            bodyFormData.append('new_password',data.newPassword);
            bodyFormData.append('password', data.password);
            bodyFormData.append('full_name',data.fullName);                       
        }

        const response = await axios({
            method: 'put',
            url: `${api.url}/user/`,
            data: bodyFormData,
            headers: { 
            'Content-Type':'multipart/form-data',
            "Authorization" : `Bearer ${access_token}`
            }
	    	});
        dispatch({type:  GET_PROFILE_INFO_SUCCESS, payload: {userInfo:  response.data}})
    } catch (error) {
        console.log(error, "ERROR")
        console.log("PASSWORD ERROR" + data.password) 
        let requestError = error.message.split(' ');
        dispatch({type:  GET_PROFILE_INFO_FAIL, payload: {statusCode: requestError[requestError.length -1]}});	
	}
};