import React, {Component, Fragment} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import PageTitle from '../../../Layout/AppMain/PageTitle';

// Examples
import CommerceDashboard1 from './Examples/Variation1';

export default class CommerceDashboard extends Component {

    render() {
        return (
            <Fragment>
                <ReactCSSTransitionGroup
                    component="div"
                    transitionName="TabsAnimation"
                    transitionAppear={true}
                    transitionAppearTimeout={0}
                    transitionEnter={false}
                    transitionLeave={false}>
                    <PageTitle
                        heading="Monarch Dashboard"
                        subheading="Welcome to the monarch dashboard."
                        icon="pe-7s-graph icon-gradient bg-ripe-malin"
                        childPageName="Commerce"
                        parentPageName="Dashboard"
                    />
                        <CommerceDashboard1/>
                </ReactCSSTransitionGroup>
            </Fragment>
        )
    }
}
