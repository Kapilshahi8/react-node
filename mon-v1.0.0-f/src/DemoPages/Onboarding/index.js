import React, {Fragment} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {Button, Card, CardBody, CardTitle, Col, Container, FormGroup, Row} from 'reactstrap';
import HeaderLight from '../../Layout/AppHeaderLight/';
import ThemeOptions from '../../Layout/ThemeOptions/';
import {AvField, AvForm, AvRadio, AvRadioGroup} from "availity-reactstrap-validation";
import {setting} from "../../environment";
import {toast} from "react-toastify";
import Loader from 'react-loaders';
import BlockUi from 'react-block-ui';
import axios from 'axios'
import brnv from "bank-routing-number-validator";

const ssn = require('ssn-validator')
const ein = require('ein-validator')

const options = [
    {label: 'Merchant - I sell products and sevices for my own company', value: 'MERCHANT'},
    {label: 'Agent - I want to refer new Merchants ', value: 'AGENT'},
    {label: 'ISO - I represent a group of Agents', value: 'ISO'},
    {label: 'Financial Institution - I\'ll be referring new ISO\'s, Agents or Merchants', value: 'ISO2'},
];

const CompanySizeoptions = [
    {label: '1 Solo', value: '1 Solo'},
    {label: '2 to 10', value: '2 to 10'},
    {label: '11 to 50', value: '11 to 50'},
    {label: '51 to 100', value: '51 to 100'},
    {label: '101 to 200', value: '101 to 200'},
    {label: '201 to 400', value: '201 to 400'},
    {label: '401 to 700', value: '401 to 700'},
    {label: '701 to 1000', value: '701 to 1000'},
    {label: '1001 to 2000', value: '1000 to 2000'},
    {label: 'over 2000', value: 'over 2000'},
];
export default class OnboardingPage extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    state = {
        loading: false
    }

    componentDidMount() {
        if (this.isOnboardingFinished()) {
            window.location.replace('#/dashboards/commerce')
        }
    }

    getParentId(role) {
        console.log(role)
        switch (role) {
            case 'ISO': {
                console.log(1)
                return setting.site_Setting.REACT_APP_MON_ADMIN_RELATION_ID
            }
            case 'AGENT': {
                console.log(2)
                return setting.site_Setting.REACT_APP_MON_ISO_RELATION_ID
            }
            case 'MERCHANT': {
                console.log(3)
                console.log(setting)
                return setting.site_Setting.REACT_APP_MON_AGENT_RELATION_ID
            }
            default: {
                console.log(4)
                return null
            }

        }
    }

    handleSubmit(event, errors, values) {
        if (!errors.length) {
            if (values.role == 'ISO2') {
                values.role = 'ISO'
                values.isFin = true
            }
            const userinformation = JSON.parse(localStorage.getItem('userinformation'))
            const user_id = userinformation['user_id']
            this.setState({loading: true})

            const dataTosendSources = {
                bankName: values.bankName,
                dda: values.dda,
                routing: values.routing
            }

            delete values.bankName;
            delete values.dda;
            delete values.routing;

            const dataToSend = {
                email: userinformation.email,
                user_metadata: {
                    updated: Date.now(),
                    onboardingPassed: true,
                    parentid: this.getParentId(values.role),
                    accountId: Date.now(),
                    ...values
                },
                app_metadata: {}
            }

            axios.post(setting.site_Setting.API_URL + 'users/' + user_id + '/update', dataToSend).then((result) => {

                const userData = {
                    user_metadata: result.data.body.user_metadata
                };
                localStorage.setItem('userinformation', JSON.stringify(Object.assign({}, JSON.parse(localStorage.getItem('userinformation')), userData)))
                toast['success']('Onboarding passed');


                dataTosendSources['userId'] = localStorage.getItem('user_mon_id')

                const options = {
                    headers: {'x-access-token': localStorage.getItem('jwttoken')}
                };

                axios.post(setting.site_Setting.API_URL + 'foundingSources', dataTosendSources, options).then((result) => {
                    this.setState({loading: false})
                    setTimeout(() => {
                        window.location.replace('#/dashboards/commerce')
                        window.location.reload(true)
                    }, 1000)

                }).catch(error => {
                    this.setState({loading: false})
                    setTimeout(() => {
                        window.location.replace('#/dashboards/commerce')
                        window.location.reload(true)
                    }, 1000)
                })


            }).catch(error => {
                this.setState({loading: false});
                if (error.response !== undefined) {
                    toast['error'](error.response.data.message);
                } else {
                    toast['error'](error.message);
                }
            })
        }
    }

    isOnboardingFinished() {
        const userinformation = JSON.parse(localStorage.getItem('userinformation'))
        return userinformation.user_metadata ? Boolean(userinformation.user_metadata.onboardingPassed) == true : false
    }

    render() {
        let formData = {
            firstName: "",
            lastName: "",
            title: "",
            role: "",
            phone: "",
            api_access: '0',
            companyName: "",
            companySize: "",
            add1: "",
            add2: "",
            city: "",
            state: "",
            zip: "",
            country: "",
            website: "",
            einSocialNumber: ""

        }


        const userinformation = JSON.parse(localStorage.getItem('userinformation'))
        if (userinformation['given_name']) {
            console.log(userinformation)
            const firstName = userinformation['given_name'];
            const lastName = userinformation['family_name'];

            formData = {
                ...formData,
                firstName,
                lastName
            }

        } else {
            const name = userinformation['name']
            const [firstName, lastName] = name.split(' ')
            const role = userinformation['user_metadata']['role']
            const zip = userinformation['user_metadata']['zip']
            const companyName = userinformation['user_metadata']['companyName']
            const state = userinformation['user_metadata']['state']
            const country = userinformation['user_metadata']['country']
            formData = {
                ...formData,
                firstName,
                lastName,
                role,
                zip,
                companyName,
                state,
                country
            }
        }

        return (
            <Fragment>
                <ThemeOptions/>
                <HeaderLight/>
                <div className="app-main">
                    <div className="app-main__outer onboarding">
                        <div className="app-main__inner">
                            <BlockUi tag="div" blocking={this.state.loading} className="block-overlay-dark"
                                     loader={<Loader color="#ffffff" active type="line-scale"/>}>
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
                                                <CardTitle>Onboarding</CardTitle>
                                                <AvForm ref={c => (this.form = c)}
                                                        model={formData}
                                                        onSubmit={this.handleSubmit}>
                                                    <Row>
                                                        <Col md="12">
                                                            <Row>
                                                                <Col md="12">
                                                                    <p className={"menu-header-title text-capitalize mb-2 mt-2"}>Personal
                                                                        Information</p>
                                                                    <Row>
                                                                        <Col md="6">
                                                                            <AvField value=""
                                                                                     name="firstName" label="First Name"
                                                                                     type="text"
                                                                                     placeholder="First Name"
                                                                                     validate={{
                                                                                         required: {
                                                                                             value: true,
                                                                                             errorMessage: 'This field is required.'
                                                                                         },
                                                                                         minLength: {
                                                                                             value: 3,
                                                                                             errorMessage: 'Your name must be between 3 and 90 characters'
                                                                                         },
                                                                                         maxLength: {
                                                                                             value: 90,
                                                                                             errorMessage: 'Your name must be between 6 and 90 characters'
                                                                                         }
                                                                                     }}/>
                                                                        </Col>
                                                                        <Col md="6">
                                                                            <AvField value=""
                                                                                     name="lastName" label="Last Name"
                                                                                     type="text" placeholder="Last Name"
                                                                                     validate={{
                                                                                         required: {
                                                                                             value: true,
                                                                                             errorMessage: 'This field is required.'
                                                                                         },
                                                                                         minLength: {
                                                                                             value: 3,
                                                                                             errorMessage: 'Your name must be between 3 and 90 characters'
                                                                                         },
                                                                                         maxLength: {
                                                                                             value: 90,
                                                                                             errorMessage: 'Your name must be between 6 and 90 characters'
                                                                                         }
                                                                                     }}/>
                                                                        </Col>
                                                                    </Row>

                                                                    <Row>
                                                                        <Col md="6">
                                                                            <AvField value=""
                                                                                     name="title" label="Title"
                                                                                     type="text"
                                                                                     placeholder="Title" validate={{
                                                                                required: {
                                                                                    value: true,
                                                                                    errorMessage: 'This field is required.'
                                                                                }
                                                                            }}/>
                                                                        </Col>
                                                                        <Col md="6">
                                                                            <AvField value=""
                                                                                     name="phone" label="Phone"
                                                                                     type="text"
                                                                                     placeholder="Phone" validate={{
                                                                                required: {
                                                                                    value: true,
                                                                                    errorMessage: 'This field is required.'
                                                                                },
                                                                            }}/>
                                                                        </Col>
                                                                    </Row>

                                                                    <Row>
                                                                        <Col md="6">
                                                                            <AvField value=""
                                                                                     name="website" label="Website"
                                                                                     type="text"
                                                                                     placeholder="Website"
                                                                                     validate={{
                                                                                         required: {
                                                                                             value: true,
                                                                                             errorMessage: 'This field is required.'
                                                                                         },
                                                                                         pattern: {
                                                                                             value: /^(https?:\/\/)?(www\.)?([a-zA-Z0-9]+(-?[a-zA-Z0-9])*\.)+[\w]{2,}(\/\S*)?$/,
                                                                                             errorMessage: 'invalid websites'
                                                                                         }

                                                                                     }}/>
                                                                        </Col>
                                                                        <Col md="6">
                                                                            <AvField value=""
                                                                                     name="einSocialNumber"
                                                                                     label="EIN or Social Security Number"
                                                                                     type="text"
                                                                                     placeholder="EIN or Social Security Number"
                                                                                     validate={{
                                                                                         required: {
                                                                                             value: true,
                                                                                             errorMessage: 'This field is required.'
                                                                                         },
                                                                                         async: function (value, ctx, input, cb) {
                                                                                             if (value.length > 3) {


                                                                                                 if (value.includes('-')) {
                                                                                                     const isValid = ssn.isValid(value) || ein.isValid(value)
                                                                                                    console.log(isValid)
                                                                                                     if (isValid) {
                                                                                                         cb(true)
                                                                                                     } else {
                                                                                                         cb('Number is invalid')
                                                                                                     }
                                                                                                 } else {
                                                                                                     cb('Number is invalid')
                                                                                                 }
                                                                                             } else {
                                                                                                 cb(true)
                                                                                             }

                                                                                         }
                                                                                     }}/>
                                                                        </Col>
                                                                    </Row>

                                                                    <Row>
                                                                        <Col md={6}>
                                                                            <FormGroup>
                                                                                <AvField type="select" value=""
                                                                                         label="What role best describes you"
                                                                                         id="role"
                                                                                         name="role" required>
                                                                                    <option value="">Select Role
                                                                                    </option>
                                                                                    {options && options.map(data =>
                                                                                        <option key={data.value}
                                                                                                value={data.value}> {data.label} </option>
                                                                                    )}
                                                                                </AvField>
                                                                            </FormGroup>
                                                                        </Col>

                                                                        <Col md={6}>
                                                                            <label>Are you a technical developer that
                                                                                requires API access?</label>
                                                                            <AvRadioGroup inline name="api_access"
                                                                                          label=""
                                                                                          value=""
                                                                                          required>
                                                                                <AvRadio label="Yes" value="1"/>
                                                                                <AvRadio label="No" value="0"/>
                                                                            </AvRadioGroup>
                                                                        </Col>
                                                                    </Row>
                                                                </Col>
                                                            </Row>

                                                            <hr></hr>
                                                        </Col>

                                                        <Col md="12">
                                                            <Row>
                                                                <Col md="12">
                                                                    <p className={"menu-header-title text-capitalize mb-2 mt-2"}>Company
                                                                        Headquarters Address</p>
                                                                    <Row>
                                                                        <Col md="6">
                                                                            <AvField value=""
                                                                                     name="companyName"
                                                                                     label="Company Name"
                                                                                     type="text"
                                                                                     placeholder="Company Name"
                                                                                     validate={{
                                                                                         required: {
                                                                                             value: true,
                                                                                             errorMessage: 'This field is required.'
                                                                                         },

                                                                                         minLength: {
                                                                                             value: 3,
                                                                                             errorMessage: 'Your name must be between 3 and 96 characters'
                                                                                         },
                                                                                         maxLength: {
                                                                                             value: 96,
                                                                                             errorMessage: 'Your name must be between 6 and 96 characters'
                                                                                         }
                                                                                     }}/>
                                                                        </Col>
                                                                        <Col md="6">
                                                                            <FormGroup>
                                                                                <AvField type="select" value=""
                                                                                         label="Company Size"
                                                                                         id="companySize"
                                                                                         name="companySize" required>
                                                                                    <option value="">Select Size
                                                                                    </option>
                                                                                    {CompanySizeoptions && CompanySizeoptions.map(data =>
                                                                                        <option key={data.value}
                                                                                                value={data.value}> {data.label} </option>
                                                                                    )}
                                                                                </AvField>
                                                                            </FormGroup>
                                                                        </Col>
                                                                        <Col md="12">
                                                                            <AvField value=""
                                                                                     name="add1" label="Address 1"
                                                                                     type="text" placeholder="Address"
                                                                                     validate={{
                                                                                         required: {
                                                                                             value: true,
                                                                                             errorMessage: 'This field is required.'
                                                                                         },
                                                                                         minLength: {
                                                                                             value: 3,
                                                                                             errorMessage: 'Your name must be between 3 and 16 characters'
                                                                                         },
                                                                                         maxLength: {
                                                                                             value: 66,
                                                                                             errorMessage: 'Your name must be between 6 and 16 characters'
                                                                                         }
                                                                                     }}/>
                                                                        </Col>
                                                                        <Col md="12">
                                                                            <AvField value=""
                                                                                     name="add2" label="Address 2"
                                                                                     type="text" placeholder="Address"
                                                                                     validate={{
                                                                                         maxLength: {
                                                                                             value: 66,
                                                                                             errorMessage: 'Your name must be between 6 and 16 characters'
                                                                                         }
                                                                                     }}/>
                                                                        </Col>
                                                                        <Col md={6}>
                                                                            <FormGroup>
                                                                                <AvField value=""
                                                                                         name="city" label="City"
                                                                                         type="text" placeholder="City"
                                                                                         validate={{
                                                                                             required: {
                                                                                                 value: true,
                                                                                                 errorMessage: 'This field is required.'
                                                                                             },
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

                                                                                <AvField value=""
                                                                                         name="state"
                                                                                         label="State/Province"
                                                                                         type="text" placeholder=""
                                                                                         validate={{
                                                                                             required: {
                                                                                                 value: true,
                                                                                                 errorMessage: 'This field is required.'
                                                                                             }
                                                                                         }}/>


                                                                            </FormGroup>
                                                                        </Col>
                                                                        <Col md="6">
                                                                            <AvField value=""
                                                                                     name="zip" label="Zip Code"
                                                                                     type="text" placeholder="Zip Code"
                                                                                     validate={{
                                                                                         required: {
                                                                                             value: true,
                                                                                             errorMessage: 'This field is required.'
                                                                                         },

                                                                                         minLength: {
                                                                                             value: 3,
                                                                                             errorMessage: 'Your name must be between 3 and 16 characters'
                                                                                         },
                                                                                         maxLength: {
                                                                                             value: 96,
                                                                                             errorMessage: 'Your name must be between 6 and 16 characters'
                                                                                         }
                                                                                     }}/>
                                                                        </Col>
                                                                        <Col md="6">
                                                                            <AvField value=""
                                                                                     name="country" label="Country"
                                                                                     type="text" placeholder=""
                                                                                     validate={{
                                                                                         required: {
                                                                                             value: true,
                                                                                             errorMessage: 'This field is required.'
                                                                                         }
                                                                                     }}/>
                                                                        </Col>
                                                                    </Row>
                                                                </Col>
                                                            </Row>
                                                        </Col>


                                                        <Col md="12">
                                                            <Row>
                                                                <Col md="12">
                                                                    <p className={"menu-header-title text-capitalize mb-2 mt-2"}>Bank
                                                                        Account</p>
                                                                    <Row>
                                                                        <Col md="4">
                                                                            <AvField value="" name="bankName"
                                                                                     type="text"
                                                                                     placeholder="Bank Name" validate={{
                                                                                required: {
                                                                                    value: true,
                                                                                    errorMessage: 'This field is required.'
                                                                                },
                                                                                pattern: {
                                                                                    value: /^[A-Za-z0-9+!#$@\-%&*(). ]{3,50}$/,
                                                                                    errorMessage: 'Bank name must be composed only with letter and numbers and min 3 symbols'
                                                                                }
                                                                            }}/>
                                                                        </Col>
                                                                        <Col md="4">
                                                                            <FormGroup>
                                                                                <AvField value="" name="dda"
                                                                                         type="text"
                                                                                         placeholder="DDA" validate={{
                                                                                    required: {
                                                                                        value: true,
                                                                                        errorMessage: 'This field is required.'
                                                                                    },
                                                                                    pattern: {
                                                                                        value: /^[0-9]{7,}$/,
                                                                                        errorMessage: 'DDA must be composed a least 7 number charter'
                                                                                    }
                                                                                }}/>
                                                                            </FormGroup>
                                                                        </Col>
                                                                        <Col md="4">
                                                                            <AvField value="" name="routing"
                                                                                     type="text"
                                                                                     placeholder="Routing" validate={{
                                                                                required: {
                                                                                    value: true,
                                                                                    errorMessage: 'This field is required.'
                                                                                },
                                                                                pattern: {
                                                                                    value: '^[0-9]{9}$',
                                                                                    errorMessage: 'Routing must be composed only with 9 numbers'
                                                                                },
                                                                                async: function (value, ctx, input, cb) {
                                                                                    if (value.length == 9) {
                                                                                        const isValid = brnv.ABARoutingNumberIsValid(value)
                                                                                        console.log(isValid)
                                                                                        if (isValid) {
                                                                                            cb(true)
                                                                                        } else {
                                                                                            cb('Routing number is invalid')
                                                                                        }
                                                                                    } else {
                                                                                        cb(true)
                                                                                    }

                                                                                }
                                                                            }}/>
                                                                        </Col>
                                                                    </Row>
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                    </Row>
                                                    <Row className="pull-right">
                                                        <Col md="12">
                                                            <FormGroup className={"pull-right"}>
                                                                <Button size="lg" className="mt-6" color="info">Complete
                                                                    Onboarding</Button>
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
                    </div>
                </div>
            </Fragment>);
    }
}
