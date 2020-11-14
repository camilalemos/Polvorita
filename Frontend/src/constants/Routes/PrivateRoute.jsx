import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({component_to_render, restricted, ...rest}) => {
    return (
        <Route {...rest} render={props => (
            restricted ?
                component_to_render
            : <Redirect to="/login" />
        )}/>
    );
};

export default PrivateRoute;
