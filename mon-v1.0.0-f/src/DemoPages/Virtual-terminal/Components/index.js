import React, { Fragment } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {
    Col, Row, Card, CardBody,
    CardTitle, Button, FormGroup, Container, InputGroup, InputGroupAddon
} from 'reactstrap';
import PageTitle from '../../../Layout/AppMain/PageTitle';
import {faCalendarAlt,} from '@fortawesome/free-solid-svg-icons';
import {submitvalue} from './virtualModel';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import DatePicker from 'react-datepicker';
import Loader from 'react-loaders';
import BlockUi from 'react-block-ui';
import { AvForm, AvField,AvInput  } from 'availity-reactstrap-validation';
import Axios from 'axios';
import { setting } from '../../../environment';
import { toast } from 'react-toastify';
import brnv from "bank-routing-number-validator";
const options = [
    {value: 'us', label: 'US'}
];
const faker = require('faker');

const formOption = {
        companyName: faker.company.companyName(),
        custName: faker.name.findName(),
        custphone:Math.floor(100000000 + Math.random() * 900000000),
        custEmail:faker.internet.exampleEmail(),
        custAddress1:faker.address.streetAddress(),
        custAddress2:faker.address.secondaryAddress(),
        custCity:faker.address.city(),
        custZipCode:faker.address.zipCode(),
        custSsn:Math.floor(Math.random() * 9999),
        custinitialAmount:Math.floor(Math.random() * 9)+'.00'
    }

