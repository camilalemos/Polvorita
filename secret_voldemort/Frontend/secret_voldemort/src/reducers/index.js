/* @flow */

import { combineReducers } from 'redux';

//Imports
<<<<<<< HEAD
import createGame from '../features/createGameForm/reducers/createGameReducer'

const rootReducer = combineReducers({
  createGame
=======
import register from '../features/register/reducers/register';
import login from '../features/login/reducers/login';

const rootReducer = combineReducers({
    register,
    login
>>>>>>> login_user(logic,design)Front
});

export default rootReducer;