/* @flow */

import { combineReducers } from 'redux';

//Imports
import createGame from '../features/createGameForm/reducers/createGameReducer'

const rootReducer = combineReducers({
  createGame
});

export default rootReducer;