import React, {Fragment} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {Card, CardBody, CardTitle, Col, Container, Row} from 'reactstrap';
import {connect} from 'react-redux';

import AppHeader from '../../Layout/AppHeader/';
import AppSidebar from '../../Layout/AppSidebar/';
import AppFooter from '../../Layout/AppFooter/';


import {permissionUpdated} from '../../reducers/ThemeOptions';
import ThemeOptions from '../../Layout/ThemeOptions/';
import {setting} from '../../environment';
import axios from 'axios'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";


import {faCopy,} from '@fortawesome/free-solid-svg-icons';


class IntegrationsPage extends React.Component {
    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.copyToClipBoard = this.copyToClipBoard.bind(this);
        this.rewokeToken = this.rewokeToken.bind(this);

        this.state = {
            API: false,
            show: false
        }
    }

    componentDidMount() {
        axios.get(setting.site_Setting.API_URL + 'users/' + localStorage.getItem('user_mon_id') + '/getApplicationInfo').then((result) => {
            this.setState({API: result.data.body})
        }).catch(error => {

        })
    }

    handleSubmit(event, errors, values) {
        this.setState({show: true})
    }

    rewokeToken() {

        const options = {
            headers: {'x-access-token': localStorage.getItem('jwttoken')}
        };

        axios.post(setting.site_Setting.API_URL + 'users/revokeToken', {'userId': localStorage.getItem('user_mon_id')}, options).then((result) => {
            this.setState({API: result.data.body})
        }).catch(error => {

        })
    }

    copyToClipBoard(text) {

        const el = document.createElement('textarea')
        el.value = text;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el)
    }

    render() {
        return (
            <Fragment>
                <ThemeOptions/>
                <AppHeader/>
                <div className="app-main">
                    <AppSidebar/>
                    <div className="app-main__outer">
                        <div className="app-main__inner">
                            <ReactCSSTransitionGroup
                                component="div"
                                transitionName="TabsAnimation"
                                transitionAppear={true}
                                transitionAppearTimeout={0}
                                transitionEnter={false}
                                transitionLeave={false}>
                                <Container fluid>
                                    <Card className="main-card mb-3">
                                        <CardBody>
                                            <CardTitle>Integrations</CardTitle>
                                            <Row>
                                                <Col md="12">
                                                    <Row>
                                                        <Col md="6">
                                                            <div className="integrationBox">
                                                                <Row>
                                                                    <Col sm="6" md="6">
                                                                        <span className="int-name">API</span>
                                                                    </Col>
                                                                    <Col sm="6" md="6">
                                                                        {this.state.API &&
                                                                        <span className="int-status">Connected</span>}
                                                                    </Col>
                                                                </Row>
                                                                <Row>
                                                                    <Col md="12">
                                                                        <p className="int-desc">
                                                                            The Monarch API allows you to access all
                                                                            your Monarch data programatically,
                                                                            as well as make changes
                                                                        </p>
                                                                    </Col>
                                                                </Row>
                                                                <Row>
                                                                    <Col md="12">

                                                                        {!this.state.API &&
                                                                        <div className="addToken"
                                                                             onClick={this.rewokeToken}>
                                                                            Create Token
                                                                        </div>}


                                                                        {!this.state.show && this.state.API &&
                                                                        <span onClick={this.handleSubmit}
                                                                              className='see-current'>See Keys</span>
                                                                        }
                                                                        {this.state.show && this.state.API &&
                                                                        <div className="keyData">
                                                                            <div>
                                                                                <span
                                                                                    className="tbname">Name:</span><span>{this.state.API.app_name}</span>
                                                                            </div>
                                                                            <div>
                                                                                <span className="tbname">API KEY:</span><span><i>{this.state.API.api_key}</i><FontAwesomeIcon
                                                                                className="copy-icn ml-2 opacity-5"
                                                                                onClick={() => {
                                                                                    this.copyToClipBoard(this.state.API.api_key)
                                                                                }}
                                                                                icon={faCopy}/></span>
                                                                            </div>
                                                                            <div>
                                                                                <span
                                                                                    className="tbname">APP ID:</span><span><i
                                                                                className="appid">{this.state.API.app_id}</i><FontAwesomeIcon
                                                                                className="copy-icn ml-2 opacity-5"
                                                                                onClick={() => {
                                                                                    this.copyToClipBoard(this.state.API.app_id)
                                                                                }}
                                                                                icon={faCopy}/></span>
                                                                            </div>
                                                                            <div><span onClick={this.rewokeToken} className="revokeToken">Revoke Token</span></div>
                                                                        </div>
                                                                        }


                                                                    </Col>
                                                                </Row>
                                                                <Row>
                                                                    {/*<!--pe-7s-copy-file--><Col sm="6" md="6">*/}
                                                                    {/*<button>Revoke</button>*/}
                                                                    {/*</Col>*/}
                                                                </Row>
                                                            </div>
                                                        </Col>
                                                        <Col md="6">
                                                            <div className="integrationBox">
                                                                <Row>
                                                                    <Col md="6">
                                                                        <span className="int-name"></span>
                                                                    </Col>
                                                                    <Col md="6">
                                                                            <span
                                                                                className="int-status"></span>
                                                                    </Col>
                                                                </Row>
                                                                <Row>
                                                                    <Col md="12">
                                                                        <p className="int-desc soon">
                                                                            More integration coming soon...
                                                                        </p>
                                                                    </Col>
                                                                </Row>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                            <div className='splitter'></div>

                                        </CardBody>
                                    </Card>
                                </Container>
                            </ReactCSSTransitionGroup>
                        </div>
                        <AppFooter/>
                    </div>
                </div>
            </Fragment>
        );
    }
}

const
    mapDispatchToProps = dispatch => ({
        permissionUpdated: () => dispatch(permissionUpdated())

    })

export default connect(
    null
    ,
    mapDispatchToProps
)(
    IntegrationsPage
)
