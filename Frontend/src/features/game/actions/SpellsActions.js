import {
    CAST_SPELL,
    CAST_SPELL_FAIL,
	CAST_SPELL_SUCCESS,
} from '../../../constants/actionTypes/SpellsActions';
import axios from 'axios';
import api from '../../../configs/api';

export const castSpell = (spell, targetName, gameName, playerName) => (dispatch, getState) => _castSpell(spell, targetName, gameName, playerName, dispatch, getState);
const _castSpell = async (spell, targetName, gameName, playerName, dispatch, getState) => {

    try {

        dispatch({type: CAST_SPELL});
        let uri
        let {access_token} = {...getState().login}
        if (targetName !== ''){
            uri = `${api.url}/game/spells?spell=${spell}&target_name=${targetName}&player_name=${playerName}&game_name=${gameName}`
        }
        else {
            uri = `${api.url}/game/spells?spell=${spell}&player_name=${playerName}&game_name=${gameName}`
        }
       
        const response = await axios({
            method: 'put',
            url: uri,
            headers: { 
            'Content-Type':'multipart/form-data',
            "Authorization" : `Bearer ${access_token}`
            }
        });
        console.log("URL " + uri);
        console.log(response.data , "RESPONSE");
        dispatch({type: CAST_SPELL_SUCCESS, payload: {cards: response.data}})
        
    } catch (error){
        console.log(error, "ERROR")
        if (error.response.status === 401) dispatch({type: CAST_SPELL_FAIL, payload: {errorMsg: error.response.data.detail }});
        if (error.response.status === 403) dispatch({type: CAST_SPELL_FAIL, payload: {errorMsg: error.response.data.detail }});
        if (error.response.status === 422) dispatch({type: CAST_SPELL_FAIL, payload: {errorMsg: error.response.data.detail[0].msg }});
        	
    }
};