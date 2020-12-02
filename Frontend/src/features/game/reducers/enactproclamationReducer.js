import {
	GET_PROCLAMATIONS,
	GET_PROCLAMATIONS_SUCCESS,
	GET_PROCLAMATIONS_FAIL,
	DISCARD_PROCLAMATION,
	DISCARD_PROCLAMATION_FAIL,
	DISCARD_PROCLAMATION_SUCCESS,
} from '../../../constants/actionTypes/enactproclamation';

const initialState= {
	statusGetProclamation: 'unknow',
	statusDiscardProclamation: 'unknow',
	proclamationsInfo: [] //revisar
}

export default (state = initialState, action) => {
	switch (action.type) {
		case GET_PROCLAMATIONS:
			return {
				...state,
				statusGetProclamation: 'loading'
			}
		case GET_PROCLAMATIONS_FAIL:
			return {
				...state,
				statusGetProclamation: 'failed',
			}
		case GET_PROCLAMATIONS_SUCCESS:
			return {
				...state, 
				statusGetProclamation: 'success',
				proclamationsInfo: action.payload.proclamationsInfo
			}
		case DISCARD_PROCLAMATION:
			return {
				...state,
				statusDiscardProclamation: 'loading'
			}
		case DISCARD_PROCLAMATION_FAIL:
			return {
				...state,
				statusDiscardProclamation: 'failed',
			}
		case DISCARD_PROCLAMATION_SUCCESS:
			return {
				...state, 
				statusDiscardProclamation: 'success'
			}
		default:
			return {...state};
	}
};