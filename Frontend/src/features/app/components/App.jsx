import React, { Component, Suspense, useEffect } from 'react';
import { HashRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import RegisterContainer from '../../register/containers/RegisterContainers'
import LoginContainer from '../../login/containers/LoginContainers';
import JoinGameContainer from '../../joingame/containers/JoinGameContainers';
import LobbyContainer from '../../joingame/containers/LobbyContainers';
import { SnackbarProvider } from 'notistack';
import CircularProgress from '@material-ui/core/CircularProgress';
import PublicRoute from '../../../constants/Routes/PublicRoute';
import ShowRoleContainer from '../../../features/showRole/containers/ShowRoleContainers'


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

function PrivateRoute({ component, restricted,...rest }) {

    return (
    <Route {...rest} render={() =>(
        restricted ? 
            component
        : 
            <Redirect to="/login" />
        )}
    />
    );
}

const App = function ({ getUserData, statusLogin, is_logged, getLoginData}) {

    useEffect(() => {
        getUserData();
    }, [getUserData])

    useEffect(() => {
        if(is_logged) getLoginData()
    },[is_logged, getLoginData])

    if (statusLogin === 'loading' || statusLogin === 'unknow') return <MuiThemeProvider theme={theme}><CircularProgress/></MuiThemeProvider>;
    return (
        <MuiThemeProvider theme={theme}>
            <SnackbarProvider maxSnack={3}>
                <Suspense fallback={<CircularProgress />}>
                    <Router>
                    <Switch>
                        <Route exact path="/">
                            <Redirect to="/login" />
                        </Route>
                        <PrivateRoute exact path='/lobby' restricted={is_logged} component={<JoinGameContainer/>} />
                        <PrivateRoute exact path='/lobby/:game' restricted={is_logged} component={<LobbyContainer/>} />
                        <PrivateRoute exact path='/game/:game' restricted={is_logged} component={<ShowRoleContainer/>} />
                        <PublicRoute exact path='/login' component={LoginContainer} />
                        <PublicRoute exact path='/register' component={RegisterContainer} />
                    </Switch>
                    </Router>
                </Suspense>
            </SnackbarProvider>
        </MuiThemeProvider>
    );

}


export default App;