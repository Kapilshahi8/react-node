import React, {Component, Fragment} from 'react';
import {Card, CardBody, Col, Container, FormGroup, Row, Label, InputGroup, InputGroupAddon, Button} from "reactstrap";
import AppHeader from '../../../Layout/AppHeader/';
import AppSidebar from '../../../Layout/AppSidebar/';
import AppFooter from '../../../Layout/AppFooter/';
import ThemeOptions from '../../../Layout/ThemeOptions/';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import PageTitle from "../../../Layout/AppMain/PageTitle";
import {AvField, AvForm,AvRadioGroup, AvRadio, AvCheckbox, AvCheckboxGroup} from "availity-reactstrap-validation";
import faker from 'faker';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCalendarAlt} from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import Slider from 'rc-slider';
import Axios from 'axios';
import qs from 'querystring';
import Loader from 'react-loaders';
import BlockUi from 'react-block-ui';
import { toast } from 'react-toastify';
import { setting } from "../../../environment";
const businessEntityTypes = ['Partnership', 'Private', 'C-Corp','S-Corp','LLC','Non-Profit'];
const processingTypes = ["Retail(swiped)", "Internet (Card-Not-Present)", "ACH"];
const conditionalAnswers = ["Yes", "No"];
const shippingWays = ["FedEx","UPS", "DHL","USPS",""];
const chargedAtTimeOf = ["Purchase", "Shipped"];
const returnPolicies = ["Full Refund","Partial Refund","No Refunds"];
const banks = ["JPMorgan Chase","Bank of America","Citigroup", "Wells Fargo","Goldman Sachs","Morgan Stanley","U.S. Bancorp","The Bank of New York Mellon"];
const policiesOnWebsite = ["Privacy Policy","Return Policy","Terms and Conditions"];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const formOption = {
    companyName: faker.company.companyName(),
    businessEntityType: businessEntityTypes[Math.floor(Math.random() * 6)],
    custphone:Math.floor(100000000 + Math.random() * 900000000),
    custAddress1:faker.address.streetAddress(),
    custAddress2:faker.address.secondaryAddress(),
    custCity:faker.address.city(),
    custState:faker.address.state(),
    custZipCode:faker.address.zipCode().replace('-','').substring(0,5),
    ownershipYears: Math.floor(Math.random() * 10 + 1),
    custSsn:Math.floor(Math.random() * 9999),
    custinitialAmount:Math.floor(Math.random() * 9)+'.00',
    incorporationState: faker.address.state(),
    custCountry:faker.address.country(),
    officerEmail:faker.internet.exampleEmail(),
    officerTitleWithCompany: "Title-" + Math.floor(Math.random() * 100),
    officerPhone:faker.phone.phoneNumberFormat(),
    officerResidenceAddress1: faker.address.streetAddress(),
    officerResidenceAddress2: faker.address.secondaryAddress(),
    officerState:faker.address.state(),
    officerCity:faker.address.city(),
    officerZipCode:faker.address.zipCode().substring(0,5),
    officerSSN: Math.floor(Math.random() *100 + 100000 ).toString().trim(),
    processingType: processingTypes[Math.floor(Math.random() * 3)],
    averageSingleTranAmt: Math.floor(Math.random() * 500),
    maxMonthlyTranAmt: Math.floor(Math.random() * 5000),
    maxSingleTranAmt: Math.floor(Math.random() * 1000),
    averageMonthlyTranAmt: Math.floor(Math.random() * 2800 + 1),
    dbaName: faker.name.findName(),
    locationContactName: faker.name.findName(),
    merchantAddress1: faker.address.streetAddress(),
    merchantAddress2: faker.address.secondaryAddress(),
    merchantCity: faker.address.city(),
    merchantState: faker.address.state(),
    merchantZipCode: faker.address.zipCode().replace('-','').substring(0,5),
    merchantEmail: faker.internet.exampleEmail(),
    merchantWebsite: faker.internet.url(),
    merchantPhone:faker.phone.phoneNumberFormat(),
    locationFax: faker.phone.phoneNumberFormat(),
    isMerchantBankrupt: conditionalAnswers[Math.floor(Math.random() * 2)],
    typesOfGoods: faker.lorem.sentence(),
    goodsShipped: [shippingWays[Math.floor(Math.random() * 4)]],
    otherShippingMode: faker.lorem.words(),
    daysBetweenOrderAndDelivery: Math.floor(Math.random() * 10 + 1),
    chargedAtTimeOf: chargedAtTimeOf[Math.floor(Math.random() * 2)],
    depositRequired: conditionalAnswers[Math.floor(Math.random() * 2)],
    returnPolicy: returnPolicies[Math.floor(Math.random() * 3)],
    returnPolicyTimePeriod: Math.floor(Math.random() * 30) + ' Days',
    bankName: banks[Math.floor(Math.random() * 8)],
    businessNameOnChecks: faker.name.findName(),
    routingNumber: Math.floor(Math.random() * 100 + 3839449).toString().trim(),
    accountNumber: Math.floor(Math.random() * 100 + 383944926).toString().trim(),
    policiesAccessibleOnWebsite: [policiesOnWebsite[Math.floor(Math.random() * 3)]],
    websiteIP: faker.internet.ip(),
    sslIssuer: faker.name.findName(),
    sslNumber: Math.floor(Math.random() * 100 + 60002342234343),
    doesAppOwnsWebDomain: conditionalAnswers[Math.floor(Math.random() * 2)],
    shoppingCartVendor: faker.company.companyName(),
    webHostVendor: faker.company.companyName()

}

