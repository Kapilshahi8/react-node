import React from 'react';
import ReactDOM from 'react-dom';

import * as serviceWorker from './serviceWorker';

import {  BrowserRouter as Router, HashRouter } from 'react-router-dom';
import './assets/base.scss';
import Main from './DemoPages/Main';
import configureStore from './config/configureStore';
import { Provider } from 'react-redux';

const store = configureStore();
const rootElement = document.getElementById('root');

const renderApp = Component => {
    if(window.location.pathname === '/callback'){
        ReactDOM.render(
            <Provider store={store}>
                <Router>
                    <Component />
                </Router>
            </Provider>,
            rootElement
        );
    } else {
        ReactDOM.render(
            <Provider store={store}>
                <HashRouter>
                    <Component />
                </HashRouter>
            </Provider>,
            rootElement
        );
    }
    
};

renderApp(Main);

if (module.hot) {
    module.hot.accept('./DemoPages/Main', () => {
        const NextApp = require('./DemoPages/Main').default;
        renderApp(NextApp);
    });
}
serviceWorker.unregister();

