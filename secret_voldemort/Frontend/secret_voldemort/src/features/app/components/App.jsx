import React, { Component, Suspense } from 'react';
import { HashRouter as Router, Redirect, Route } from "react-router-dom";
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import RegisterContainer from '../../register/containers/RegisterContainers'
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

    render() {
<<<<<<< HEAD
       
=======
        return (
            <MuiThemeProvider theme={theme}>
                <SnackbarProvider maxSnack={3}>
                    <Router>
                        <Route exact path="/">
                            <Redirect to="/login" />
                        </Route>
                        <Route exact path='/login' component={LoginContainer} />
                        <Route exact path='/register' component={RegisterContainer} />
                    </Router>
                </SnackbarProvider>
            </MuiThemeProvider>
        );
>>>>>>> login_user(logic,design)Front
    }

}

export default App;