const countries = [
    {value: 'us', label: 'US'}
];
export default class NewMerchant extends Component {
    constructor(props) {
        super(props);
        this.state = {
            officerDOB: faker.date.past(),
            custStartDate: faker.date.past(),
            internetVolume: Math.floor(Math.random()*100),
            retailVolume: Math.floor(Math.random()*100),
            goodsShippedBy: formOption.goodsShipped,
            loading: false
        }
    }

    onChange = (e, key) => {
        this.setState({[key]: typeof e === 'number' ? e : +e.target.value || 0})
    }

    onShippingMethodChange = (e) => {
        e.persist();
        let {goodsShippedBy} = this.state;
        if(e.target.checked &&  goodsShippedBy.indexOf(e.target.value) === -1) {
            goodsShippedBy.push(e.target.value)
            this.setState({goodsShippedBy});
            return;
        }
        goodsShippedBy = goodsShippedBy.filter(x => x !== e.target.value);
        this.setState({goodsShippedBy});
        return;

    }


    handleDateChange = (date, key) => {
        this.setState({[key] : date});
    }

    renderLegalEntityInformation = () => {
        return (
            <Col md="12">
                <p className={"menu-header-title text-capitalize mb-2 mt-2"}>Legal Entity Information</p>
                <Row>
                    <Col md="6">
                        <AvField value={formOption.companyName} name="field81902386"
                                 label="Merchants legal company’s name*" type="text" placeholder="Company Name"
                                 validate={{
                                     required: {value: true, errorMessage: 'This field is required.'},
                                     minLength: {
                                         value: 6,
                                         errorMessage: 'Your name must be between 6 and 50 characters'
                                     },
                                     maxLength: {
                                         value: 50,
                                         errorMessage: 'Your name must be between 6 and 50 characters'
                                     }
                                 }}/>
                    </Col>
                    <Col md="6">
                        <AvField value={formOption.businessEntityType} type="select" label="Business Entity Type"
                                 id="business_entity_type" name="field81902416">
                            <option value="">Choose One...</option>
                            {businessEntityTypes.map((data, i) =>
                                <option key={i} value={data}> {data} </option>
                            )}
                        </AvField>
                    </Col>

                    <Col md="12">
                        <AvField value={formOption.custAddress1} name="field81902517-address"
                                 label="Business Address 1 *" type="text" placeholder="Address 1" validate={{
                            required: {value: true, errorMessage: 'Business address is required.'},
                            minLength: {value: 3, errorMessage: 'Your name must be between 3 and 50 characters'},
                            maxLength: {value: 50, errorMessage: 'Your name must be between 3 and 50 characters'}
                        }}/>
                    </Col>
                    <Col md="12">
                        <AvField value={formOption.custAddress2} label="Business Address 2*" name="field81902517-address2" type="text"
                                 placeholder="Address 2" validate={{
                            required: {value: true, errorMessage: 'This field is required.'},
                            minLength: {value: 3, errorMessage: 'Your name must be between 3 and 16 characters'},
                            maxLength: {value: 66, errorMessage: 'Your name must be between 6 and 16 characters'}
                        }}/>
                    </Col>
                    <Col md={6}>
                        <AvField value={formOption.custCity} name="field81902517-city" label='City*' type="text" placeholder="City"
                                 validate={{
                                     required: {value: true, errorMessage: 'This field is required.'},
                                     minLength: {
                                         value: 3,
                                         errorMessage: 'Your name must be between 3 and 16 characters'
                                     },
                                     maxLength: {
                                         value: 56,
                                         errorMessage: 'Your name must be between 6 and 16 characters'
                                     }
                                 }}/>
                    </Col>
                    <Col md={6}>
                        <AvField value={formOption.custState} name="field81902517-state" label='State*' type="text"
                                 placeholder="State" validate={{
                            required: {value: true, errorMessage: 'This field is required.'},
                            minLength: {value: 3, errorMessage: 'Your name must be between 3 and 16 characters'},
                            maxLength: {value: 56, errorMessage: 'Your name must be between 6 and 16 characters'}
                        }}/>
                    </Col>
                    <Col md={10}>
                        <AvField type="select" value="us" label="Country*" id="state_province"
                                 name="field81902517-country" required>
                            <option value="">Select State</option>
                            {countries && countries.map(data =>
                                <option key={data.value} value={data.value}> {data.label} </option>
                            )}
                        </AvField>
                    </Col>
                    <Col md="2">
                        <AvField value={formOption.custZipCode} name="field81902517-zip" label="Zip Code*" type="text"
                                 placeholder="Zip Code"  validate={{
                            required: {value: true, errorMessage: 'This field is required.'},
                            minLength: {value: 5, errorMessage: 'Zip code should be 5 digits'},
                            maxLength: {value: 5, errorMessage: 'Zip code should be 5 digits'},
                            pattern: {
                                value: '^[0-9]+$',
                                errorMessage: 'Zip code should be only digits '
                            }
                        }}/>
                    </Col>
                </Row>
                <p className={"text-capitalize mb-2 mt-2"}>Mailing Address (if different from Business Address)</p>
                <Row>
                    <Col md="12">
                        <AvField value={formOption.custAddress1} name="field81906627-address" type="text"
                                 placeholder="Address 1" validate={{
                            required: {value: true, errorMessage: 'Business address is required.'},
                            minLength: {value: 3, errorMessage: 'Your name must be between 3 and 50 characters'},
                            maxLength: {value: 50, errorMessage: 'Your name must be between 3 and 50 characters'}
                        }}/>
                    </Col>
                    <Col md="12">
                        <AvField value={formOption.custAddress2} label="Mailing Address 2" name="field81906627-address2" type="text"
                                 placeholder="Address 2" validate={{
                            required: {value: true, errorMessage: 'This field is required.'},
                            minLength: {value: 3, errorMessage: 'Your name must be between 3 and 16 characters'},
                            maxLength: {value: 66, errorMessage: 'Your name must be between 6 and 16 characters'}
                        }}/>
                    </Col>
                    <Col md={6}>
                        <FormGroup>
                            <AvField value={formOption.custCity} name="field81906627-city" label='City' type="text" placeholder="City"
                                     validate={{
                                         required: {value: true, errorMessage: 'This field is required.'},
                                         minLength: {
                                             value: 3,
                                             errorMessage: 'Your name must be between 3 and 16 characters'
                                         },
                                         maxLength: {
                                             value: 56,
                                             errorMessage: 'Your name must be between 6 and 16 characters'
                                         }
                                     }}/>
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup>
                            <AvField value={formOption.custState} name="field81906627-state" label='State' type="text"
                                     placeholder="State" validate={{
                                required: {value: true, errorMessage: 'This field is required.'},
                                minLength: {value: 3, errorMessage: 'Your name must be between 3 and 16 characters'},
                                maxLength: {value: 56, errorMessage: 'Your name must be between 6 and 16 characters'}
                            }}/>
                        </FormGroup>
                    </Col>
                    <Col md={10}>
                        <FormGroup>
                            <AvField type="select" value="us" label="Country*" id="field81906627-country"
                                     name="field81906627-country" required>
                                <option value="">Select State</option>
                                {countries && countries.map(data =>
                                    <option key={data.value} value={data.value}> {data.label} </option>
                                )}
                            </AvField>
                        </FormGroup>
                    </Col>
                    <Col md="2">
                        <AvField value={formOption.custZipCode} name="field81906627-zip" label="Zip Code" type="text"
                                 placeholder="Zip Code" validate={{
                            required: {value: true, errorMessage: 'This field is required.'},
                            minLength: {value: 5, errorMessage: 'Zip code should be 5 digits'},
                            maxLength: {value: 5, errorMessage: 'Zip code should be 5 digits'},
                            pattern: {
                                value: '^[0-9]+$',
                                errorMessage: 'Zip code should be only digits '
                            }
                        }}/>
                    </Col>
                    <Col md={6}>
                        <FormGroup>
                            <AvField value={formOption.custFederalTaxID} name="field81902572" label='Federal Tax ID'
                                     type="text" placeholder="Federal Tax ID" validate={{
                                minLength: {value: 3, errorMessage: 'Your name must be between 3 and 16 characters'},
                                maxLength: {value: 56, errorMessage: 'Your name must be between 6 and 16 characters'}
                            }}/>
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup>
                            <AvField value={formOption.incorporationState} name="field81902585"
                                     label='Incorporation State*' type="text" placeholder="Incorporation State"
                                     validate={{
                                         required: {value: true, errorMessage: 'This field is required.'},
                                         minLength: {
                                             value: 3,
                                             errorMessage: 'Your name must be between 3 and 16 characters'
                                         },
                                         maxLength: {
                                             value: 56,
                                             errorMessage: 'Your name must be between 6 and 16 characters'
                                         }
                                     }} required/>
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <AvField value={formOption.ownershipYears} name="field81902998"
                                 label='Length of Current Ownership (Years)*' type="number"
                                 placeholder="Current Ownership (Years) " validate={{
                            required: {
                                value: true,
                                errorMessage: 'This field is required.'
                            },
                        }} required/>
                    </Col>
                    <Col md={6}>
                        <FormGroup>
                            <Label for="startDate" className="mr-sm-2">Entity Start Date*</Label>
                            <InputGroup id='startDate'>
                                <InputGroupAddon addonType="prepend">
                                    <div className="input-group-text">
                                        <FontAwesomeIcon icon={faCalendarAlt}/>
                                    </div>
                                </InputGroupAddon>
                                <DatePicker
                                    startDate={this.state.custStartDate}
                                    selected={this.state.custStartDate}
                                    selectsStart
                                    className="form-control"
                                    onChange={(e)=>this.handleDateChange(e,'custStartDate')}
                                    required
                                />
                            </InputGroup>
                        </FormGroup>
                    </Col>
                </Row>
            </Col>
        );
    }

