import {
    ENACT_PROCLAMATION,
    ENACT_PROCLAMATION_FAIL,
    ENACT_PROCLAMATION_SUCCESS
} from '../../../constants/actionTypes/enactproclamation';

const initialState= {
	status: 'unknow',
	statusCode: ''
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
		default:
			return {...state};
	}
};