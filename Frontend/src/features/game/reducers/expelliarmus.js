import {
    EXPELLIARMUS,
    EXPELLIARMUS_FAIL,
    EXPELLIARMUS_SUCCESS
} from '../../../constants/actionTypes/expelliarmus';

const initialState= {
	status: 'unknow',
   	errorMsg: '' ,
}

export default (state = initialState, action) => {
	switch (action.type) {
		case EXPELLIARMUS:
			return {
				...state,
				status: 'loading'
			}
		case EXPELLIARMUS_FAIL:
			return {
				...state,
				status: 'failed',
                errorMsg: action.payload.errorMsg
			}
		case EXPELLIARMUS_SUCCESS:
			return {
				...state, 
                status: 'success',
			}
		default:
			return {...state};
	}
};