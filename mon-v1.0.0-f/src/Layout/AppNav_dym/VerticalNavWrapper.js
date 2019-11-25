import React, {Component, Fragment} from 'react';
import {withRouter} from 'react-router-dom';

import MetisMenu from 'react-metismenu';

import {MainNav} from './NavItems';
import {connect} from 'react-redux';

class Nav extends Component {

    state = {
        mainNav: []
    };

    componentWillMount() {
        const items = MainNav()
        this.setState({mainNav: items})
    }

    componentWillReceiveProps(nextProps, nextContext) {
        const items = MainNav()
        this.setState({mainNav: items})
    }


    render() {
        return (
            <Fragment>
                <h5 className="app-sidebar__heading">Main Menu</h5>
                {/* <Link to="/VirtualTerminal/virtual-terminal">Virtual Terminal</Link> */}
                <MetisMenu content={this.state.mainNav} activeLinkFromLocation className="vertical-nav-menu"
                           iconNamePrefix=""
                           classNameStateIcon="pe-7s-angle-down"/>
                {/* <h5 className="app-sidebar__heading">UI Components</h5>
                <MetisMenu content={ComponentsNav} activeLinkFromLocation className="vertical-nav-menu" iconNamePrefix="" classNameStateIcon="pe-7s-angle-down"/>
                <h5 className="app-sidebar__heading">Dashboard Widgets</h5>
                <MetisMenu content={WidgetsNav} activeLinkFromLocation className="vertical-nav-menu" iconNamePrefix="" classNameStateIcon="pe-7s-angle-down"/>
                <h5 className="app-sidebar__heading">Forms</h5>
                <MetisMenu content={FormsNav} activeLinkFromLocation className="vertical-nav-menu" iconNamePrefix="" classNameStateIcon="pe-7s-angle-down"/>
                <h5 className="app-sidebar__heading">Charts</h5>
                <MetisMenu content={ChartsNav} activeLinkFromLocation className="vertical-nav-menu" iconNamePrefix="" classNameStateIcon="pe-7s-angle-down"/> */}
            </Fragment>
        );
    }

    isPathActive(path) {
        return this.props.location.pathname.startsWith(path);
    }
}

const mapStateToProps = state => ({
    roleUpdated: state.ThemeOptions.roleUpdated
})

export default withRouter(connect(mapStateToProps, null)(Nav))

//export default (Nav);
