import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import AppContainer from '../src/features/app/containers/AppContainer';
import configureStore from './store/index'


const store = configureStore()

render(
    <Provider store={store}>
        <AppContainer/>
    </Provider>,
    document.getElementById('root')
)
