import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useIsAuthenticated } from 'react-auth-kit'

const PrivateRoutes = () => {
    const userIsAuthenticated = useIsAuthenticated()
    return (
        userIsAuthenticated() ? <Outlet/> : <Navigate to='/login'/>
    );
};

export default PrivateRoutes;