export default class VirtualTerminalinnerpage extends React.Component {
    constructor(props) {
        super(props);
        const day = new Date();
        const nextDay = new Date(day);
        nextDay.setDate(day.getDate()+1);
        this.state = {
            loading:false,
            startDate: new Date(nextDay),
            selectedOption: null,
            showHidefield:true,
            adjust:'col-md-12',
            clientHostName:window.location.href.split('#')[0]
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(date) {
        this.setState({
            startDate: date
        });
    }
    submitVirtualTerminalForm=(event, errors, values)=>{
        this.setState({ errors, values });
        if(this.state.errors.length <= 0){
            this.setState({'loading': true});
            //customer information
            submitvalue.userInfo = localStorage.userinformation;
            submitvalue.customerInformation.companyName = this.state.values.cName
            submitvalue.customerInformation.customerName = this.state.values.custName
            submitvalue.customerInformation.customerPhone = this.state.values.cphone
            submitvalue.customerInformation.customerEmail = this.state.values.cemail
            submitvalue.customerInformation.address1 = this.state.values.add1
            submitvalue.customerInformation.address2 = this.state.values.add2
            submitvalue.customerInformation.city = this.state.values.city
            submitvalue.customerInformation.stateProvince = this.state.values.state_province
            submitvalue.customerInformation.zipCode = this.state.values.zipCode
            submitvalue.customerInformation.last_4ssn = this.state.values.lastssn
            // //payment information
            submitvalue.paymentInformation.accountNumber = this.state.values.accnum;
            submitvalue.paymentInformation.routingNumber = this.state.values.routnum;
            submitvalue.paymentInformation.accountType = this.state.values.bankacctype;
            // //billing information
            submitvalue.billingInformation.transactType = this.state.values.transType;
            submitvalue.billingInformation.retryAmount = this.state.values.retryAmount && this.state.values.retryAmount != null ? this.state.values.retryAmount : '00.00';
            submitvalue.billingInformation.initialAmount = this.state.values.initialAmount;
            submitvalue.billingInformation.recurringAmount = this.state.values.reccAmount;
            submitvalue.billingInformation.numofdaysRecurredBillings = this.state.values.recBilling;
            submitvalue.billingInformation.maxnumofBillings = this.state.values.maxBill;
            submitvalue.billingInformation.billingCycle = this.state.values.billcyc;
            submitvalue.billingInformation.futureInitialDate = this.state.startDate;
            submitvalue.capture_type = this.state.values.capture_type;
            // //other information
            submitvalue.otherInformation.orderdCustomerName = this.state.values.cusnumber;
            submitvalue.otherInformation.customerComment = this.state.values.commorder;
            submitvalue.clientHostName = this.state.clientHostName;
            Axios.post(setting.site_Setting.API_URL+'virtualTerminal/submitData',submitvalue, {headers: setting.jwtTokenHeader}).then(data=>{
                this.setState({'loading':false});
                toast['success']('Your transaction has been submitted successfully');
                // this.form && this.form.reset();
                formOption.custName = faker.name.findName()
                this.setState({adjust:'col-md-12'});
                this.setState({showHidefield:true});
            }).catch(error=>{
                this.setState({'loading':false});
                if(error.response !== undefined){
                    toast['error'](error.response.data.message);
                } else {
                    toast['error'](error.message);
                }
            })
        }
    }
    customSlected(){
        console.log(this)
    }
    render() {
        return (
            <Fragment>
                <BlockUi tag="div" blocking={this.state.loading} className="block-overlay-dark"
                    loader={<Loader color="#ffffff" active type="line-scale" />}>
                    <ReactCSSTransitionGroup
                        component="div"
                        transitionName="TabsAnimation"
                        transitionAppear={true}
                        transitionAppearTimeout={0}
                        transitionEnter={false}
                        transitionLeave={false}>
                            <div>
                                <PageTitle
                                    heading="Terminal Form"
                                    subheading="Fill all the required details."
                                    icon="pe-7s-pen icon-gradient bg-tempting-azure"
                                    childPageName="Terminal Form"
                                    parentPageName="Virtual Terminal"
                                />
                            </div>
                        <Container fluid>
                            <Card className="main-card mb-3">
                                <CardBody>
                                    <CardTitle>Virtual Terminal</CardTitle>
                                        <AvForm  ref={c => (this.form = c)} onSubmit={this.submitVirtualTerminalForm}>
                                            <Row>
                                                {/* Customer Information */}

                                                <Col md="12">
                                                    <Row>
                                                        <Col md="12">
                                                            <p className={"menu-header-title text-capitalize mb-2 mt-2"}>Customer Information</p>
                                                            {/* Customer Information */}

                                                            <Row>
                                                                <Col md="6">
                                                                <AvField value={formOption.companyName} name="cName" label="Company Name" type="text" placeholder="Company Name" validate={{
                                                                    required: { value: true, errorMessage: 'This field is required.' },
                                                                    minLength: { value: 3, errorMessage: 'Your name must be between 3 and 16 characters' },
                                                                    maxLength: { value: 90, errorMessage: 'Your name must be between 6 and 16 characters' }
                                                                }} />
                                                                </Col>
                                                                <Col md="6">
                                                                <AvField value={formOption.custName} name="custName" label="Customer Name" type="text" placeholder="Customer Name" validate={{
                                                                    required: { value: true, errorMessage: 'This field is required.' },
                                                                    minLength: { value: 3, errorMessage: 'Your name must be between 3 and 16 characters' },
                                                                    maxLength: { value: 96, errorMessage: 'Your name must be between 6 and 16 characters' }
                                                                }} />
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col md="6">
                                                                <AvField value={formOption.custphone} name="cphone" label="Customer Phone" type="text" placeholder="Customer Phone" validate={{
                                                                    required: { value: true, errorMessage: 'This field is required.' },
                                                                }} />
                                                                </Col>
                                                                <Col md="6">
                                                                <AvField value={formOption.custEmail} name="cemail" label="Customer Email" type="email" placeholder="Customer Email" validate={{
                                                                    required: { value: true, errorMessage: 'This field is required.' }
                                                                }} />
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col md="12">
                                                                <AvField value={formOption.custAddress1} name="add1" label="Address 1" type="text" placeholder="Address" validate={{
                                                                    required: { value: true, errorMessage: 'This field is required.' },
                                                                    minLength: { value: 3, errorMessage: 'Your name must be between 3 and 16 characters' },
                                                                    maxLength: { value: 66, errorMessage: 'Your name must be between 6 and 16 characters' }
                                                                }} />
                                                                </Col>
                                                                <Col md="12">
                                                                    <AvField value={formOption.custAddress2} name="add2" label="Address 2" type="text" placeholder="Address" validate={{
                                                                        required: { value: true, errorMessage: 'This field is required.' },
                                                                        minLength: { value: 3, errorMessage: 'Your name must be between 3 and 16 characters' },
                                                                        maxLength: { value: 66, errorMessage: 'Your name must be between 6 and 16 characters' }
                                                                    }} />
                                                                </Col>
                                                                <Col md={6}>
                                                                    <FormGroup>
                                                                    <AvField value={formOption.custCity} name="city" label="City" type="text" placeholder="City" validate={{
                                                                        required: { value: true, errorMessage: 'This field is required.' },
                                                                        minLength: { value: 3, errorMessage: 'Your name must be between 3 and 16 characters' },
                                                                        maxLength: { value: 56, errorMessage: 'Your name must be between 6 and 16 characters' }
                                                                    }} />
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md={6}>
                                                                    <FormGroup>
                                                                        <AvField type="select" value="us" label="State/Province" id="state_province" name="state_province" required >
                                                                            <option value="">Select State</option>
                                                                            {options && options.map(data=>
                                                                                <option key={data.value} value={data.value}> {data.label} </option>
                                                                            )}
                                                                        </AvField>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                <AvField value={formOption.custZipCode} name="zipCode" label="Zip Code" type="text" placeholder="Zip Code" validate={{
                                                                    required: { value: true, errorMessage: 'This field is required.' },

                                                                    minLength: { value: 3, errorMessage: 'Your name must be between 3 and 16 characters' },
                                                                    maxLength: { value: 96, errorMessage: 'Your name must be between 6 and 16 characters' }
                                                                }} />
                                                                </Col>
                                                                <Col md="6">
                                                                <AvField value={formOption.custSsn} name="lastssn" label="Last-4 SSN" type="text" placeholder="" validate={{
                                                                    required: { value: true, errorMessage: 'This field is required.' },
                                                                    pattern: { value: '^[0-9]*$', errorMessage:'Please enter digits only.'}
                                                                }} />
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                    </Row>
                                                    <hr></hr>
                                                </Col>

                                                {/* Payment Information */}

                                                <Col md="12">
                                                    <Row>
                                                        <Col md="12">
                                                            <p className={"menu-header-title text-capitalize mb-2 mt-2"}>Payment Information</p>
                                                            {/* Payment Information */}

                                                            <Row>
                                                                <Col md="12">
                                                                <AvField value="011401533" name="accnum" label="Account Number" type="text" placeholder="Account Number" validate={{
                                                                    required: { value: true, errorMessage: 'This field is required.' },
                                                                    pattern: { value: '^[0-9]*$', errorMessage:'Please enter digits only.'},
                                                                }} />
                                                                </Col>
                                                                <Col md="12">
                                                                <AvField value="072403004" name="routnum" label="Routing Number" type="text" placeholder="Routing Number" validate={{
                                                                    required: {
                                                                        value: true,
                                                                        errorMessage: 'This field is required.'
                                                                    },
                                                                    pattern: {
                                                                        value: '^[0-9]+$',
                                                                        errorMessage: 'Routing must be composed only with numbers'
                                                                    },
                                                                    minLength: {
                                                                        value: 9,
                                                                        errorMessage: 'Routing must be 9 characters'
                                                                    },
                                                                    maxLength: {
                                                                        value: 9,
                                                                        errorMessage: 'Routing be 9 characters'
                                                                    },
                                                                    async: function (value, ctx, input, cb) {
                                                                        if (value.length == 9) {
                                                                            const isValid = brnv.ABARoutingNumberIsValid(value)
                                                                            if (isValid) {
                                                                                cb(true)
                                                                            } else {
                                                                                cb('Routing number is invalid')
                                                                            }
                                                                        } else {
                                                                            cb(true)
                                                                        }

                                                                    }
                                                                }} />
                                                                </Col>
                                                                <Col md="12">
                                                                    <AvField value="debit" type="select" label="Account Type" id="bankacctype" name="bankacctype" required >

                                                                        <option value="credit">Credit</option>
                                                                        <option value="debit">Debit</option>
                                                                    </AvField>
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                    </Row>
                                                    <hr></hr>
                                                </Col>

                                                {/* Billing Information */}

                                                <Col md="12">
                                                    <Row>
                                                        <Col md="12">
                                                            <p className={"menu-header-title text-capitalize mb-2 mt-2"}>Billing Information</p>
                                                            {/* Billing Information */}

                                                            <Row>
                                                                <Col md="6">
                                                                    <AvField value="S" type="select" label="Transact Type" id="transType" name="transType"
                                                                    validate={{
                                                                            required: { value: true, errorMessage: 'This field is required.' }}} >
                                                                        <option value="S">Same-day</option>
                                                                        <option value="N">Pre-note</option>
                                                                        <option value="Y">NSF Retry</option>
                                                                    </AvField>
                                                                </Col>
                                                                {/* <Col md="6 sr-only">
                                                                    <div className={'row'}>
                                                                        <div className={this.state.adjust}>
                                                                            <AvField type="select" label="Is this is a retry" id="isRetry" name="isRetry" onChange={this.isRetryAmount}
                                                                            validate={{
                                                                                    required: { value: true, errorMessage: 'This field is required.' }}} >
                                                                                <option value="">Is retry</option>
                                                                                <option selected={true} value="Yes">Yes</option>
                                                                                <option value="No">No</option>
                                                                            </AvField>
                                                                        </div>
                                                                        <div className={this.state.showHidefield ? 'sr-only' :  this.state.adjust} >
                                                                            <AvField value="23.00" name="retryAmount" label="Retry Amount" type="text" placeholder="20.00" validate={{
                                                                                required: { value: true, errorMessage: 'This field is required.' },
                                                                                pattern: { value: '^[0-9]*\.[0-9]*$', errorMessage:'Please enter digits only.'}
                                                                            }} />
                                                                        </div>
                                                                    </div>
                                                                </Col> */}
                                                                <Col md="6">
                                                                <AvField value={formOption.custinitialAmount} name="initialAmount" label="Initial Amount" type="text" placeholder="Initial Amount" validate={{
                                                                    required: { value: true, errorMessage: 'This field is required.' },
                                                                    pattern: { value: '^[0-9]*\.[0-9]*$', errorMessage:'Please enter digits only.'}
                                                                }} />
                                                                </Col>
                                                                <Col md="6 sr-only">
                                                                <AvField value="25.00" name="reccAmount" label="Recurring Amount" type="text" placeholder="Recurring Amount" validate={{
                                                                    required: { value: true, errorMessage: 'This field is required.' },
                                                                    pattern: { value: '^[0-9]*\.[0-9]*$', errorMessage:'Please enter digits only.'},
                                                                }} />
                                                                </Col>
                                                            </Row>
                                                            {/* <Row>
                                                                <Col md="12">
                                                                <AvField value="2" name="recBilling" label="Number of days until recurred billing" type="text" placeholder="2 Days" validate={{
                                                                    required: { value: true, errorMessage: 'This field is required.' },

                                                                    minLength: { value: 1, errorMessage: 'Your name must be between 3 and 16 characters' },
                                                                    maxLength: { value: 2, errorMessage: 'Your name must be between 6 and 16 characters' }
                                                                }} />
                                                                </Col>
                                                                <Col md="12">
                                                                <AvField  value="2" name="maxBill" label="Maximum number of billings" type="text" placeholder="2 Days" validate={{
                                                                    required: { value: true, errorMessage: 'This field is required.' },

                                                                    minLength: { value: 1, errorMessage: 'Your name must be between 3 and 16 characters' },
                                                                    maxLength: { value: 2, errorMessage: 'Your name must be between 6 and 16 characters' }
                                                                }} />
                                                                </Col>
                                                            </Row> */}

                                                            <Row>
                                                                <Col md="6">
                                                                    <AvField type="select" value="3" label="Billing Cycle"  name="billcyc" required >
                                                                        <option  value="-1">One-Time Billing</option>
                                                                        <option value="1">Weekly</option>
                                                                        <option value="2">Monthly</option>
                                                                        <option value="3">Bi-Monthly</option>
                                                                        <option value="4">Quaterly</option>
                                                                        <option value="5">Semi-Annually</option>
                                                                        <option value="6">Annually</option>
                                                                        <option value="7">Bi-Weekly</option>
                                                                        <option value="8">Business-Daily</option>
                                                                    </AvField>
                                                                </Col>
                                                                <AvField name="capture_type" value="vt" className="sr-only" />
                                                                <Col md="6 sr-only">
                                                                    <div className={"form-group"}>
                                                                    <AvInput className={'mr-2'} name="futureinitial" type="checkbox" onChange={this.customSlected} />
                                                                        <label>Date of future initial billing</label>
                                                                        <InputGroup>
                                                                            <InputGroupAddon addonType="prepend">
                                                                                <div className="input-group-text">
                                                                                    <FontAwesomeIcon icon={faCalendarAlt}/>
                                                                                </div>
                                                                            </InputGroupAddon>
                                                                            <DatePicker id="dateoffuture" className="form-control"
                                                                                        selected={this.state.startDate}
                                                                                        onChange={this.handleChange}
                                                                            />
                                                                        </InputGroup>
                                                                    </div>

                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                    </Row>
                                                    <hr></hr>
                                                </Col>

                                                {/* Other Information */}
                                                <Col md="12">
                                                    <Row>
                                                        <Col md="12">
                                                            <p className={"menu-header-title text-capitalize mb-2 mt-2"}>Other Information</p>
                                                            {/* Other Information */}

                                                            <Row>
                                                                <Col md="6">
                                                                <AvField value="126562" name="cusnumber" label="Your customer number" type="text" placeholder="Your customer number" validate={{
                                                                    minLength: { value: 3, errorMessage: 'Your name must be between 3 and 16 characters' },
                                                                    maxLength: { value: 96, errorMessage: 'Your name must be between 6 and 16 characters' }
                                                                }} />
                                                                </Col>
                                                                <Col md="6">
                                                                <AvField value="The quick brown fox jumps over the little lazy dog." name="commorder" label="Comments on order" type="text" placeholder="Comments on order" validate={{
                                                                    minLength: { value: 30, errorMessage: 'Comment must in 30 characters' },
                                                                }} />
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                    </Row>
                                                    <Row className="pull-right">
                                                        <Col md="12">
                                                            <FormGroup className={"pull-right"}>
                                                                <Button size="lg" className="mt-6" color="info">Submit Payment</Button>
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>

                                        </AvForm>
                                </CardBody>
                            </Card>
                        </Container>
                    </ReactCSSTransitionGroup>
                </BlockUi>
            </Fragment>
                    );
                }
            }
