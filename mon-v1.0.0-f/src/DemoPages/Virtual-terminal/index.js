import React, {Fragment} from 'react';
import {Route} from 'react-router-dom';

// VirtualTerminal

import VirtualTerminalinnerpage from './Components/';
import VirtualTerminalreport from './Components/report';
import VirtualJsonLoopBack from './Components/jsonreport';

// Layout

import AppHeader from '../../Layout/AppHeader/';
import AppSidebar from '../../Layout/AppSidebar/';
import AppFooter from '../../Layout/AppFooter/';

// Theme Options

import ThemeOptions from '../../Layout/ThemeOptions/';

const VirtualTerminal = ({match}) => (
    <Fragment>
        <ThemeOptions/>
        <AppHeader/>
        <div className="app-main">
            <AppSidebar/>
            <div className="app-main__outer">
                <div className="app-main__inner">
                    {/* Virtual Elements */}
                    <Route path={`${match.url}/virtual-terminal`} component={VirtualTerminalinnerpage}/>
                    <Route path={`${match.url}/transaction`} component={VirtualTerminalreport}/>
                    <Route path={`${match.url}/json`} component={VirtualJsonLoopBack}/>
                </div>
                <AppFooter/>
            </div>
        </div>
    </Fragment>
);

export default VirtualTerminal;