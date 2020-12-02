import {
    SET_STATE
} from '../../../constants/actionTypes/app';


export const setState = () => (dispatch) => _setState(dispatch);
const _setState = async (dispatch) => {

    dispatch({
        type: SET_STATE
    });

};
