import {
    SELECT_CANDIDATE,
    SELECT_CANDIDATE_FAIL,
	SELECT_CANDIDATE_SUCCESS,
	VOTE,
	VOTE_FAIL,
	VOTE_SUCCESS,
	GET_RESULTS,
	GET_RESULTS_SUCCESS,
	GET_RESULTS_FAIL,
	PUT_RESULTS,
	PUT_RESULTS_FAIL,
	PUT_RESULTS_SUCCESS
} from '../../../constants/actionTypes/playersActions';

const initialState= {
	status: 'unknow',
	statusVote: 'unknow',
	statusResults: 'unknow',
	statusResultsPut: 'unknow',
	results: null
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
		case VOTE:
			return {
				...state,
				statusVote: 'loading'
			}
		case VOTE_FAIL:
			return {
				...state,
				statusVote: 'failed',
			}
		case VOTE_SUCCESS:
			return {
				...state, 
				statusVote: 'success'
			}
		case GET_RESULTS:
			return {
				...state,
				statusResults: 'loading'
			}
		case GET_RESULTS_FAIL:
			return {
				...state,
				statusResults: 'failed',
			}
		case GET_RESULTS_SUCCESS:
			return {
				...state, 
				statusResults: 'success',
				results: action.payload.results
			}
		case PUT_RESULTS:
			return {
				...state,
				statusResultsPut: 'loading'
			}
		case PUT_RESULTS_FAIL:
			return {
				...state,
				statusResultsPut: 'failed',
			}
		case PUT_RESULTS_SUCCESS:
			return {
				...state, 
				statusResultsPut: 'success',
			}
		default:
			return {...state};
	}
};