import {
    SET_STATE
} from '../../../constants/actionTypes/app';

const initialState= {
    status: 'unknow'
}

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_STATE:
            return {
                ...state,
                status: 'success'
            }
        default:
            return {...state};
    }
};