    renderOwnerOrOfficerInformation = () => {
        return (<Col md="12">
            <p className={"menu-header-title text-capitalize mb-2 mt-2"}>Owner/Officer Information</p>
            <Row>
                <Col md="6">
                    <AvField value={formOption.companyName} name="field81904686" label="Owner/Officer Name*" type="text" placeholder="Owner/Officer Name" validate={{
                        required: { value: true, errorMessage: 'This field is required.' },
                        minLength: { value: 6, errorMessage: 'Your name must be between 6 and 50 characters' },
                        maxLength: { value: 50, errorMessage: 'Your name must be between 6 and 50 characters' }
                    }} />
                </Col>
                <Col md="6">
                    <AvField value={formOption.officerEmail} name="field81904731" label="Email Address*" type="email" placeholder="Email" validate={{
                        required: { value: true, errorMessage: 'This field is required.' }
                    }} />
                </Col>

                <Col md="6">
                    <AvField value={formOption.officerTitleWithCompany} name="field81921900" label="Title with the Company" type="text" placeholder="Title with the company" validate={{
                        required: { value: true, errorMessage: 'This field is required.' },
                        minLength: { value: 3, errorMessage: 'Your name must be between 3 and 50 characters' },
                        maxLength: { value: 50, errorMessage: 'Your name must be between 3 and 50 characters' }
                    }} />
                </Col>
                <Col md="6">
                    <AvField value={formOption.officerPhone} name="field81921903"
                             label="Phone Number"
                             type="text"
                             placeholder="Enter Phone Number" validate={{
                        required: {
                            value: false,
                            errorMessage: 'This field is required.'
                        },
                        pattern: {
                            value: /^\(?([2-9]{1})([0-9]{2})\)?[-.●]?([2-9]{1})([0-9]{2})[-.●]?([0-9]{4})$/,
                            errorMessage: 'phone number must be composed only with 000-000-0000 and should follow US standards'
                        },
                        minLength: {
                            value: 5,
                            errorMessage: 'Your name must be between 5 and 16 characters'
                        },
                        maxLength: {
                            value: 16,
                            errorMessage: 'Your name must be between 5 and 16 characters'
                        }
                    }}/>
                </Col>
                <Col md="12">
                    <AvField value={formOption.officerResidenceAddress1} name="field81921904-address"
                             label="Residence Address Line 1 *" type="text" placeholder="Address 1" validate={{
                        required: {value: true, errorMessage: 'Residence address line 1 is required.'},
                        minLength: {value: 3, errorMessage: 'Your name must be between 3 and 50 characters'},
                        maxLength: {value: 50, errorMessage: 'Your name must be between 3 and 50 characters'}
                    }}/>
                </Col>
                <Col md="12">
                    <AvField value={formOption.officerResidenceAddress2} label="Residence Address 2*" name="field81921904-address2" type="text"
                             placeholder="Residence Address Line 2" validate={{
                        required: {value: true, errorMessage: 'This field is required.'},
                        minLength: {value: 3, errorMessage: 'Your name must be between 3 and 16 characters'},
                        maxLength: {value: 50, errorMessage: 'Your name must be between 6 and 16 characters'}
                    }}/>
                </Col>
                <Col md={6}>
                    <AvField value={formOption.officerCity} name="field81921904-city" label='City*' type="text" placeholder="City" validate={{
                        required: { value: true, errorMessage: 'This field is required.' },
                        minLength: { value: 3, errorMessage: 'Your name must be between 3 and 16 characters' },
                        maxLength: { value: 56, errorMessage: 'Your name must be between 6 and 16 characters' }
                    }} />
                </Col>
                <Col md={6}>
                    <AvField value={formOption.officerState} name="field81921904-state" label='State*' type="text" placeholder="State" validate={{
                        required: { value: true, errorMessage: 'This field is required.' },
                        minLength: { value: 3, errorMessage: 'Your name must be between 3 and 16 characters' },
                        maxLength: { value: 56, errorMessage: 'Your name must be between 6 and 16 characters' }
                    }} />
                </Col>

                <Col md={10}>
                    <AvField type="select" value="us" label="State/Province*" id="field81921904-country" name="field81921904-country" required >
                        <option value="">Select State</option>
                        {countries && countries.map(data=>
                            <option key={data.value} value={data.value}> {data.label} </option>
                        )}
                    </AvField>
                </Col>
                <Col md="2">
                    <AvField value={formOption.officerZipCode} name="field81921904-zip" label="Zip Code*" type="text" placeholder="Zip Code"
                             validate={{
                                required: {value: true, errorMessage: 'This field is required.'},
                                minLength: {value: 5, errorMessage: 'Zip code should be 5 digits'},
                                maxLength: {value: 5, errorMessage: 'Zip code should be 5 digits'},
                                pattern: {
                                    value: '^[0-9]+$',
                                    errorMessage: 'Zip code should be only digits '
                                }
                    }} />
                </Col>

                <Col md="6">
                    <AvField value={formOption.officerSSN} name="field81921905" label="SSN*" type="text" placeholder="SSN" validate={{
                        required: { value: true, errorMessage: 'This field is required.' },
                        minLength: { value: 3, errorMessage: 'Your name must be between 3 and 10 characters' },
                        maxLength: { value: 10, errorMessage: 'Your name must be between 3 and 10 characters' }
                    }} />
                </Col>
                <Col md="6">
                    <FormGroup>
                        <Label for="dob" className="mr-sm-2">Date of Birth*</Label>
                        <InputGroup id='dob'>
                            <InputGroupAddon addonType="prepend">
                                <div className="input-group-text">
                                    <FontAwesomeIcon icon={faCalendarAlt}/>
                                </div>
                            </InputGroupAddon>
                            <DatePicker
                                startDate={this.state.officerDOB}
                                selected={this.state.officerDOB}
                                selectsStart
                                className="form-control"
                                name="field81921906M"
                                onChange={(e) => this.handleDateChange(e,'officerDOB')}
                                required
                            />
                        </InputGroup>
                    </FormGroup>
                </Col>
            </Row>
        </Col>);
    }

