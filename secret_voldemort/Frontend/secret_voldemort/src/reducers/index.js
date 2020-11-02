/* @flow */

import { combineReducers } from 'redux';

//Imports
import register from '../features/register/reducers/register';
import login from '../features/login/reducers/login';
import createGame from '../features/createGameForm/reducers/createGameReducer'

const rootReducer = combineReducers({
	register,
	login,
	createGame
});

export default rootReducer;