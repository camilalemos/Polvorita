import {
    QUIT_GAME,
    QUIT_GAME_FAIL,
    QUIT_GAME_SUCCESS
} from '../../../constants/actionTypes/quitGame';

const initialState= {
	status: 'unknow',
}

export default (state = initialState, action) => {
	switch (action.type) {
		case QUIT_GAME:
			return {
				...state,
				status: 'loading'
			}
		case QUIT_GAME_FAIL:
			return {
				...state,
				status: 'failed',
			}
		case QUIT_GAME_SUCCESS:
			return {
				...state, 
                status: 'success',
			}
		default:
			return {...state};
	}
};