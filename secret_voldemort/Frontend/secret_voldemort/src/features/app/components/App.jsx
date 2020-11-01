import React, { Component } from 'react';
import CreateGameContainer from '../../createGameForm/containers/container'
import { HashRouter as Router, Redirect, Route } from "react-router-dom";


class App extends Component {
    render() {
        return (
            <Router>
                <Route exact path="/">
                    <Redirect to="/createGame" />
                </Route>
                <Route exact path='/createGame' component={CreateGameContainer} />
            </Router>
        )
    }
}

export default App;
