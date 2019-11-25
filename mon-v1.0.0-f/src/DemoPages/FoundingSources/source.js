import React, {Fragment} from 'react';
import {Button, Col, Row} from "reactstrap";
import {AvField, AvForm} from "availity-reactstrap-validation";
import axios from 'axios'
import {setting} from './../../environment';
import brnv from 'bank-routing-number-validator'

export default class Source extends React.Component {
    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.removeSource = this.removeSource.bind(this);

        this.state = {
            editMode: false,
            source: {
                bankName: "",
                dda: "",
                source: ""
            },
            hideFrom: false
        }
    }

    componentDidMount() {
        this.setState({source: this.props.source})
    }

    removeSource() {
        const options = {
            headers: {'x-access-token': localStorage.getItem('jwttoken')}
        };

        axios.post(setting.site_Setting.API_URL + 'foundingSources/remove', {_id: this.state.source._id}, options).then((result) => {
            this.setState({hideFrom: true})
        }).catch(error => {

        })
    }

    handleSubmit(event, errors, values) {
        console.log(errors, values, this.state.source)
        if (!errors.length) {
            let dataTosend = values;
            dataTosend['_id'] = this.state.source._id

            const options = {
                headers: {'x-access-token': localStorage.getItem('jwttoken')}
            };

            axios.post(setting.site_Setting.API_URL + 'foundingSources/update', dataTosend, options).then((result) => {
                this.setState({source: result.data.body, editMode: false})
            }).catch(error => {

            })
        }
    }

    render() {
        const source = this.state.source;
        const self = this;
        const styles = {
            "display": this.state.hideFrom ? 'none' : 'block'
        };
        return (
            <Fragment>

                <Col style={styles} className="bottomcard" sm="4" xs="4"
                     xl="4" lg="4"
                     md="4">
                    <div className="source-wrapper">
                        <AvForm onSubmit={this.handleSubmit}>
                            {this.state.editMode &&
                            <div className='source-data'>
                                <AvField value={this.props.source.bankName} name="bankName"
                                         type="text"
                                         placeholder="Bank Name" validate={{
                                    pattern: {
                                        value: '^[A-Za-z0-9+!#$@-%&*(). ]{3,50}$',
                                        errorMessage: 'Bank name must be composed only with letter and numbers and min 3 symbols'
                                    }
                                }}/>
                                <AvField value={this.props.source.dda} name="dda"
                                         type="text"
                                         placeholder="DDA" validate={{
                                    pattern: {
                                        value: '^[0-9]{7,}$',
                                        errorMessage: 'DDA must be composed a least 7 number charter'
                                    }
                                }}/>
                                <AvField value={this.props.source.routing} name="routing"
                                         type="text"
                                         placeholder="Routing" validate={{
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
                            </div>}


                            {!this.state.editMode &&
                            <div className='source-data-edit'>
                                <div style={{
                                    "display": "flex",
                                    "flexDirection": "column"
                                }}>
                                    <div style={{
                                        "display": "flex",
                                        "lineHeight": "45px"
                                    }}>
                                                                                <span
                                                                                    style={{"flex": 1}}>Bank Name: </span><span
                                        style={{"flex": 1}}>{source.bankName}</span>
                                    </div>
                                    <div style={{
                                        "display": "flex",
                                        "lineHeight": "45px"
                                    }}>
                                                                                <span
                                                                                    style={{"flex": 1}}>DDA: </span><span
                                        style={{"flex": 1}}>{source.dda}</span>
                                    </div>
                                    <div style={{
                                        "display": "flex",
                                        "lineHeight": "45px"
                                    }}>
                                                                                <span
                                                                                    style={{"flex": 1}}>Routing: </span><span
                                        style={{"flex": 1}}>{source.routing}</span>
                                    </div>
                                </div>
                            </div>}

                            <Row className="pull-right">
                                <Col md="12">
                                    <div className={"pull-right"}>
                                        {!this.state.editMode && <Button onClick={() => {
                                            self.setState({editMode: true})
                                        }} size="lg" className="editSource mt-6" color="info">Edit</Button>}

                                        {this.state.editMode &&
                                        <div><span onClick={this.removeSource} className="removeSource">Remove</span>
                                            <Button size="lg" className="mt-6"
                                                    color="info">Update</Button></div>}
                                    </div>
                                </Col>
                            </Row>
                        </AvForm>
                    </div>
                </Col>


            </Fragment>);
    }
}
