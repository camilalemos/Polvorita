/* @flow */

import { combineReducers } from 'redux';

//Imports
import joingame from '../features/joingame/reducers/joingame';
import register from '../features/register/reducers/register';
import login from '../features/login/reducers/login';
import createGame from '../features/createGameForm/reducers/createGameReducer';
import enactProclamation from '../features/game/reducers/enactproclamationReducer'

const rootReducer = combineReducers({
	register,
	login,
	createGame,
	joingame,
	enactProclamation
});

export default rootReducer;