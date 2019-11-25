import {Redirect, Route} from 'react-router-dom';
import React, {Component, Fragment, lazy, Suspense} from 'react';
import Loader from 'react-loaders';
import AppLogin from '../../Layout/AppLogin';

import {ToastContainer,} from 'react-toastify';
import Axios from 'axios';
import {setting} from '../../environment';
import Can from './../../config/can'

const VirtualTerminal = lazy(() => import('../../DemoPages/Virtual-terminal'));
const transacLedger = lazy(() => import('../../DemoPages/transacLedger'));
const Dashboard = lazy(() => import('../../DemoPages/Dashboards'));

const UserInfo = lazy(() => import('../../DemoPages/UserPages/UserInfo'))
const Error_404 = lazy(() => import('../../DemoPages/Errors/404'))

const FoundingSourcesPage = lazy(() => import('../../DemoPages/FoundingSources'))
const IntegrationsPage = lazy(() => import('../../DemoPages/Intergations'));
const OnboardingPage = lazy(() => import('../../DemoPages/Onboarding'));

const NachaPage = lazy(() => import('../../DemoPages/Nacha'))
const NewMerchantForm = lazy( () => import('../../DemoPages/Applications'));
const WebAuthorization = lazy(() => import('../../DemoPages/WebAuthorization'))

//Virtual Accounts
const VirtualAccount = lazy(() => import('../../DemoPages/VirtualAccount'))

