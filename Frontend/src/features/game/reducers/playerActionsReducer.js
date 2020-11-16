import {
    SELECT_CANDIDATE,
    SELECT_CANDIDATE_FAIL,
    SELECT_CANDIDATE_SUCCESS
} from '../../../constants/actionTypes/playersActions';

const initialState= {
	status: 'unknow',

}

export default (state = initialState, action) => {
	switch (action.type) {
		case SELECT_CANDIDATE:
			return {
				...state,
				status: 'loading'
			}
		case SELECT_CANDIDATE_FAIL:
			return {
				...state,
				status: 'failed',
			}
		case SELECT_CANDIDATE_SUCCESS:
			return {
				...state, 
				status: 'success'
			}
		default:
			return {...state};
	}
};