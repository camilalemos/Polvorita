import {
    REGISTER_USER,
    REGISTER_USER_FAIL,
    REGISTER_USER_SUCCESS
} from '../../../constants/actionTypes/register';

const initialState= {
    status: 'unknow',
    statusCode: ''
}

export default (state = initialState, action) => {
    switch (action.type) {
        case REGISTER_USER:
            return {
                ...state,
                status: 'loading'
            }
        case REGISTER_USER_FAIL:
            return {
                ...state,
                status: 'failed',
                statusCode: action.payload.statusCode
            }
        case REGISTER_USER_SUCCESS:
            return {
                ...state, 
                status: 'success'
            }
        default:
            return {...state};
    }
};