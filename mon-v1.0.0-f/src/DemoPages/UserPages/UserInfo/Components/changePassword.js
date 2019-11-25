import React, { Component, Fragment } from 'react';
import { CardBody, CardTitle, Col, Card, FormGroup, Row, Button } from 'reactstrap';
import { AvField, AvForm } from 'availity-reactstrap-validation';

export default class ChangePassword extends Component {
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
                <Card className="main-card mb-3">
                    <CardBody>
                        <CardTitle>Change Password</CardTitle>
                        <Row className="pull-right">
                            <Col md="12">
                                <FormGroup className={"pull-right"}>
                                    <Button size="lg" className="mt-6"
                                        color="info">Recover Password</Button>
                                </FormGroup>
                            </Col>
                        </Row>
                        <AvForm onSubmit={this.handleSubmit}>
                            <Row>
                                <Col md="12">
                                    <Row>
                                        <Col md="12">
                                            <Row>
                                                <Col md="8">
                                                    <AvField name="existingpassword"
                                                        label="Existing Password" type="text"
                                                        placeholder="Existing Password" />
                                                </Col>

                                            </Row>
                                            <Row>
                                                <Col md="8">
                                                    <AvField name="lname"
                                                        label="New Password" type="text"
                                                        placeholder="New Password" />
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md="8">
                                                    <AvField name="lname"
                                                        label="Confirm New Password" type="text"
                                                        placeholder="Confirm New Password" />
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <Row className="pull-right">
                                        <Col md="12">
                                            <FormGroup className={"pull-right"}>
                                                <Button size="lg" className="mt-6"
                                                    color="info">Update</Button>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </AvForm>
                    </CardBody>
                </Card>
            </Fragment>
        )
    }
}