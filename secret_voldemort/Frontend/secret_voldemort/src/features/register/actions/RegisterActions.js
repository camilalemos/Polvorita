import {
    REGISTER_USER,
    REGISTER_USER_SUCCESS,
    REGISTER_USER_FAIL
} from '../../../constants/actionTypes/register';


export const registerUser = () => (dispatch) => _registerUser(dispatch);
const _registerUser = async (dispatch) => {

    try {

        dispatch({type: REGISTER_USER});

        dispatch({type: REGISTER_USER_SUCCESS});
        
    } catch (error) {
    console.log(error)
        dispatch({type: REGISTER_USER_FAIL});
    }
    

};