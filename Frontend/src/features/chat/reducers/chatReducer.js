import {
    SEND_MESSAGE,
    SEND_MESSAGE_FAIL,
    SEND_MESSAGE_SUCCESS
} from '../../../constants/actionTypes/chat';

const initialState= {
	status: 'unknow',
   	errorMsg: '' ,
}

export default (state = initialState, action) => {
	switch (action.type) {
		case SEND_MESSAGE:
			return {
				...state,
				status: 'loading'
			}
		case SEND_MESSAGE_FAIL:
			return {
				...state,
				status: 'failed',
                errorMsg: action.payload.errorMsg
			}
		case SEND_MESSAGE_SUCCESS:
			return {
				...state, 
                status: 'success',
			}
		default:
			return {...state};
	}
};