    renderRequestProcessingType = () => {
        return (
            <Col md="12">
                <p className={"menu-header-title text-capitalize mb-2 mt-2"}>Requested Processing Types</p>
                <Row>
                    <Col md="6">
                        <AvField type="select" value={formOption.processingType} label="Processing Type*" name="field81921957" required >
                            <option value="">Choose which apply to your business</option>
                            {processingTypes.map((data,index)=>
                                <option key={index} value={data}> {data}</option>
                            )}
                        </AvField>
                    </Col>
                    <Col md="6">
                        <AvField value={formOption.averageSingleTranAmt}
                                 name="field81924884"
                                 label="Average Single Transaction Amount*"
                                 type="number"
                                 placeholder="Average Single Transaction Amount"
                                 validate={{
                            required: { value: true, errorMessage: 'This field is required.' }
                        }} />
                    </Col>
                    <Col md="6">
                        <AvField value={formOption.averageMonthlyTranAmt}
                                 name="field81924887"
                                 label="Average Monthly Volume Amount*"
                                 type="number"
                                 placeholder="Average Monthly Volume Amount"
                                 validate={{
                                     required: { value: true, errorMessage: 'This field is required.' }
                                 }} />
                    </Col>
                    <Col md="6">
                        <AvField value={formOption.maxSingleTranAmt}
                                 name="field81924890"
                                 label="Max. Single Transaction Amount*"
                                 type="number"
                                 placeholder="Max. Single Transaction Amount"
                                 validate={{
                                     required: { value: true, errorMessage: 'This field is required.' }
                                 }} />
                    </Col>
                    <Col md="12">
                        <AvField value={formOption.maxMonthlyTranAmt}
                                 name="field81924889"
                                 label="Max. Monthly Volume Amount*"
                                 type="number"
                                 placeholder="Max. Monthly Volume Amount"
                                 validate={{
                                     required: { value: true, errorMessage: 'This field is required.' }
                                 }} />
                    </Col>
                    <Col md="6">
                        <FormGroup>
                            <Label for="internetVolume" className="mr-sm-2">Internet Volume %*</Label>
                            <Row>
                                <Col md="9">
                                    <Slider
                                        value={this.state.internetVolume}
                                        railStyle={{ height: 10 }}
                                        trackStyle={{height: 10 }}
                                        handleStyle={{
                                            height: 28,
                                            width: 28,
                                            marginLeft: -14,
                                            marginTop: -9,
                                        }}
                                        style={{marginTop: '6px'}}
                                        min={0}
                                        max={100}
                                        step={1}
                                        onChange={(e) => this.onChange(e, 'internetVolume')}
                                    />
                                </Col>
                                <Col md="3">
                                    <AvField value={this.state.internetVolume}
                                             name="field81922062"
                                             type="number"
                                             onChange={(e) => this.onChange(e, 'internetVolume')}
                                             validate={{
                                                 required: { value: true, errorMessage: 'This field is required.' }
                                             }} />
                                </Col>
                            </Row>
                        </FormGroup>
                    </Col>
                    <Col md="6">
                        <FormGroup>
                            <Label for="internetVolume" className="mr-sm-2">Retail Volume %*</Label>
                            <Row>
                                <Col md="9">
                                    <Slider
                                        value={this.state.retailVolume}
                                        railStyle={{ height: 10 }}
                                        trackStyle={{height: 10 }}
                                        handleStyle={{
                                            height: 28,
                                            width: 28,
                                            marginLeft: -14,
                                            marginTop: -9,
                                        }}
                                        style={{marginTop: '6px'}}
                                        min={0}
                                        max={100}
                                        step={1}
                                        onChange={(e) => this.onChange(e, 'retailVolume')}
                                    />
                                </Col>
                                <Col md="3">
                                    <AvField value={this.state.retailVolume}
                                             name="field81922064"
                                             type="number"
                                             onChange={(e) => this.onChange(e, 'retailVolume')}
                                             validate={{
                                                 required: { value: true, errorMessage: 'This field is required.' }
                                             }} />
                                </Col>
                            </Row>
                        </FormGroup>
                    </Col>
                </Row>
            </Col>
        );
    }

