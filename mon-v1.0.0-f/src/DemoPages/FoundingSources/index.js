import React, {Fragment} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {Button, Card, CardBody, CardTitle, Col, Container, FormGroup, Row} from 'reactstrap';
import {AvField, AvForm} from 'availity-reactstrap-validation';
import AppHeader from '../../Layout/AppHeader/';
import AppSidebar from '../../Layout/AppSidebar/';
import AppFooter from '../../Layout/AppFooter/';
import ThemeOptions from '../../Layout/ThemeOptions/';
import axios from 'axios'
import {setting} from './../../environment';
import Sorce from './source'
import brnv from 'bank-routing-number-validator'

// = require('bank-routing-number-validator')

export default class FoundingSourcesPage extends React.Component {
    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    state = {
        sources: [],
        routing: '',
        dda: '',
        bankName: ''
    }

    componentDidMount() {
        const options = {
            headers: {'x-access-token': localStorage.getItem('jwttoken')}
        };

        axios.get(setting.site_Setting.API_URL + 'foundingSources?userId=' + localStorage.getItem('user_mon_id'), options).then((result) => {
            this.setState({sources: result.data.data.reverse()})
        }).catch(error => {

        })
    }

    handleSubmit(event, errors, values) {
        console.log(event, errors, values)

        const self = this
        if (!errors.length) {
            let dataTosend = values;
            dataTosend['userId'] = localStorage.getItem('user_mon_id')

            const options = {
                headers: {'x-access-token': localStorage.getItem('jwttoken')}
            };

            axios.post(setting.site_Setting.API_URL + 'foundingSources', dataTosend, options).then((result) => {

                let sources = self.state.sources;
                sources.unshift(result.data.data);

                const routing = '';
                const dda = '';
                const bankName = '';


                self.setState({sources: sources, routing, dda, bankName})
                console.log(self.state)
                document.getElementById('routing').value = '';
                document.getElementById('dda').value = '';
                document.getElementById('bankName').value = '';
                self.form && self.form.reset();

            }).catch(error => {

            })
        }
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
                                            <CardTitle>Funding Sources</CardTitle>
                                            <Row>
                                                <Col className="bottomcard" sm="4" xs="4" xl="4" lg="4" md="4">
                                                    <div className="source-wrapper with-green">
                                                        <AvForm ref={c => (this.form = c)} onSubmit={this.handleSubmit}>
                                                            <div className='source-data'>
                                                                <AvField
                                                                    id="bankName"
                                                                    name="bankName"
                                                                    type="text"
                                                                    placeholder="Bank Name" validate={{
                                                                    required: {
                                                                        value: true,
                                                                        errorMessage: 'This field is required.'
                                                                    },
                                                                    pattern: {
                                                                        value: '^[A-Za-z0-9+!@#$-%&*(). ]+$',
                                                                        errorMessage: 'Bank name must be composed only with letter and numbers'
                                                                    },
                                                                    minLength: {
                                                                        value: 3,
                                                                        errorMessage: 'Bank name must be between 3 and 50 characters'
                                                                    },
                                                                    maxLength: {
                                                                        value: 50,
                                                                        errorMessage: 'Bank name must be between 6 and 50 characters'
                                                                    }
                                                                }}/>
                                                                <AvField
                                                                    id="dda"
                                                                    name="dda"
                                                                    type="text"
                                                                    placeholder="DDA" validate={{
                                                                    required: {
                                                                        value: true,
                                                                        errorMessage: 'This field is required.'
                                                                    },
                                                                    pattern: {
                                                                        value: '^[0-9]+$',
                                                                        errorMessage: 'DDA must be composed only with numbers'
                                                                    },
                                                                    minLength: {
                                                                        value: 7,
                                                                        errorMessage: 'DDA must be a least 7 characters'
                                                                    },
                                                                    maxLength: {
                                                                        value: 50,
                                                                        errorMessage: 'DDA must be a least 7 characters'
                                                                    }
                                                                }}/>
                                                                <AvField id="routing"
                                                                         name="routing"
                                                                         type="text"
                                                                         placeholder="Routing" validate={{
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
                                                                        errorMessage: 'Routing must be 9 characters'
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
                                                            </div>

                                                            <Row className="pull-right">
                                                                <Col md="12">
                                                                    <FormGroup className={"pull-right"}>
                                                                        <Button size="lg" className="mt-6"
                                                                                color="info">Create</Button>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                        </AvForm>
                                                    </div>
                                                </Col>

                                                {this.state.sources.map((source) => {
                                                    return (
                                                        <Sorce key={source._id} source={source}/>
                                                    )
                                                })}
                                            </Row>
                                        </CardBody>
                                    </Card>
                                </Container>
                            </ReactCSSTransitionGroup>
                        </div>
                        <AppFooter/>
                    </div>
                </div>
            </Fragment>);
    }
}
