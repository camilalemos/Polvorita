/* @flow */

import { combineReducers } from 'redux';

//Imports
import joingame from '../features/joingame/reducers/joingame';
import register from '../features/register/reducers/register';
import login from '../features/login/reducers/login';
import createGame from '../features/createGameForm/reducers/createGameReducer';
import getUserInfo from '../features/changeProfile/reducers/changeProfile';

const rootReducer = combineReducers({
	register,
	login,
	createGame,
	joingame, 
	getUserInfo
});

export default rootReducer;