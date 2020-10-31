import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import AppContainer from '../src/features/app/containers/AppContainer';
import configureStore from './store/index'
import CreateGameContainer from '../src/features/createGameForm/containers/container'


const store = configureStore()

render(
    <Provider store={store}>
        <CreateGameContainer/>
    </Provider>,
    document.getElementById('root')
)
