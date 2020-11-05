import thunkMiddleware from 'redux-thunk'
import monitorReducersEnhancer from './enhancers/monitorReducers'
import loggerMiddleware from './middlewares/logger'
import rootReducer from '../reducers/index'
import { configureStore as createStore } from "@reduxjs/toolkit";


export default function configureStore(preloadedState) {
    const middlewares = [thunkMiddleware];
    const enhancers = []

    if ( process.env.NODE_ENV === 'development') {
        middlewares.push(loggerMiddleware);
        enhancers.push(monitorReducersEnhancer);
    }

    const store = createStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(middlewares),
        devTools: process.env.NODE_ENV !== 'production',
        preloadedState,
        enhancers: enhancers,
    })
    return store
}