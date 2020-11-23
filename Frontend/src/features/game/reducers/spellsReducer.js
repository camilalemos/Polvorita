import {
    CAST_ADIVINATION,
    CAST_ADIVINATION_FAIL,
	CAST_ADIVINATION_SUCCESS,
} from '../../../constants/actionTypes/SpellsActions';

const initialState= {
	status: 'unknow',
	errorMsg: 'unknow',
	threeCards: {}
}

export default (state = initialState, action) => {
	switch (action.type) {
		case CAST_ADIVINATION:
			return {
				...state,
				status: 'loading'
			}
		case CAST_ADIVINATION_FAIL:
			return {
				...state,
				status: 'failed',
				errorMsg: action.payload.errorMsg
				
			}
		case CAST_ADIVINATION_SUCCESS:
			return {
				...state, 
				status: 'success',
				threeCards: action.payload.threeCards
			}
		default:
			return {...state};
	}
	
};