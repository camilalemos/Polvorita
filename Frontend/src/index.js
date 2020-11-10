import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import configureStore from './store/index'
import Board from '../src/features/board/containers/BoardContainers.js'
import Game from '../src/features/board/components/game'

const store = configureStore()

render(
    <Provider store={store}>
        <Game/>
    </Provider>,
    document.getElementById('root')
)
