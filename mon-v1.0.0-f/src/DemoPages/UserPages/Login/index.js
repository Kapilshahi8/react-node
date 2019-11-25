import React, {Component, Fragment} from "react";
import Slider from "../../Components/Slider";

import BlockUi from 'react-block-ui';
import {Link} from 'react-router-dom';
import {Loader} from 'react-loaders';

import axios from 'axios';
import {Button, Col, Form, FormGroup, Input, Label, Row} from 'reactstrap';
import {toast} from 'react-toastify';
import {setting} from '../../../environment';
import Ionicon from 'react-ionicons'
import {toLower} from 'lodash'
import  BrandName  from '../../../assets/utils/images/logo-inverse.png';

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            loading: false,
        };
    }

    onChange = (e) => {
        this.setState({[e.target.name]: e.target.value});
    }
    handleSubmit = (event, history) => {
        this.setState({loading: true})
        event.preventDefault();
        const userData = {
            username: toLower(this.state.email),
            password: this.state.password,
        }
        axios.post(setting.site_Setting.API_URL + 'users/authenticate', userData, {headers: setting.headersparameters}).then(result => {
            this.setState({loading: false})
            localStorage.setItem('userinformation', JSON.stringify(result.data.data[0]));
            localStorage.setItem('user_mon_id', result.data.data[0]['_id']);
            localStorage.setItem('jwttoken', result.data.token);
            toast['success'](result.data.message)
            this.props.history.push('../dashboards/commerce');
            window.location.reload();
        }).catch((error) => {
            this.setState({loading: false})
            if (typeof error.response === 'undefined') {
                toast['error'](error.message)
            } else if (typeof error.response.data.message === 'undefined') {
                toast['error'](error.response.data.data.error_description)
            } else {
                toast['error'](error.response.data.message)
            }
        })
    }

    render() {
        const {email, password} = this.state;
        return (
            <Fragment>
                <BlockUi tag="div" blocking={this.state.loading} className="block-overlay-dark"
                         loader={<Loader color="#ffffff" active type="line-scale"/>}>
                    <div className="h-100">
                        <Row className="h-100 no-gutters">
                            <Col lg="4" className="d-none d-lg-block">
                                <div className="slider-light">
                                    <Slider/>
                                </div>
                            </Col>
                            <Col lg="8" md="12"
                                 className="h-100 d-flex bg-white justify-content-center align-items-center">
                                <Col lg="9" md="10" sm="12" className="mx-auto app-login-box">
                                <div className="app-logo"><img src={BrandName}/></div>
                                    <h4 className="mb-0">
                                        <div>Welcome back,</div>
                                        <span>Please sign in to your account.</span>
                                    </h4>
                                    <h6 className="mt-3">
                                        No account?{' '}
                                        <Link to="register" className="text-primary">Sign up now</Link>
                                    </h6>
                                    <Row className="divider"/>
                                    <div>
                                        <Form onSubmit={this.handleSubmit}>
                                            <Row form>
                                                <Col md={6}>
                                                    <FormGroup>
                                                        <Label for="exampleEmail">Email</Label>
                                                        <Input type="email" value={email} onChange={this.onChange}
                                                               name="email" id="exampleEmail"
                                                               placeholder="Email here..."/>
                                                    </FormGroup>
                                                </Col>
                                                <Col md={6}>
                                                    <FormGroup>
                                                        <Label for="examplePassword">Password</Label>
                                                        <Input type="password" value={password} onChange={this.onChange}
                                                               name="password" id="examplePassword"
                                                               placeholder="Password here..."/>
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            <FormGroup check>
                                                <Input type="checkbox" name="check" id="exampleCheck"/>
                                                <Label for="exampleCheck" check>Keep me logged in</Label>
                                            </FormGroup>
                                            <Row className="divider"/>
                                            <div className="d-flex align-items-center">
                                                <div className="ml-auto">
                                                    <Link to="forgot-password" className="btn-lg btn btn-link">Recover
                                                        Password</Link>{' '}{' '}
                                                    <Button color="primary" size="lg">Login to Dashboard</Button>
                                                </div>
                                            </div>
                                        </Form>
                                        <Row className="mt-3">
                                            <Col md={4}>
                                                <a href={setting.site_Setting.AUTH_DOMAIN + 'authorize?' + setting.site_Setting.AUTH_RESPONSE_TYPE_TOKEN + '&client_id=' + setting.site_Setting.CLIENT_ID + '&connection=google-oauth2&' + '&state=' + setting.site_Setting.SOCIAL_STATE + '&nonce=' + setting.site_Setting.SOCIAL_NONCE + '&redirect_uri=' + setting.site_Setting.REDIRECT_URL}>
                                                    <Button type="submit" block
                                                            className="mb-2 mr-2 btn-shadow btn-gradient-danger p-2"
                                                            size="lg">
                                                        <span className="mr-2"><Ionicon fontSize="18px" color="white"
                                                                                        icon={'logo-google'}/>+</span>
                                                        <label className={"custom-label"}>Login with Google</label>
                                                    </Button>
                                                </a>
                                            </Col>
                                            <Col md={4}>
                                                <a href={setting.site_Setting.AUTH_DOMAIN + 'authorize?' + setting.site_Setting.AUTH_RESPONSE_TYPE_TOKEN + '&client_id=' + setting.site_Setting.CLIENT_ID + '&connection=facebook&state=' + setting.site_Setting.SOCIAL_STATE + '&nonce=' + setting.site_Setting.SOCIAL_NONCE + '&redirect_uri=' + setting.site_Setting.REDIRECT_URL}>
                                                    <Button type="submit" block
                                                            className="mb-2 mr-2 btn-shadow btn-gradient-primary"
                                                            size="lg">
                                                        <span className="mr-2"><Ionicon fontSize="18px" color="white"
                                                                                        icon={'logo-facebook'}/></span>
                                                        <label className={"custom-label"}>Login with Facebook</label>
                                                    </Button>
                                                </a>
                                            </Col>
                                            <Col md={4}>
                                                <a href={setting.site_Setting.AUTH_DOMAIN + 'authorize?' + setting.site_Setting.AUTH_RESPONSE_TYPE_TOKEN + '&client_id=' + setting.site_Setting.CLIENT_ID + '&connection=linkedin&state=' + setting.site_Setting.SOCIAL_STATE + '&nonce=' + setting.site_Setting.SOCIAL_NONCE + '&redirect_uri=' + setting.site_Setting.REDIRECT_URL}>
                                                    <Button type="submit" block
                                                            className="mb-2 mr-2 btn-shadow btn-gradient-primary"
                                                            size="lg">
                                                        <span className="mr-2"><Ionicon fontSize="18px" color="white"
                                                                                        icon={'logo-linkedin'}/></span>
                                                        <label className={"custom-label"}>Login with Linked In</label>
                                                    </Button>
                                                </a>
                                            </Col>
                                        </Row>
                                    </div>
                                </Col>
                            </Col>
                        </Row>
                    </div>
                </BlockUi>
            </Fragment>
        );
    }
}