    renderMerchantLocationInformation = () => {
        return (
            <Col md="12">
                <p className={"menu-header-title text-capitalize mb-2 mt-2"}>Merchant Location Information</p>
                <Row>
                    <Col md="6">
                        <AvField
                            value={formOption.dbaName} name="field81921965" label="DBA Name*"
                            type="text" placeholder="DBA Name" validate={{
                            required: { value: true, errorMessage: 'This field is required.' },
                            minLength: { value: 6, errorMessage: 'Your name must be between 6 and 50 characters' },
                            maxLength: { value: 50, errorMessage: 'Your name must be between 6 and 50 characters' }
                        }} />
                    </Col>
                    <Col md="6">
                        <AvField
                            value={formOption.locationContactName} name="field81921966" label="Location Contact Name"
                            type="text" placeholder="Location Contact Name" />
                    </Col>
                    <Col md="12">
                        <AvField value={formOption.merchantAddress1} name="field81921968-address"
                                 label="Location Address Line 1 *" type="text" placeholder="Address 1" validate={{
                            required: {value: true, errorMessage: 'Location Address Line 1'},
                            minLength: {value: 3, errorMessage: 'Your name must be between 3 and 50 characters'},
                            maxLength: {value: 50, errorMessage: 'Your name must be between 3 and 50 characters'}
                        }}/>
                    </Col>
                    <Col md="12">
                        <AvField value={formOption.merchantAddress2} label="Location Address Line 2*" name="field81921968-address2" type="text"
                                 placeholder="Location Address Line 2" validate={{
                            required: {value: true, errorMessage: 'This field is required.'},
                            minLength: {value: 3, errorMessage: 'Your name must be between 3 and 16 characters'},
                            maxLength: {value: 66, errorMessage: 'Your name must be between 6 and 16 characters'}
                        }}/>
                    </Col>
                    <Col md={6}>
                        <AvField value={formOption.merchantCity} name="field81921968-city" label='City*' type="text" placeholder="City"
                                 validate={{
                                     required: {value: true, errorMessage: 'This field is required.'},
                                     minLength: {
                                         value: 3,
                                         errorMessage: 'Your name must be between 3 and 16 characters'
                                     },
                                     maxLength: {
                                         value: 56,
                                         errorMessage: 'Your name must be between 6 and 16 characters'
                                     }
                                 }}/>
                    </Col>
                    <Col md={6}>
                        <AvField value={formOption.merchantState} name="field81921968-state" label='State*' type="text"
                                 placeholder="State" validate={{
                            required: {value: true, errorMessage: 'This field is required.'},
                            minLength: {value: 3, errorMessage: 'Your name must be between 3 and 16 characters'},
                            maxLength: {value: 56, errorMessage: 'Your name must be between 6 and 16 characters'}
                        }}/>
                    </Col>
                    <Col md={10}>
                        <AvField type="select" value="us" label="Country*" id="field81921968-country"
                                 name="field81921968-country" required>
                            <option value="">Select State</option>
                            {countries && countries.map(data =>
                                <option key={data.value} value={data.value}> {data.label} </option>
                            )}
                        </AvField>
                    </Col>
                    <Col md="2">
                        <AvField value={formOption.merchantZipCode} name="field81921968-zip" label="Zip Code*" type="text"
                                 placeholder="Zip Code" validate={{
                            required: {value: true, errorMessage: 'This field is required.'},

                            minLength: {value: 3, errorMessage: 'Your name must be between 3 and 10 characters'},
                            maxLength: {value: 10, errorMessage: 'Your name must be between 3 and 10 characters'}
                        }}/>
                    </Col>

                    <Col md="6">
                        <AvField value={formOption.merchantEmail} name="field81921971" label="Location Contact Email Address" type="email"
                                 placeholder="Location Contact Email Address" />
                    </Col>

                    <Col md="6">
                        <AvField value={formOption.merchantWebsite} name="field81921972" label='Website*' type="text"
                                 placeholder="https://www.yoursite.com" validate={{
                            required: {value: true, errorMessage: 'This field is required.'},
                            minLength: {value: 3, errorMessage: 'Your name must be between 3 and 16 characters'},
                            maxLength: {value: 56, errorMessage: 'Your name must be between 6 and 16 characters'}
                        }}/>
                    </Col>
                    <Col md="6">
                        <AvField value={formOption.merchantPhone} name="field81921974"
                                 label="Location Customer Service Phone*"
                                 type="text"
                                 placeholder="Enter Phone Number" validate={{
                            required: {
                                value: true,
                                errorMessage: 'This field is required.'
                            },
                            pattern: {
                                value: /^\(?([2-9]{1})([0-9]{2})\)?[-.●]?([2-9]{1})([0-9]{2})[-.●]?([0-9]{4})$/,
                                errorMessage: 'phone number must be composed only with 000-000-0000 and should follow US standards'
                            },
                            minLength: {
                                value: 5,
                                errorMessage: 'Your name must be between 5 and 16 characters'
                            },
                            maxLength: {
                                value: 16,
                                errorMessage: 'Your name must be between 5 and 16 characters'
                            }
                        }}/>
                    </Col>

                    <Col md="6">
                        <AvField value={formOption.locationFax} name="field81921977" label='Location Fax*' type="text"
                                 placeholder="Enter location fax" validate={{
                            required: {value: true, errorMessage: 'This field is required.'},
                            minLength: {value: 3, errorMessage: 'Your name must be between 3 and 16 characters'},
                            maxLength: {value: 56, errorMessage: 'Your name must be between 6 and 16 characters'}
                        }}/>
                    </Col>
                    <Col md="12">
                        <FormGroup>
                            <Label for="field81921979">Have Merchant, or Owners ever filed business bankruptcy or personal bankruptcy?</Label>
                            <AvRadioGroup value={formOption.isMerchantBankrupt} inline name="field81921979"
                                          id="field81921979"
                                          validate={{required: {value: true, errorMessage: 'This field is required.'}}}>
                                <AvRadio label="Yes" value="Yes" />
                                <AvRadio label="No" value="No" />
                            </AvRadioGroup>
                        </FormGroup>
                    </Col>
                </Row>
            </Col>
        );
    }

