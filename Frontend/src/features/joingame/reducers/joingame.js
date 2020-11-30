import { 
    JOIN_GAME_FAIL,
    JOIN_GAME_SUCCESS,
	JOIN_GAME,
	START_GAME,
	START_GAME_SUCCESS,
	START_GAME_FAIL,
	RECCONECT_GAME_SUCCESS
} from '../../../constants/actionTypes/joingame';

const initialState= {
	status: 'undefined',
	statusStart: 'undefined',
	errorMsg: '',
	reconnectGames: []
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
				status: 'failed',
				errorMsg: action.payload.errorMsg
			}
		case JOIN_GAME_SUCCESS:
			return {
				...state, 
				status: 'success'
			}
		case START_GAME:
			return {
				...state,
				statusStart: 'loading'
			}
		case START_GAME_FAIL:
			return {
				...state,
				statusStart: 'failed'
			}
		case START_GAME_SUCCESS:
			return {
				...state, 
				statusStart: 'success'
			}
		case RECCONECT_GAME_SUCCESS:
			return {
				...state,
				reconnectGames: action.payload.reconnectGames
			}
		default:
			return {...state};
	}
};