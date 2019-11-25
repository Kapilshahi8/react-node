import React, {Component, Fragment} from "react";
import Slider from "../../Components/Slider";
import SweetAlert from 'sweetalert-react';
import {Link} from 'react-router-dom';
import {Button, Col, CustomInput, FormGroup, Row,} from 'reactstrap';
import axios from 'axios';
import Loader from 'react-loaders';
import BlockUi from 'react-block-ui';

import {AvField, AvForm, AvInput,} from 'availity-reactstrap-validation';
import {setting} from '../../../environment';
import {toast} from 'react-toastify';
import BrandName from '../../../assets/utils/images/logo-inverse.png';
import Ionicon from 'react-ionicons';
import {toLower} from 'lodash'

const faker = require('faker');
const registrationForm = {
    fname: faker.name.firstName(),
    lname: faker.name.lastName(),
    compName: faker.company.companyName(),
    emailAdd: faker.internet.email(),
    usercountry: faker.address.country(),
    userState: faker.address.state(),
    userZip: faker.address.zipCode()
}


export default class Register extends Component {
    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {
            fname: '',
            lname: '',
            email: '',
            password: '',
            confPass: '',
            country: '',
            state: '',
            zip: '',
            title: '',
            loading: false,
        };
    }


    onChange = (e) => {
        this.setState({[e.target.name]: e.target.value});
    }

    isEmpty(obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }

    handleSubmit = (event, errors, values) => {
        this.setState({errors, values});

        if (this.isEmpty(errors)) {
            this.setState({loading: true})
            const userData = {
                email: toLower(this.state.values.email),
                password: this.state.values.password,
                name: this.state.values.fname + ' ' + this.state.values.lname,
                user_metadata: {
                    companyName: this.state.values.cName,
                    country: this.state.values.country,
                    state: this.state.values.state,
                    zip: this.state.values.zip,
                    source: 'Actum'
                }
            }
            axios.post(setting.site_Setting.API_URL + 'users/register', userData, {headers: setting.headersparameters}).then(result => {
                this.setState({loading: false});
                this.setState({show: true});
            }).catch((error) => {
                this.setState({loading: false});
                this.setState({show: false});
                console.log(error.response);
                if (error.response != null) {
                    // toast['error'](error.response.data.data.error_description);
                } else {
                    toast['error'](error.message);
                }
            })
        }

    }

    gotoLogin() {
        this.props.history.push('/pages/login')
    }

    render() {
        return (
            <Fragment>
                <BlockUi tag="div" blocking={this.state.loading} className="block-overlay-dark"
                         loader={<Loader color="#ffffff" active type="line-scale"/>}>
                    <div className="h-100">
                        <Row className="h-100 no-gutters">
                            <Col lg="8" md="12"
                                 className="h-100 d-md-flex d-sm-block bg-white justify-content-center align-items-center">
                                <Col lg="9" md="10" sm="12" className="mx-auto app-login-box">
                                    <div className="app-logo"/>
                                    <div className="app-logo"><img src={BrandName}/></div>
                                    <h4>
                                        <div>Welcome,</div>
                                        <span>It only takes a <span className="text-success">few seconds</span> to create your account</span>
                                    </h4>
                                    <div>
                                        <AvForm onSubmit={this.handleSubmit}>
                                            <Row form>
                                                <Col md={6}>
                                                    <FormGroup>
                                                        <AvField name="fname" label="First Name" type="text"
                                                                 placeholder="First Name" value={registrationForm.fname}
                                                                 validate={{
                                                                     required: {
                                                                         value: true,
                                                                         errorMessage: 'This field is required.'
                                                                     },
                                                                     pattern: {
                                                                         value: '^[A-Za-z0-9]+$',
                                                                         errorMessage: 'Your name must be composed only with letter and numbers'
                                                                     },
                                                                     minLength: {
                                                                         value: 3,
                                                                         errorMessage: 'Your name must be between 3 and 16 characters'
                                                                     },
                                                                     maxLength: {
                                                                         value: 16,
                                                                         errorMessage: 'Your name must be between 6 and 16 characters'
                                                                     }
                                                                 }}/>
                                                    </FormGroup>
                                                </Col>
                                                <Col md={6}>
                                                    <FormGroup>
                                                        <AvField name="lname" label="Last Name" type="text"
                                                                 placeholder="Last Name" value={registrationForm.lname}
                                                                 validate={{
                                                                     required: {
                                                                         value: true,
                                                                         errorMessage: 'This field is required.'
                                                                     },
                                                                     pattern: {
                                                                         value: '^[A-Za-z0-9]+$',
                                                                         errorMessage: 'Your name must be composed only with letter and numbers'
                                                                     },
                                                                     minLength: {
                                                                         value: 3,
                                                                         errorMessage: 'Your name must be between 3 and 16 characters'
                                                                     },
                                                                     maxLength: {
                                                                         value: 16,
                                                                         errorMessage: 'Your name must be between 6 and 16 characters'
                                                                     }
                                                                 }}/>
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            <Row form>
                                                <Col md={6}>
                                                    <FormGroup>
                                                        <AvField name="cName" label="Company Name" type="text"
                                                                 value="Enterprises"
                                                                 placeholder={registrationForm.compName} validate={{
                                                            required: {
                                                                value: true,
                                                                errorMessage: 'This field is required'
                                                            }
                                                        }}/>
                                                    </FormGroup>
                                                </Col>
                                                <Col md={6}>
                                                    <FormGroup>
                                                        <AvField name="email" label="Email Address" type="email"
                                                                 value={registrationForm.emailAdd}
                                                                 placeholder="Email Address" validate={{
                                                            required: {
                                                                value: true,
                                                                errorMessage: 'This field is required'
                                                            }
                                                        }}/>
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            <Row form>
                                                <Col md={6}>
                                                    <FormGroup>
                                                        <AvField name="password" label="Password" type="password"
                                                                 value="Kapil@#321" placeholder="Enter the Password"
                                                                 validate={{
                                                                     required: {
                                                                         value: true,
                                                                         errorMessage: 'This field is required'
                                                                     },
                                                                     pattern: {
                                                                         value: '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})',
                                                                         errorMessage: 'Please fill the required format.'
                                                                     }
                                                                 }}/>
                                                    </FormGroup>
                                                </Col>
                                                <Col md={6}>
                                                    <FormGroup>
                                                        <AvField name="confPassword" label="Confirm Password"
                                                                 type="password" value="Kapil@#321"
                                                                 placeholder="Re-enter Password" validate={{
                                                            required: {
                                                                value: true,
                                                                errorMessage: 'This field is required'
                                                            },
                                                            match: {
                                                                value: 'password',
                                                                errorMessage: 'Password does not match.'
                                                            }
                                                        }}/>
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            <Row form>
                                                <Col md={4}>
                                                    <FormGroup>
                                                        <AvField name="country" label="Country" type="text"
                                                                 placeholder="Country"
                                                                 value={registrationForm.usercountry} validate={{
                                                            required: {
                                                                value: true,
                                                                errorMessage: 'This field is required.'
                                                            }
                                                        }}/>
                                                    </FormGroup>
                                                </Col>
                                                <Col md={4}>
                                                    <FormGroup>
                                                        <AvField name="state" label="State" type="text"
                                                                 placeholder="Enter State"
                                                                 value={registrationForm.userState} validate={{
                                                            required: {
                                                                value: true,
                                                                errorMessage: 'This field is required.'
                                                            }
                                                        }}/>
                                                    </FormGroup>
                                                </Col>
                                                <Col md={4}>
                                                    <FormGroup>
                                                        <AvField name="zip" label="Zip" type="text"
                                                                 placeholder="Enter Zip"
                                                                 value={registrationForm.userZip} validate={{
                                                            required: {
                                                                value: true,
                                                                errorMessage: 'This field is required.'
                                                            }
                                                        }}/>
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            <FormGroup className="mt-3" check>
                                                <AvInput tag={CustomInput} type="checkbox" name="customCheckbox"
                                                         label="Accept our Terms and Conditions" required/>
                                            </FormGroup>
                                            <div className="mt-4 d-flex align-items-center">
                                                <h5 className="mb-0">
                                                    Already have an account?{' '}
                                                    <Link to="login" className="text-primary">Sign in</Link>
                                                </h5>
                                                <div className="ml-auto">
                                                    <Button color="primary" type="submit"
                                                            className="btn-wide btn-pill btn-shadow btn-hover-shine"
                                                            size="lg">Create Account</Button>
                                                </div>
                                            </div>
                                        </AvForm>
                                    </div>
                                    <Row>
                                        <Col md="12">
                                            <h5 className="mb-0">
                                                Try Social Sign up
                                            </h5>
                                        </Col>
                                    </Row>
                                    <Row className="mt-3">
                                        <Col md="6">
                                            <a href={setting.site_Setting.AUTH_DOMAIN + 'authorize?response_type=id_token&client_id=' + setting.site_Setting.CLIENT_ID + '&connection=google-oauth2&redirect_uri=' + setting.site_Setting.REDIRECT_URL + '&state=kgyXZsJHdLzc.DOXVFvRvoPRHC7C~30x&nonce=cml_2wr8G_JnOTdehLMsxHex.1F5223.'}>
                                                <Button type="submit" block
                                                        className="mb-2 mr-2 btn-shadow btn-gradient-danger p-2"
                                                        size="lg">
                                                    <span className="mr-2"><Ionicon fontSize="18px" color="white"
                                                                                    icon={'logo-google'}/>+</span>
                                                    <label className={"custom-label"}>Login with Google</label>
                                                </Button>
                                            </a>
                                        </Col>
                                        <Col md="6">
                                            <a href={setting.site_Setting.AUTH_DOMAIN + 'authorize?' + setting.site_Setting.AUTH_RESPONSE_TYPE_TOKEN + '&client_id=' + setting.site_Setting.CLIENT_ID + '&connection=facebook&redirect_uri=' + setting.site_Setting.REDIRECT_URL + '&state=kgyXZsJHdLzc.DOXVFvRvoPRHC7C~30x&nonce=cml_2wr8G_JnOTdehLMsxHex.1F5223.'}>
                                                <Button type="submit" block
                                                        className="mb-2 mr-2 btn-shadow btn-gradient-primary" size="lg">
                                                    <span className="mr-2"><Ionicon fontSize="18px" color="white"
                                                                                    icon={'logo-facebook'}/></span>
                                                    <label className={"custom-label"}>Login with Facebook</label>
                                                </Button>
                                            </a>
                                        </Col>
                                    </Row>

                                </Col>
                            </Col>
                            <Col lg="4" className="d-none d-lg-block">
                                <div className="slider-light">
                                    <Slider/>
                                </div>
                            </Col>
                            <SweetAlert
                                title="Good job!"
                                confirmButtonColor=""
                                show={this.state.show}
                                text="You Registered Successfully"
                                type="success"
                                onConfirm={() => this.setState({show: false}, () => {
                                    this.gotoLogin()
                                })}
                            />
                        </Row>
                    </div>
                </BlockUi>
            </Fragment>
        );
    }
}

