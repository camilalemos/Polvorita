import {
    CREATE_GAME,
    CREATE_GAME_FAIL,
    CREATE_GAME_SUCCESS
} from '../../../constants/actionTypes/createGame';

const initialState= {
	status: 'unknow'
}

export default (state = initialState, action) => {
	switch (action.type) {
		case CREATE_GAME:
			return {
				...state,
				status: 'loading'
			}
		case CREATE_GAME_FAIL:
			return {
				...state,
				status: 'failed'
			}
		case CREATE_GAME_SUCCESS:
			return {
				...state, 
				status: 'success'
			}
		default:
			return {...state};
	}
};