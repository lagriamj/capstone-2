import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Login from "./views/Login";
import Register from  "./views/Register"
import RegisterConfirmation from "./views/RegisterConfirmation";
import NotFound from "./views/NotFound";
import Requests from "./views/user/Requests";
import CurrentRequests from "./views/user/CurrentRequests";
import Transactions from "./views/user/Transactions";
import Account from "./views/user/Account";

const router = createBrowserRouter([
    {
        path: '/login',
        element: <Login/>
    },
    {
        path: '/register',
        element: <Register/>
    },
    {
        path: '/verify-otp',
        element: <RegisterConfirmation/>
    },
    {
        path: '*',
        element: <NotFound/>
    },
    {
        path: '/request',
        element: <Requests/>
    },
    {
        path: '/current-requests',
        element: <CurrentRequests/>
    },
    {
        path: '/transactions',
        element: <Transactions/>
    },
    {
        path: '/account',
        element: <Account/>
    },
])

export default router;