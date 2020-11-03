/* @flow */

import { combineReducers } from 'redux';

//Imports
import register from '../features/register/reducers/register';
import login from '../features/login/reducers/login';

const rootReducer = combineReducers({
    register,
    login
});

export default rootReducer;