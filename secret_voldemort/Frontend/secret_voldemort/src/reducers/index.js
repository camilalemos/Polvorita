/* @flow */

import { combineReducers } from 'redux';

//Imports
import register from '../features/register/reducers/register';

const rootReducer = combineReducers({
    register
});

export default rootReducer;