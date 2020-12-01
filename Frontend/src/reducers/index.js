/* @flow */

import { combineReducers } from 'redux';

//Imports
import joingame from '../features/joingame/reducers/joingame';
import register from '../features/register/reducers/register';
import login from '../features/login/reducers/login';
import createGame from '../features/createGameForm/reducers/createGameReducer';
import getUserInfo from '../features/changeProfile/reducers/changeProfile';
import enactProclamation from '../features/game/reducers/enactproclamationReducer'
import playerActionsReducer from '../features/game/reducers/playerActionsReducer'
import chat from '../features/chat/reducers/chatReducer'
import spellsReducer from '../features/game/reducers/spellsReducer'
import expelliarmus from '../features/game/reducers/expelliarmus'
import winPopUp from '../features/game/reducers/quitGameReducer'



const rootReducer = combineReducers({
	register,
	login,
	createGame,
	joingame, 
	getUserInfo,
	enactProclamation,
	playerActionsReducer,
	chat,
	spellsReducer,
	expelliarmus,
	winPopUp,
});

export default rootReducer;