    renderBusinessInformation =() => {
        return (
            <Col md="12">
                <p className={"menu-header-title text-capitalize mb-2 mt-2"}>Business Information</p>
                <Row>
                    <Col md="12">
                        <AvField value={formOption.typesOfGoods} name="field81921989" label='Types of Goods and Services Sold*' type="textarea"
                                 placeholder="Types of Goods and Services Sold" validate={{
                            required: {value: true, errorMessage: 'This field is required.'},
                            minLength: {value: 3, errorMessage: 'Your name must be between 3 and 200 characters'},
                            maxLength: {value: 200, errorMessage: 'Your name must be between 3 and 200 characters'}
                        }}/>
                    </Col>

                    <Col md="6">
                        <Label for="field81921990">How are goods shipped*</Label>
                        <AvCheckboxGroup value={formOption.goodsShipped} inline id="field81921990" name="field81921990[]" validate={{
                            required: {value: true, errorMessage: 'This field is required.'}}}
                        onChange={this.onShippingMethodChange}>
                        <AvCheckbox value="FedEx" label="FedEx"/>
                        <AvCheckbox value="UPS" label="UPS"/>
                        <AvCheckbox value="DHL" label="DHL"/>
                        <AvCheckbox value="USPS" label="USPS"/>
                        <AvCheckbox value="" label="Other"/>
                        </AvCheckboxGroup>
                    </Col>
                    <Col md="6">
                        <AvField disabled={this.state.goodsShippedBy.indexOf("") < 0} value={formOption.otherShippingMode} type="textarea" name="field81921990_other"/>
                    </Col>

                    <Col md="6">
                        <AvField value={formOption.daysBetweenOrderAndDelivery}
                                 name="field81921992"
                                 label="Days Between Order and Delivery*"
                                 type="number"
                                 validate={{
                                     required: { value: true, errorMessage: 'This field is required.' }
                                 }} />
                    </Col>
                    <Col md="6">
                        <Label for="field81921993">Cardholder is Charged at Time of*</Label>
                        <AvRadioGroup inline value={formOption.chargedAtTimeOf} name="field81921993"
                                      id="field81921993" validate={{
                            required: { value: true, errorMessage: 'This field is required.' }
                        }}>
                        <AvRadio value="Purchase" label="Purchase"/>
                        <AvRadio value="Shipped" label="Shipped"/>
                        </AvRadioGroup>
                    </Col>
                    <Col md="6">
                        <Label for="field81921994">Deposit Required*</Label>
                        <AvRadioGroup inline value={formOption.depositRequired} name="field81921994"
                                      id="field81921994" validate={{
                            required: { value: true, errorMessage: 'This field is required.' }
                        }}>
                        <AvRadio value="Yes" label="Yes"/>
                        <AvRadio value="No" label="No"/>
                        </AvRadioGroup>
                    </Col>
                    <Col md="6">
                        <Label for="field81921995">Return Policy?*</Label>
                        <AvRadioGroup inline value={formOption.returnPolicy} name="field81921995"
                                      id="field81921995" validate={{
                            required: { value: true, errorMessage: 'This field is required.' }
                        }}>
                        <AvRadio value="Full Refund" label="Full Refund"/>
                        <AvRadio value="Partial Refund" label="Partial Refund"/>
                        <AvRadio value="No Refunds" label="No Refunds"/>
                        </AvRadioGroup>
                    </Col>
                    <Col md="12">
                        <AvField value={formOption.returnPolicyTimePeriod} name="field81922000" label='Return Policy Time Period?*' type="text"
                                 placeholder="e.g. 30 Days" validate={{
                            required: {value: true, errorMessage: 'This field is required.'},
                            minLength: {value: 3, errorMessage: 'Your name must be between 3 and 100 characters'},
                            maxLength: {value: 100, errorMessage: 'Your name must be between 3 and 100 characters'}
                        }}/>
                    </Col>
                </Row>
            </Col>
        );
    }

