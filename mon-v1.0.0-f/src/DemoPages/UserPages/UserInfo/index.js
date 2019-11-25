import React, {Fragment, lazy} from 'react';
import {Route, Redirect} from 'react-router-dom';
import UserEditPage from './Components/UserEditPage';
import BillRatesPage from './Components/billRates';

import AppHeader from '../../../Layout/AppHeader/';
import AppSidebar from '../../../Layout/AppSidebar/';
import AppFooter from '../../../Layout/AppFooter/';
import ThemeOptions from '../../../Layout/ThemeOptions/';
import Can from "../../../config/can";
const Error_404 = lazy(() => import('../../../DemoPages/Errors/404'))

const UserInfo = ({match}) => (
    <Fragment>
        <ThemeOptions/>
        <AppHeader/>
        <div className="app-main">
            <AppSidebar/>
            <div className="app-main__outer">
                <div className="app-main__inner">
                    <Route path={`${match.url}/edit`} render={() => {
                        return <UserEditPage/>
                    }}/>
                    <Can I='access' on='settings.rates'>
                        <Route path={`${match.url}/${localStorage.getItem('user_mon_id')}/billRate`} render={() => {
                            return <BillRatesPage/>
                        }}/>
                    </Can>
                </div>
                <AppFooter/>
            </div>
        </div>
    </Fragment>
);

export default UserInfo;
