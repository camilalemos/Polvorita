import { 
    JOIN_GAME_FAIL,
    JOIN_GAME_SUCCESS,
    JOIN_GAME
} from '../../../constants/actionTypes/joingame';

const initialState= {
    status: 'undefined'
}

export default (state = initialState, action) => {
	switch (action.type) {
		case JOIN_GAME:
			return {
				...state,
				status: 'loading'
			}
		case JOIN_GAME_FAIL:
			return {
				...state,
				status: 'failed'
			}
		case JOIN_GAME_SUCCESS:
			return {
				...state, 
				status: 'success'
			}
		default:
			return {...state};
	}
};