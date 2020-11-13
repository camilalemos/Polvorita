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
        
      
        bodyFormData.append('password', data.password);
        

        const response = await axios({
            method: 'put',
            url: `${api.url}/user/`,
            data: bodyFormData,
            headers: { 
            'Content-Type':'multipart/form-data',
            "Authorization" : `Bearer ${access_token}`
            }
	    	});
        dispatch({type:  GET_PROFILE_INFO_SUCCESS, payload: {userInfo:  JSON.stringify(response.data)}})
        //localStorage.setItem(PROFILE_KEY, JSON.stringify(payload));
    } catch (error) {
        console.log(error, "ERROR")
        let requestError = error.message.split(' ');
        dispatch({type:  GET_PROFILE_INFO_FAIL, payload: {statusCode: requestError[requestError.length -1]}});	
       // dispatch({type:  GET_PROFILE_INFO_FAIL});
	}
};