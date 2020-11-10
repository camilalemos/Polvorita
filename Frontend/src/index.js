import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import configureStore from './store/index'
//import AppContainer from '../src/features/app/containers/AppContainer'
import ShowRole from '../src/features/showRole/components/ShowRole'
const store = configureStore()

render(
    <Provider store={store}>
        <ShowRole/>
    </Provider>,
    document.getElementById('root')
)
