import React, {Fragment} from 'react';
import Ionicon from 'react-ionicons';

import PerfectScrollbar from 'react-perfect-scrollbar';

import {
    DropdownToggle, DropdownMenu,
    Nav, Col, Row, Button, NavItem, NavLink,
    UncontrolledTooltip, UncontrolledButtonDropdown
} from 'reactstrap';

import {
    toast,
    Bounce
} from 'react-toastify';


import {
    faAngleDown,

} from '@fortawesome/free-solid-svg-icons';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import city3 from '../../../assets/utils/images/dropdown-header/city3.jpg';

import { setting } from '../../../environment';


class UserBox extends React.Component {
    constructor(props) {
        super(props);
        this.logout = this.logout.bind(this);
        this.state = {
            active: false,
            userInformation: null,
        };
        // this.userInformation = JSON.parse(localStorage.userInformation);
    }

    componentDidMount() {
        if(Array.isArray(JSON.parse(localStorage.userinformation))){
            localStorage.getItem('userinformation') && this.setState({userInformation:JSON.parse(localStorage.userinformation.substring(1, localStorage.userinformation.length-1))})
        } else {
            localStorage.getItem('userinformation') && this.setState({userInformation:JSON.parse(localStorage.getItem('userinformation'))})
        }
    }


    notify2 = () => this.toastId = toast("You don't have any new items in your calendar for today! Go out and play!", {
        transition: Bounce,
        closeButton: true,
        autoClose: 5000,
        position: 'bottom-center',
        type: 'success'
    });

    logout() {
        if(localStorage.userinformation !== null) {
            localStorage.clear();
            window.location.href=setting.site_Setting.AUTH_DOMAIN+'v2/logout?client_id='+setting.site_Setting.CLIENT_ID+'&returnTo='+setting.site_Setting.REDIRECT_AFTER_LOGOUT;
        }
    }

    render() {

        return (
            <Fragment>
                <div className="header-btn-lg pr-0">
                    <div className="widget-content p-0">
                        <div className="widget-content-wrapper">
                            <div className="widget-content-left">
                                <UncontrolledButtonDropdown>
                                    <DropdownToggle color="link" className="p-0">
                                        <img width={42} className="rounded-circle" src={this.state.userInformation && this.state.userInformation.picture} alt=""/>
                                        <FontAwesomeIcon className="ml-2 opacity-8" icon={faAngleDown}/>
                                    </DropdownToggle>
                                    <DropdownMenu right className="rm-pointers dropdown-menu-lg">
                                        <div className="dropdown-menu-header">
                                            <div className="dropdown-menu-header-inner bg-info">
                                                <div className="menu-header-image opacity-2"
                                                     style={{
                                                         backgroundImage: 'url(' + city3 + ')'
                                                     }}
                                                /> 
                                                <div className="menu-header-content text-left">
                                                    <div className="widget-content p-0">
                                                        <div className="widget-content-wrapper">
                                                            <div className="widget-content-left mr-3">
                                                                <img width={42} className="rounded-circle" src={this.state.userInformation && this.state.userInformation.picture}
                                                                     alt=""/>
                                                            </div>
                                                            <div className="widget-content-left">
                                                                <div className="widget-heading">
                                                                    {this.state.userInformation && this.state.userInformation.name}
                                                                </div>
                                                                <div className="widget-subheading opacity-8">
                                                                    {this.state.userInformation && this.state.userInformation.email}
                                                                </div>
                                                            </div>
                                                            <div className="widget-content-right mr-2">
                                                                <Button onClick={this.logout} className="btn-pill btn-shadow btn-shine"
                                                                        color="focus">
                                                                    Logout
                                                                </Button>
                                                                {/* <Link to="/pages/login" className="btn-pill btn-shadow btn-shine btn btn-focus"
                                                                        color="focus" >Logout</Link> */}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="scroll-area-xs" style={{
                                            height: '150px'
                                        }}>
                                            <PerfectScrollbar>
                                                <Nav vertical>
                                                    <NavItem className="nav-item-header">
                                                        Activity
                                                    </NavItem>
                                                    {/* <NavItem>
                                                        <NavLink >
                                                            Chat
                                                            <div className="ml-auto badge badge-pill badge-info">8</div>
                                                        </NavLink>
                                                    </NavItem> */}
                                                    <NavItem>
                                                        <NavLink >Recover Password</NavLink>
                                                    </NavItem>
                                                    {/* <NavItem className="nav-item-header">
                                                        My Account
                                                    </NavItem> */}
                                                    {/* <NavItem>
                                                        <NavLink >
                                                            Settings
                                                            <div className="ml-auto badge badge-success">New</div>
                                                        </NavLink>
                                                    </NavItem> */}
                                                    {/* <NavItem>
                                                        <NavLink >
                                                            Messages
                                                            <div className="ml-auto badge badge-warning">512</div>
                                                        </NavLink>
                                                    </NavItem>
                                                    <NavItem>
                                                        <NavLink >
                                                            Logs
                                                        </NavLink>
                                                    </NavItem> */}
                                                </Nav>
                                            </PerfectScrollbar>
                                        </div>
                                        <Nav vertical>
                                            <NavItem className="nav-item-divider mb-0"/>
                                        </Nav>
                                        <div className="grid-menu grid-menu-2col">
                                            <Row className="no-gutters">
                                                <Col sm="6">
                                                    <Button
                                                        className="btn-icon-vertical btn-transition btn-transition-alt pt-2 pb-2"
                                                        outline color="warning">
                                                        <i className="pe-7s-chat icon-gradient bg-amy-crisp btn-icon-wrapper mb-2"> </i>
                                                        Message Inbox
                                                    </Button>
                                                </Col>
                                                <Col sm="6">
                                                    <Button
                                                        className="btn-icon-vertical btn-transition btn-transition-alt pt-2 pb-2"
                                                        outline color="danger">
                                                        <i className="pe-7s-ticket icon-gradient bg-love-kiss btn-icon-wrapper mb-2"> </i>
                                                        <b>Support Tickets</b>
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </div>
                                        {/* <Nav vertical>
                                            <NavItem className="nav-item-divider"/>
                                            <NavItem className="nav-item-btn text-center">
                                                <Button size="sm" className="btn-wide" color="primary">
                                                    Open Messages
                                                </Button>
                                            </NavItem>
                                        </Nav> */}
                                    </DropdownMenu>
                                </UncontrolledButtonDropdown>
                            </div>
                            <div className="widget-content-left  ml-3 header-user-info">
                                <div className="widget-heading">
                                {this.state.userInformation && this.state.userInformation.name}
                                </div>
                            </div>

                            <div className="widget-content-right header-user-info ml-3">
                                <Button className="btn-shadow p-1" size="sm" onClick={this.notify2} color="info"
                                        id="Tooltip-1">
                                    <Ionicon color="#ffffff" fontSize="20px" icon="ios-calendar-outline"/>
                                </Button>
                                <UncontrolledTooltip placement="bottom" target={'Tooltip-1'}>
                                    Click for Toastify Notifications!
                                </UncontrolledTooltip>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default UserBox;