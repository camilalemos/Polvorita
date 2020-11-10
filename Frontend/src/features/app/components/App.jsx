import React, { Component, Suspense, useEffect } from 'react';
import { HashRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import RegisterContainer from '../../register/containers/RegisterContainers'
import LoginContainer from '../../login/containers/LoginContainers';
import JoinGameContainer from '../../joingame/containers/JoinGameContainers';
import { SnackbarProvider } from 'notistack';


const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#000000',
            paper: '#eaeaea',
            hover: 'rgba(0, 0, 0, 0.07)'
        },
        secondary: {
            main: '#adasda',
            complementary: '#EB9A50'
        }
    },
});

function PrivateRoute({ component, auth, ...rest }) {

    return (
        <Route
            {...rest}
            render={({ location }) =>
            auth ? (
                component
            ) : (
                <Redirect
                to={{
                    pathname: "/login",
                    state: { from: location }
                }}
                />
            )
            }
        />
        );
}

const App = function ({ getUserData, statusLogin, is_logged}) {

    useEffect(() => {
        getUserData()
    },[getUserData]);

    return (
        <MuiThemeProvider theme={theme}>
            <SnackbarProvider maxSnack={3}>
                <Router>
                    <Switch>
                        <Route exact path="/">
                            {statusLogin === 'success' ?
                                <Redirect to="/lobby" />
                            :
                                <Redirect to='/login' />
                            }
                        </Route>
                        <Route exact path='/login' component={LoginContainer} />
                        <PrivateRoute auth={is_logged} path='/register' component={RegisterContainer} />
                        <PrivateRoute auth={is_logged} path='/lobby' component={JoinGameContainer} /> 
                    </Switch>
                </Router>
            </SnackbarProvider>
        </MuiThemeProvider>
    );
    

}

export default App;