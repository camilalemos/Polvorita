
import React from 'react';
import { Route } from 'react-router-dom';


const PublicRoute = ({component: Component, ...rest}) => {
    return (
        // restricted = false meaning public route
        // restricted = true meaning restricted route
        <Route {...rest} render={props => (
            <Component {...props} />
        )} />
    );
};

export default PublicRoute;