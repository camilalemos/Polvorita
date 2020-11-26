import {
	CAST_SPELL,
	CAST_SPELL_FAIL,
	CAST_SPELL_SUCCESS,
} from '../../../constants/actionTypes/SpellsActions';

const initialState= {
	status: 'unknow',
	errorMsg: 'unknow',
	cards: {}
}

export default (state = initialState, action) => {
	switch (action.type) {
		case CAST_SPELL:
			return {
				...state,
				status: 'loading'
			}
		case CAST_SPELL_FAIL:
			return {
				...state,
				status: 'failed',
				errorMsg: action.payload.errorMsg
				
			}
		case CAST_SPELL_SUCCESS:
			return {
				...state, 
				status: 'success',
				cards: action.payload.cards
			}
		default:
			return {...state};
	}
	
};