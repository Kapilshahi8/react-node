import React, {Fragment, Component} from "react";
import { Link } from 'react-router-dom';
import Slider from "../../Components/Slider";
import SweetAlert from 'sweetalert-react';
import Loader from 'react-loaders';
import BlockUi from 'react-block-ui';
import axios from 'axios';
import { AvForm, AvField} from 'availity-reactstrap-validation';
import {Col, Row, Button} from 'reactstrap';
import { setting } from '../../../environment';

import BrandName from '../../../assets/utils/images/logo-inverse.png';

export default class ForgotPassword extends Component {
    constructor(props){
        super(props);
        // this.submitForgotPassword = this.submitForgotPassword.bind(this);
        this.state={
            email:'',
            message:'',
            loading:false,
        }
    }
    gotoLogin() {
        this.props.history.push('/pages/login')
    }
    isEmpty(obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }
    submitForgotPassword = (event, errors, values) =>{
        this.setState({ errors, values });
        if (this.isEmpty(errors)) {
            this.setState({ loading: true });
            const forgotPasswordInfo = {
                'email':this.state.values.email
            }
            axios.post(setting.site_Setting.API_URL+'users/forgotPassword',forgotPasswordInfo).then(result=>{
                this.setState({message: result.data.message});
                this.setState({ loading: false });
                this.setState({ show: true });
            }).catch(error=>{
                this.setState({message: error.message});
                this.setState({ loading: false })
                this.setState({ show: false });
            })
        }
    }
    render() {
        return (

            <Fragment>
                <BlockUi tag="div" blocking={this.state.loading} className="block-overlay-dark"
                    loader={<Loader color="#ffffff" active type="line-scale" />}>
                    <div className="h-100">
                        <Row className="h-100 no-gutters">
                            <Col lg="4" className="d-none d-lg-block">
                                <div className="slider-light">
                                    <Slider />
                                </div>
                            </Col>
                            <Col lg="8" md="12" className="h-100 d-flex bg-white justify-content-center align-items-center">
                                <Col lg="6" md="8" sm="12" className="mx-auto app-login-box">
                                    <div className="app-logo"><img src={BrandName}/></div>
                                    <h4>
                                        <div>Forgot your Password?</div>
                                        <span>Use the form below to recover it.</span>
                                    </h4>
                                    <div>
                                    <AvForm onSubmit={this.submitForgotPassword}>
                                        <Row>
                                            <Col md="12">
                                                {/* With AvField */}
                                                <AvField name="email" label="Email" type="email" placeholder="Enter registerd Email id" validate={{
                                                    required: { value: true, errorMessage: 'This field is required.' }
                                                }} />
                                            </Col>
                                        </Row>
                                        <div className="mt-4 d-flex align-items-center">
                                                <h6 className="mb-0">
                                                    <Link to="login" className="text-primary">Sign in existing account</Link>
                                                </h6>
                                                <div className="ml-auto">
                                                    <Button color="primary" size="lg">Recover Password</Button>
                                                </div>
                                            </div>
                                    </AvForm>
                                            
                                    </div>
                                </Col>
                            </Col>
                            <SweetAlert
                                title="Good job!"
                                confirmButtonColor=""
                                show={this.state.show}
                                text={this.state.message}
                                type="success"
                                onConfirm={() => this.setState({ show: false }, () => { this.gotoLogin() })}
                            />
                        </Row>
                    </div>
                </BlockUi>
            </Fragment>
        );
    }
}
