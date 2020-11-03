import React, { Component, Suspense } from 'react';
import { HashRouter as Router, Redirect, Route } from "react-router-dom";
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import RegisterContainer from '../../register/containers/RegisterContainers'
import CreateGameContainer from '../../createGameForm/containers/container'
import LoginContainer from '../../login/containers/LoginContainers';
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



class App extends Component {

    componentDidMount() {
        this.props.getUserData()
    }

    render() {
        return (
            <MuiThemeProvider theme={theme}>
                <SnackbarProvider maxSnack={3}>
                    <Router>
                        <Route exact path="/">
                            <Redirect to="/login" />
                        </Route>
                        <Route exact path='/login' component={LoginContainer} />
                        <Route exact path='/register' component={RegisterContainer} />
                        <Route exact path='/NewGame' component={CreateGameContainer} />
                    </Router>
                </SnackbarProvider>
            </MuiThemeProvider>
        );
    }

}

export default App;