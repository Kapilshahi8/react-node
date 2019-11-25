import React, {Fragment} from 'react';

import {Button, DropdownMenu, DropdownToggle, UncontrolledButtonDropdown} from 'reactstrap';

import {Bounce, toast} from 'react-toastify';


import {faAngleDown,} from '@fortawesome/free-solid-svg-icons';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import city3 from '../../../assets/utils/images/dropdown-header/city3.jpg';

import {setting} from '../../../environment';


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
        if (Array.isArray(JSON.parse(localStorage.userinformation))) {
            localStorage.getItem('userinformation') && this.setState({userInformation: JSON.parse(localStorage.userinformation.substring(1, localStorage.userinformation.length - 1))})
        } else {
            localStorage.getItem('userinformation') && this.setState({userInformation: JSON.parse(localStorage.getItem('userinformation'))})
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
        if (localStorage.userinformation !== null) {
            localStorage.clear();
            window.location.href = setting.site_Setting.AUTH_DOMAIN + 'v2/logout?client_id=' + setting.site_Setting.CLIENT_ID + '&returnTo=' + setting.site_Setting.REDIRECT_AFTER_LOGOUT;
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
                                        <img width={42} className="rounded-circle"
                                             src={this.state.userInformation && this.state.userInformation.picture}
                                             alt=""/>
                                        <FontAwesomeIcon className="ml-2 opacity-8" icon={faAngleDown}/>
                                    </DropdownToggle>
                                    <DropdownMenu right style={{'paddungBottom': '0px'}}
                                                  className="rm-pointers dropdown-menu-lg">
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
                                                                <img width={42} className="rounded-circle"
                                                                     src={this.state.userInformation && this.state.userInformation.picture}
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
                                                                <Button onClick={this.logout}
                                                                        className="btn-pill btn-shadow btn-shine"
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
                                    </DropdownMenu>
                                </UncontrolledButtonDropdown>
                            </div>
                            <div className="widget-content-left  ml-3 header-user-info">
                                <div className="widget-heading">
                                    {this.state.userInformation && this.state.userInformation.name}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default UserBox;
