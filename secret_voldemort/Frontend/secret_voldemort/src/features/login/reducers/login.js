import {
    LOGIN_USER,
    LOGIN_USER_FAIL,
    LOGIN_USER_SUCCESS
} from '../../../constants/actionTypes/login';

const initialState= {
    status: 'unknow',
    access_token: ''
}

export default (state = initialState, action) => {
    switch (action.type) {
        case LOGIN_USER:
            return {
                ...state,
                status: 'loading'
            }
        case LOGIN_USER_FAIL:
            return {
                ...state,
                status: 'failed'
            }
        case LOGIN_USER_SUCCESS:
            return {
                ...state, 
                status: 'success',
                access_token: action.payload.access_token
            }
        default:
            return {...state};
    }
};