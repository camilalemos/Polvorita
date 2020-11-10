import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import configureStore from './store/index'
import Board from '../src/features/board/containers/BoardContainers.js'

const store = configureStore()

render(
    <Provider store={store}>
        <Board/>
    </Provider>,
    document.getElementById('root')
)
