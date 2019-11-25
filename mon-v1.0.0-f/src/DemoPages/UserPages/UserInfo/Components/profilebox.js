import React, { Component, Fragment } from 'react';
import { Col, ListGroup, ListGroupItem, Card } from 'reactstrap';
import bg3 from '../../../../assets/utils/images/dropdown-header/city4.jpg';
import CountUp from 'react-countup';

export default class ProfileBox extends Component {
    constructor() {
        super();
    }

    render() {
        let {
            userProfilebox,
            userimage
        } = this.props;
        return (
            <Fragment>
                <Col md="4" lg="4" xl="4">
                    <Card className="card-shadow-primary profile-responsive card-border mb-3">
                        <div className="dropdown-menu-header">
                            <div className="dropdown-menu-header-inner bg-focus">
                                <div className="menu-header-image opacity-3"
                                    style={{
                                        backgroundImage: 'url(' + bg3 + ')'
                                    }}
                                />
                                <div className="menu-header-content btn-pane-right">
                                    <div className="avatar-icon-wrapper mr-2 avatar-icon-xl">
                                        <div className="avatar-icon rounded">
                                            <img src={userimage && userimage} alt="Avatar 5" />
                                        </div>
                                    </div>
                                    <div>
                                        <h5 className="menu-header-title">{userProfilebox.name}</h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <ListGroup flush>
                            <ListGroupItem>
                                <div className="widget-content p-0">
                                    <div className="widget-content-wrapper">
                                        <div className="widget-content-left">
                                            <div className="widget-heading">
                                                Total Available Balance
                                                    </div>
                                        </div>
                                        <div className="widget-content-right">
                                            <div className="widget-numbers widget-numbers-sm text-primary">
                                                <CountUp start={0}
                                                    end={764.2}
                                                    separator=""
                                                    decimals={0}
                                                    decimal=","
                                                    prefix=""
                                                    duration="20" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </ListGroupItem>
                        </ListGroup>
                    </Card>
                </Col>
            </Fragment>

        )
    }
}