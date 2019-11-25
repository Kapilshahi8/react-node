import React, {Fragment} from 'react';
import {Container} from "reactstrap";

import AppHeader from '../../Layout/AppHeader/';
import AppSidebar from '../../Layout/AppSidebar/';
import AppFooter from '../../Layout/AppFooter/';
import ThemeOptions from '../../Layout/ThemeOptions/';

const Error_404 = ({match}) => (
    <Fragment>
        <AppHeader/>
        <ThemeOptions/>
        <div className="app-main">
            <AppSidebar/>
            <div className="app-main__inner">
                <Container>
                    <h1>404 Error</h1>
                    <h3>This page does not exist or you dont have acess to see this page</h3>
                </Container>
            </div>
        </div>
        <AppFooter/>
    </Fragment>
);

export default Error_404;
