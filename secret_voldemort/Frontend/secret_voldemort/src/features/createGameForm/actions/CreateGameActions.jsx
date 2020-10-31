import {
  CREATE_GAME,
  CREATE_GAME_FAIL,
  CREATE_GAME_SUCCESS
} from '../../../constants/actionTypes/createGame';


export const createGame = () => (dispatch) => _createGame(dispatch);
const _createGame = async (dispatch) => {

  try {

      dispatch({type: CREATE_GAME});

      dispatch({type: CREATE_GAME_SUCCESS});
      
  } catch (error) {
  console.log(error)
      dispatch({type: CREATE_GAME_FAIL});
  } 
};