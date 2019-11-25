import React, { Fragment } from 'react';
import { Button, Card, CardBody, CardTitle, Col, Container, FormGroup, Row } from 'reactstrap';
import { AvField, AvForm } from 'availity-reactstrap-validation';

import { errorMessage } from '../../reducers/ThemeMessages';
// Layout
import AppHeader from '../../Layout/AppHeader/';
import AppSidebar from '../../Layout/AppSidebar/';
import AppFooter from '../../Layout/AppFooter/';

// Theme Options
import { userInformation } from '../../reducers/ThemeOptions';
import Axios from 'axios';
import { setting } from '../../environment';
import { toast } from 'react-toastify';
import Accounts from './accounts';
var dateFormat = require('dateformat');
export default class VirtualAccounts extends React.Component {
    constructor() {
        super()
        this.state = {
            accounts: [],
            vtSubmission: {},
            submittedDate: dateFormat(new Date(), "isoDateTime")
        };
    }
    fetchall() {
        Axios.get(setting.site_Setting.API_URL + 'virtualAccount/virtualList', { headers: setting.jwtTokenHeader }).then((result) => {
            this.setState({ accounts: result.data.data.reverse() })
        }).catch(error => {

        })
    }
    componentDidMount() {
        this.fetchall();
    }
    submitVtAccountForm = (event, errors, values) => {
        this.setState({ errors, values });
        if (this.state.errors.length == 0) {
            this.state.vtSubmission = {
                userId: userInformation()._id,
                accountName: this.state.values.virtualaccountName,
                accountDescription: this.state.values.virtualaccountDescription,
                dateCreated: this.state.submittedDate
            }
            Axios.post(setting.site_Setting.API_URL + 'virtualAccount/submitData', this.state.vtSubmission, { headers: setting.jwtTokenHeader }).then(result => {
                let AccountId = result.data.data._id;
                toast.success(errorMessage('', '').VIRTUAL_ACCOUNT_CREATED);
                this.form && this.form.reset();
                this.fetchall();
            }).catch(error => {
                toast.error(errorMessage().ERROR_IN_STORED);
            });
        }
    }
    render() {
        return (
            <Fragment>
                <AppHeader />
                <div className="app-main">
                    <AppSidebar />
                    <div className="app-main__outer">
                        <div className="app-main__inner">
                            <Container fluid>
                                <Card className="main-card mb-3">
                                    <CardBody>
                                        <CardTitle>Virtual Account</CardTitle>
                                        <Row>
                                            <Col className="bottomcard" sm="4" xs="4" xl="4" lg="4" md="4">
                                                <div className="source-wrapper with-green">
                                                    <AvForm ref={c => (this.form = c)} onSubmit={this.submitVtAccountForm}>
                                                        <AvField
                                                            id="virtualaccountName"
                                                            name="virtualaccountName"
                                                            values={this.state.vtSubmission.virtualaccountName}
                                                            type="text"
                                                            placeholder="Virtual Account Name" validate={{
                                                                required: {
                                                                    value: true,
                                                                    errorMessage: 'This field is required.'
                                                                },
                                                                pattern: {
                                                                    value: '^[A-Za-z0-9+!@#$-%&*(). ]+$',
                                                                    errorMessage: 'Virtual Account Name must be composed only with letter and numbers'
                                                                },
                                                                minLength: {
                                                                    value: 3,
                                                                    errorMessage: 'Virtual Account Name must be between 3 and 50 characters'
                                                                },
                                                                maxLength: {
                                                                    value: 50,
                                                                    errorMessage: 'Virtual Account Name must be between 6 and 50 characters'
                                                                }
                                                            }} />
                                                        <AvField
                                                            id="virtualaccountDescription"
                                                            name="virtualaccountDescription"
                                                            values={this.state.vtSubmission.virtualaccountDescription}
                                                            type="text"
                                                            placeholder="Virtual Account Description" validate={{
                                                                required: {
                                                                    value: true,
                                                                    errorMessage: 'This field is required.'
                                                                },
                                                                pattern: {
                                                                    value: '^[A-Za-z0-9+,!@#$-%&*(). ]+$',
                                                                    errorMessage: 'Virtual Account Description must be composed only with letter and numbers'
                                                                },
                                                                minLength: {
                                                                    value: 3,
                                                                    errorMessage: 'Virtual Account Description must be between 3 and 50 characters'
                                                                },
                                                                maxLength: {
                                                                    value: 10000,
                                                                    errorMessage: 'Virtual Account Description must be between 6 and 50 characters'
                                                                }
                                                            }} />
                                                        <Row className="pull-right">
                                                            <Col md="12">
                                                                <FormGroup className={"pull-right"}>
                                                                    <Button type="submit" size="lg" className="mt-6"
                                                                        color="info">Create</Button>
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>
                                                    </AvForm>
                                                </div>
                                            </Col>
                                            {this.state.accounts.map((accounts) => {
                                                return (
                                                    <Accounts key={accounts._id} accounts={accounts} />
                                                )
                                            })}
                                        </Row>
                                    </CardBody>
                                </Card>
                            </Container>
                        </div>
                        <AppFooter />
                    </div>
                </div>
            </Fragment>
        )
    }
};