class AppMain extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAuthenticate: false
        };
    }

    componentDidMount() {
        this.isAuthenticate();
    }

    componentWillUpdate(nextProps, nextState, nextContext) {
        if (this.state.isAuthenticate && !this.isOnboardingFinished()) {
            if (!window.location.hash.includes('onboarding'))
                window.location.replace('#/onboarding')
        }
        // else {
        //     window.location.href="/#/pages/login";
        // }
    }

    whatisUrl() {
        console.log(this.props.history)
    }

    isOnboardingFinished() {
        const userinformation = JSON.parse(localStorage.getItem('userinformation'))
        return  userinformation.user_metadata ? Boolean(userinformation.user_metadata.onboardingPassed) == true : false
    }

    isAuthenticate() {
        if (localStorage.getItem('jwttoken') != undefined) {
            this.setState({isAuthenticate: true})
            const options = {
                headers: {'x-access-token': localStorage.getItem('jwttoken')}
            };
            Axios.get(setting.site_Setting.API_URL + 'verifyToken', options).then(responseData => {

            }).catch(error => {
                localStorage.clear();
                window.location.href = "/pages/login";
            })
        }
    }

    render() {
        return (
            <Fragment>
                {this.state.isAuthenticate ?
                    <>
                        {/*Onboarding*/}
                        <Suspense fallback={
                            <div className="loader-container">
                                <div className="loader-container-inner">
                                    <div className="text-center">
                                        <Loader type="line-scale"/>
                                    </div>
                                    <h6 className="mt-3">
                                        Please wait while we load all the Elements examples
                                        <small>Because this is a demonstration we load at once all the Elements
                                            examples. This wouldn't happen in a real live app!</small>
                                    </h6>
                                </div>
                            </div>
                        }>

                            <Route path="/onboarding" component={OnboardingPage}/>

                        </Suspense>

                        <Suspense fallback={
                            <div className="loader-container">
                                <div className="loader-container-inner">
                                    <div className="text-center">
                                        <Loader type="line-scale"/>
                                    </div>
                                    <h6 className="mt-3">
                                        Please wait while we load all the Elements examples
                                        <small>Because this is a demonstration we load at once all the Elements
                                            examples. This wouldn't happen in a real live app!</small>
                                    </h6>
                                </div>
                            </div>
                        }>
                            <Can I="access" on="transaction.terminal">
                                <Route path="/analytics" component={VirtualTerminal}/>
                            </Can>

                            <Can not I='access' on='transaction.terminal'>
                                <Route path="/analytics" component={Error_404}/>
                            </Can>
                        </Suspense>

                        {/*transaction-ledger*/}
                        <Suspense fallback={
                            <div className="loader-container">
                                <div className="loader-container-inner">
                                    <div className="text-center">
                                        <Loader type="line-scale"/>
                                    </div>
                                    <h6 className="mt-3">
                                        Please wait while we load all the Elements examples
                                        <small>Because this is a demonstration we load at once all the Elements
                                            examples. This wouldn't happen in a real live app!</small>
                                    </h6>
                                </div>
                            </div>
                        }>
                            <Can I="access" on="analytics.transactionLedger">
                                <Route path="/transaction-ledger" component={transacLedger}/>
                            </Can>

                            <Can not I='access' on='analytics.transactionLedger'>
                                <Route path="/transaction-ledger" component={Error_404}/>
                            </Can>
                        </Suspense>
                        <Suspense fallback={
                            <div className="loader-container">
                                <div className="loader-container-inner">
                                    <div className="text-center">
                                        <Loader type="line-scale"/>
                                    </div>
                                    <h6 className="mt-3">
                                        Please wait while we load all the Elements examples
                                        <small>Because this is a demonstration we load at once all the Elements
                                            examples. This wouldn't happen in a real live app!</small>
                                    </h6>
                                </div>
                            </div>
                        }>
                            <Can I="access" on="dashboard">
                                <Route path="/dashboards" component={Dashboard}/>
                            </Can>

                            <Can not I='access' on='dashboard'>
                                <Route path="/VirtualTerminal" component={Error_404}/>
                            </Can>
                        </Suspense>

                        {/* Users */}
                        <Suspense fallback={
                            <div className="loader-container">
                                <div className="loader-container-inner">
                                    <div className="text-center">
                                        <Loader type="line-scale"/>
                                    </div>
                                    <h6 className="mt-3">
                                        Please wait while we load all the Elements examples
                                        <small>Because this is a demonstration we load at once all the Elements
                                            examples. This
                                            wouldn't happen in a real live app!</small>
                                    </h6>
                                </div>
                            </div>
                        }>
                            <Can I="access" on="settings.profile">
                                <Route path="/user" component={UserInfo}/>
                            </Can>

                            <Can not I='access' on='settings.profile'>
                                <Route path="/user" component={Error_404}/>
                            </Can>

                        </Suspense>


                        {/* Integrations */}
                        <Suspense fallback={
                            <div className="loader-container">
                                <div className="loader-container-inner">
                                    <div className="text-center">
                                        <Loader type="line-scale"/>
                                    </div>
                                    <h6 className="mt-3">
                                        Please wait while we load all the Elements examples
                                        <small>Because this is a demonstration we load at once all the Elements
                                            examples. This
                                            wouldn't happen in a real live app!</small>
                                    </h6>
                                </div>
                            </div>
                        }>
                            <Can I="access" on="settings.integrations">
                                <Route exact path="/integrations" component={IntegrationsPage}/>
                            </Can>

                            <Can not I='access' on='settings.integrations'>
                                <Route path="/integrations" component={Error_404}/>
                            </Can>

                        </Suspense>

                        {/* Founding Sources */}
                        <Suspense fallback={
                            <div className="loader-container">
                                <div className="loader-container-inner">
                                    <div className="text-center">
                                        <Loader type="line-scale"/>
                                    </div>
                                    <h6 className="mt-3">
                                        Please wait while we load all the Elements examples
                                        <small>Because this is a demonstration we load at once all the Elements
                                            examples. This
                                            wouldn't happen in a real live app!</small>
                                    </h6>
                                </div>
                            </div>
                        }>
                            <Can I="access" on="settings.foundingsources">
                                <Route exact path="/funding-sources" component={FoundingSourcesPage}/>
                            </Can>
                            {/* Virtual account*/}
                            <Can I="access" on="settings.foundingsources">
                                <Route exact path="/virtual-account" component={VirtualAccount}/>
                            </Can>

                            <Can not I='access' on='settings.foundingsources'>
                                <Route path="/funding-sources" component={Error_404}/>
                            </Can>


                        </Suspense>

                        {/* Nacha */}
                        <Suspense fallback={
                            <div className="loader-container">
                                <div className="loader-container-inner">
                                    <div className="text-center">
                                        <Loader type="line-scale"/>
                                    </div>
                                    <h6 className="mt-3">
                                        Please wait while we load all the Elements examples
                                        <small>Because this is a demonstration we load at once all the Elements
                                            examples. This
                                            wouldn't happen in a real live app!</small>
                                    </h6>
                                </div>
                            </div>
                        }>
                            <Can I="access" on="daily.nacha">
                                <Route exact path="/nacha" component={NachaPage}/>
                            </Can>

                            <Can not I='access' on='daily.nacha'>
                                <Route path="/nacha" component={Error_404}/>
                            </Can>




                        </Suspense>

                        {/* Applications */}
                        <Suspense fallback={
                            <div className="loader-container">
                                <div className="loader-container-inner">
                                    <div className="text-center">
                                        <Loader type="line-scale"/>
                                    </div>
                                    <h6 className="mt-3">
                                        Please wait while we load all the Elements examples
                                        <small>Because this is a demonstration we load at once all the Elements
                                            examples. This
                                            wouldn't happen in a real live app!</small>
                                    </h6>
                                </div>
                            </div>
                        }>
                            <Can I="access" on="applications.newmerchant">
                                <Route exact path="/applications/newmerchant" component={NewMerchantForm}/>
                            </Can>
                        </Suspense>


                        {/* Web Auth */}
                        <Suspense fallback={
                            <div className="loader-container">
                                <div className="loader-container-inner">
                                    <div className="text-center">
                                        <Loader type="line-scale"/>
                                    </div>
                                    <h6 className="mt-3">
                                        Please wait while we load all the Elements examples
                                        <small>Because this is a demonstration we load at once all the Elements
                                            examples. This
                                            wouldn't happen in a real live app!</small>
                                    </h6>
                                </div>
                            </div>
                        }>
                            <Can I="access" on="settings.compliance.webauth">
                                <Route path="/web-authorization" component={WebAuthorization}/>
                            </Can>

                            <Can not I='access' on='settings.compliance.webauth'>
                                <Route path="/web-authorization" component={Error_404}/>
                            </Can>

                        </Suspense>



                        <Route exact path="/" render={() => (
                            <Redirect to="/dashboards/commerce"/>
                        )}/>
                    </>

                    :
                    <AppLogin/>
                }
                <ToastContainer/>
            </Fragment>
        )
    }
};

export default AppMain;
