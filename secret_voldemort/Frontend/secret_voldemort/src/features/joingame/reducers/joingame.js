import { 
    JOIN_GAME_ERROR,
    JOIN_GAME_SUCCESS,
    JOIN_GAME_REQUEST
} from '../../../constants/actionTypes/joingame';

const initialState= {
    gameName: null,
    state: 'undefined'
}

export default (state = initialState, action) => {
    switch (action.type){

        case JOIN_GAME_SUCCESS:
            return {
                ...state,
                gameName: action.payload
            }
        default: return state
    }
};