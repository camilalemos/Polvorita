/* @flow */

import { combineReducers } from 'redux';

//Imports
import joingame from '../features/joingame/reducers/joingame';

const rootReducer = combineReducers({
    joingame
});

export default rootReducer;