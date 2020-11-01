import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import configureStore from './store/index'
import JoinGameContainer from '../src/features/joingame/containers/JoinGameContainers'


const store = configureStore()

render(
    <Provider store={store}>
        <JoinGameContainer/>
    </Provider>,
    document.getElementById('root')
)
