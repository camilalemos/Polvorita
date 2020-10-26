import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import AppContainer from '../src/features/app/containers/AppContainer';
import configureStore from './store/index';
import RegisterContainer from '../src/features/register/containers/RegisterContainers';

const store = configureStore()

render(
    <Provider store={store}>
        <RegisterContainer/>
    </Provider>,
    document.getElementById('root')
)