    renderSettlementBankInformation = () => {
        return (
            <Col md="12">
                <p className={"menu-header-title text-capitalize mb-2 mt-2"}>Settlement Bank Information</p>
                <Row>
                    <Col md="6">
                        <AvField value={formOption.bankName} name="field81922002" label='Bank Name*' type="text"
                                 placeholder="Name of your bank" validate={{
                            required: {value: true, errorMessage: 'This field is required.'},
                            minLength: {value: 3, errorMessage: 'Your name must be between 3 and 60 characters'},
                            maxLength: {value: 60, errorMessage: 'Your name must be between 3 and 60 characters'}
                        }}/>
                    </Col>
                    <Col md="6">
                        <AvField value={formOption.businessNameOnChecks} name="field81922006" label='Business Name as it Appears on Checks*' type="text"
                                 placeholder="Business Name as it Appears on Checks" validate={{
                            required: {value: true, errorMessage: 'This field is required.'},
                            minLength: {value: 3, errorMessage: 'Your name must be between 3 and 60 characters'},
                            maxLength: {value: 60, errorMessage: 'Your name must be between 3 and 60 characters'}
                        }}/>
                    </Col>
                    <Col md="6">
                        <AvField value={formOption.routingNumber} name="field81922008" label='Routing Number*' type="text"
                                 placeholder="Routing Number" validate={{
                            required: {value: true, errorMessage: 'This field is required.'},
                            minLength: {value: 3, errorMessage: 'Your name must be between 3 and 60 characters'},
                            maxLength: {value: 60, errorMessage: 'Your name must be between 3 and 60 characters'}
                        }}/>
                    </Col>
                    <Col md="6">
                        <AvField value={formOption.accountNumber} name="field81922009" label='Account Number*' type="text"
                                 placeholder="Account Number" validate={{
                            required: {value: true, errorMessage: 'This field is required.'},
                            pattern: {
                                value: '^[0-9]+$',
                                errorMessage: 'account number must be composed only with numbers'
                            },
                            minLength: {value: 3, errorMessage: 'Your name must be between 3 and 60 characters'},
                            maxLength: {value: 60, errorMessage: 'Your name must be between 3 and 60 characters'}
                        }}/>
                    </Col>
                    <Col md="6">
                        <Label for="field81922014">Applicant Owns Web Domain and Content</Label>
                        <AvRadioGroup inline value={formOption.doesAppOwnsWebDomain} name="field81922014" id="field81922014">
                            <AvRadio value="Yes" label="Yes"/>
                            <AvRadio value="No" label="No"/>
                        </AvRadioGroup>
                    </Col>
                    <Col md="6">
                        <AvField value={formOption.shoppingCartVendor} name="field81922015" label='Shopping Cart Vendor*' type="text"
                                 placeholder="Shopping Cart Vendor"/>
                    </Col>
                    <Col md="6">
                        <AvField value={formOption.webHostVendor} name="field81922016" label='Web Host Vendor*' type="text"
                                 placeholder="Add vendor name of your web host"  validate={{
                            required: {value: true, errorMessage: 'This field is required.'},
                            minLength: {value: 3, errorMessage: 'Your name must be between 3 and 60 characters'},
                            maxLength: {value: 60, errorMessage: 'Your name must be between 3 and 60 characters'}
                        }}/>
                    </Col>
                </Row>
            </Col>
        );
    }

