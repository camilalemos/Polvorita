import {
    ENACT_PROCLAMATION,
    ENACT_PROCLAMATION_FAIL,
	ENACT_PROCLAMATION_SUCCESS,
	GET_PROCLAMATIONS,
	GET_PROCLAMATIONS_SUCCESS,
	GET_PROCLAMATIONS_FAIL
} from '../../../constants/actionTypes/enactproclamation';

const initialState= {
	status: 'unknow',
	statusCode: '',
	statusGetProclamation: 'unknow',
	errorMsg: '',
	proclamationsInfo: [] //revisar
}

export default (state = initialState, action) => {
	switch (action.type) {
		case ENACT_PROCLAMATION:
			return {
				...state,
				status: 'loading'
			}
		case ENACT_PROCLAMATION_FAIL:
			return {
				...state,
				status: 'failed',
				statusCode: action.payload.statusCode
			}
		case ENACT_PROCLAMATION_SUCCESS:
			return {
				...state, 
				status: 'success'
			}
		case GET_PROCLAMATIONS:
			return {
				...state,
				statusGetProclamation: 'loading'
			}
		case GET_PROCLAMATIONS_FAIL:
			return {
				...state,
				statusGetProclamation: 'failed',
				errorMsg: action.payload.errorMsg //revisar
			}
		case GET_PROCLAMATIONS_SUCCESS:
			return {
				...state, 
				statusGetProclamation: 'success',
				proclamationsInfo: action.payload.proclamationsInfo
			}
		default:
			return {...state};
	}
};