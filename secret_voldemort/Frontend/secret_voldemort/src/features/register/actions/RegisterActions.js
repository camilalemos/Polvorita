import {
    REGISTER_USER,
    REGISTER_USER_SUCCESS,
    REGISTER_USER_FAIL
} from '../../../constants/actionTypes/register';


export const registerUser = (data) => (dispatch) => _registerUser(data, dispatch);
const _registerUser = async (data, dispatch) => {

    try {

        dispatch({type: REGISTER_USER});

        console.log(data, "DATA SEND");
        
        // {dispatch({type: REGISTER_USER_SUCCESS})}ç
        
    } catch (error) {
    console.log(error)
        dispatch({type: REGISTER_USER_FAIL});
    }

};