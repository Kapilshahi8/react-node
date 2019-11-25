import {Redirect, Route} from 'react-router-dom';
import React, {Component, Fragment, lazy, Suspense} from 'react';
import Loader from 'react-loaders';

const CallBackComponent = lazy(() => import('../../callback'));


const Login = lazy(() => import('../../DemoPages/UserPages/Login'));
const UserPages = lazy(() => import('../../DemoPages/UserPages'));

class AppLogin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAuthenticate: false
        };
    }

    componentDidMount() {
        this.isAuthenticate();
    }

    isAuthenticate() {
        if (localStorage.getItem('jwttoken')) {
            this.setState({isAuthenticate: true})
        }
    }

    render() {
        console.log('auth', this.state.isAuthenticate)
        return (
            <>
                {!this.state.isAuthenticate ?
                    <Fragment>
                        {/* Callbacks */}
                        <Suspense fallback={
                            <div className="loader-container">
                                <div className="loader-container-inner">
                                    <div className="text-center">
                                        <Loader type="ball-grid-beat"/>
                                    </div>
                                    <h6 className="mt-3">
                                        Please wait while we load all the Dashboards examples
                                        <small>Because this is a demonstration, we load at once all the Dashboards
                                            examples. This wouldn't happen in a real live app!</small>
                                    </h6>
                                </div>
                            </div>
                        }>
                            <Route path="/login" component={Login}/>
                        </Suspense>

                        {/* Pages */}

                        <Suspense fallback={
                            <div className="loader-container">
                                <div className="loader-container-inner">
                                    <div className="text-center">
                                        <Loader type="line-scale-party"/>
                                    </div>
                                    <h6 className="mt-3">
                                        Please wait while we load all the Pages examples
                                        <small>Because this is a demonstration we load at once all the Pages examples.
                                            This wouldn't happen in a real live app!</small>
                                    </h6>
                                </div>
                            </div>
                        }>
                            <Route path="/pages" component={UserPages}/>
                        </Suspense>

                        {/* Callbacks */}

                        <Suspense fallback={
                            <div className="loader-container">
                                <div className="loader-container-inner">
                                    <div className="text-center">
                                        <Loader type="ball-grid-beat"/>
                                    </div>
                                    <h6 className="mt-3">
                                        Please wait while we load all the Dashboards examples
                                        <small>Because this is a demonstration, we load at once all the Dashboards
                                            examples. This wouldn't happen in a real live app!</small>
                                    </h6>
                                </div>
                            </div>
                        }>
                            <Route path="/callback" render={(props) => <CallBackComponent {...props} />}/>
                        </Suspense>

                        <Route exact path="/" render={() => (
                            <Redirect to="/pages/login"/>
                        )}/>

                    </Fragment>
                    : <Redirect to="/virtualTerminal/virtual-terminal"/>
                }
            </>
        )
    }
}

export default AppLogin;