    renderInternetQuestionnaire = () => {
        return (
            <Col md="12">
                <p className={"menu-header-title text-capitalize mb-2 mt-2"}>Internet Questionnaire</p>
                <Row>
                    <Col md="6">
                        <Label for="field81922010[]">The following policies are clearly accessible on the website*</Label>
                        <AvCheckboxGroup value={formOption.policiesAccessibleOnWebsite} inline id="field81922010" name="field81922010[]">
                            <AvCheckbox value="Privacy Policy" label="Privacy Policy"/>
                            <AvCheckbox value="Return Policy" label="Return Policy"/>
                            <AvCheckbox value="Terms and Conditions" label="Terms and Conditions"/>
                        </AvCheckboxGroup>
                    </Col>
                    <Col md="6">
                        <AvField value={formOption.websiteIP} name="field81922011" label='Website IP*' type="text"
                                 placeholder="Website IP address" validate={{
                            required: {value: true, errorMessage: 'This field is required.'},
                            minLength: {value: 3, errorMessage: 'Your name must be between 3 and 60 characters'},
                            maxLength: {value: 60, errorMessage: 'Your name must be between 3 and 60 characters'}
                        }}/>
                    </Col>
                    <Col md="6">
                        <AvField value={formOption.sslIssuer} name="field81922012" label='SSL Certificate Issuer' type="text"
                                 placeholder="SSL Certificate Issuer"/>
                    </Col>
                    <Col md="6">
                        <AvField value={formOption.sslNumber} name="field81922013" label='SSL Certificate Number' type="text"
                                 placeholder="SSL Certificate Number"/>
                    </Col>
                </Row>
            </Col>
        );
    }

    submitForm = (e, error, values) => {
        this.setState({loading : true});
        this.preparePayload(values);
        Axios.post(setting.site_Setting.API_URL + 'applications/newMerchant', qs.stringify(values),
            {headers: {'Content-Type':'application/x-www-form-urlencoded'}})
            .then((x) => {
                toast['success']('New merchant application has been submitted successfully');
                this.setState({loading: false})
            }).catch(error=>{
            this.setState({loading:false});
            if(error.response !== undefined){
                toast['error'](error.response.data.message);
            } else {
                toast['error'](error.message);
            }
        });

    }

    render() {
        return (<Fragment>
            <ThemeOptions/>
            <AppHeader/>
            <div className="app-main">
                <AppSidebar/>
                <div className="app-main__outer">
                    <div className="app-main__inner">
                        <BlockUi tag="div" blocking={this.state.loading} className="block-overlay-dark"
                                 loader={<Loader color="#ffffff" active type="line-scale" />}>
                            <ReactCSSTransitionGroup
                            component="div"
                            transitionName="TabsAnimation"
                            transitionAppear={true}
                            transitionAppearTimeout={0}
                            transitionEnter={false}
                            transitionLeave={false}>
                            <PageTitle
                                heading="New Merchant Application"
                                icon="pe-7s-keypad icon-gradient bg-tempting-azure"
                                childPageName="New Merchant Application"
                                parentPageName="Applications"
                            />
                            <Container fluid>
                                <Card className="main-card mb-3">
                                    <CardBody>
                                        <AvForm  ref={c => (this.form = c)} onSubmit={this.submitForm}>
                                            <Row>
                                                {this.renderLegalEntityInformation()}
                                                {this.renderOwnerOrOfficerInformation()}
                                                {this.renderRequestProcessingType()}
                                                {this.renderMerchantLocationInformation()}
                                                {this.renderBusinessInformation()}
                                                {this.renderSettlementBankInformation()}
                                                {this.renderInternetQuestionnaire()}
                                            </Row>
                                            <Row>
                                                <Col md="12">
                                                    <FormGroup className={"pull-right"}>
                                                        <Button size="lg" className="mt-6" color="info">Submit</Button>
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                        </AvForm>
                                    </CardBody>
                                </Card>
                            </Container>
                        </ReactCSSTransitionGroup>
                        </BlockUi>
                    </div>
                    <AppFooter/>
                </div>
            </div>
        </Fragment>);
    }

    convertPhoneNumbers = (values) => {
        values['field81921903'] = '(' + values['field81921903'].replace('-', ') ');
        values['field81921974'] = '(' + values['field81921974'].replace('-', ') ');
    }

    preparePayload = ( values ) => {
        const {custStartDate, officerDOB} = this.state;
        values['form'] = 3571782;
        values['viewkey'] = "PgkUaZMcsR";
        values['password'] = "";
        values['hidden_fields'] = "";
        values['incomplete'] = "";
        values['incomplete_email'] = "";
        values['incomplete_password'] = "";
        values['referrer'] = "";
        values['referrer_type'] = "link";
        values['_submit'] = 1;
        values['style_version'] = 3;
        values['latitude'] = "";
        values['longitude'] = "";
        values['viewparam'] = 714271;
        values['field81902959Format'] = 'MDY';
        values['field81902959M'] = months[custStartDate.getMonth()];
        values['field81902959D'] = custStartDate.getDate();
        values['field81902959Y'] = custStartDate.getFullYear();
        values['field81921906Format'] = 'MDY';
        values['field81921906D'] = officerDOB.getDate() + 1;
        values['field81921906M'] = months[officerDOB.getMonth()];
        values['field81921906Y'] = officerDOB.getFullYear();
        values['field81921990[]'] = values['field81921990'][""].join();
        this.convertPhoneNumbers(values);
    }

}