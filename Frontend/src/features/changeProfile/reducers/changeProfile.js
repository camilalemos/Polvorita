import {
    GET_PROFILE_INFO,
    GET_PROFILE_INFO_FAIL,
    GET_PROFILE_INFO_SUCCESS
} from '../../../constants/actionTypes/changeProfile';

const initialState= {
	status: 'unknow',
    statusCode: '',
    userInfo: {}
}

export default (state = initialState, action) => {
	switch (action.type) {
		case GET_PROFILE_INFO:
			return {
				...state,
				status: 'loading'
			}
		case GET_PROFILE_INFO_FAIL:
			return {
				...state,
				status: 'failed',
				statusCode: action.payload.statusCode
			}
		case GET_PROFILE_INFO_SUCCESS:
			return {
				...state, 
                status: 'success',
				userInfo: action.payload.userInfo
			}
		default:
			return {...state};
	}
};