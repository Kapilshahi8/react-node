import React, {Fragment} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {Button, Card, CardBody, CardTitle, Col, Container, FormGroup, Row} from 'reactstrap';
import {AvField, AvForm} from 'availity-reactstrap-validation';
import Loader from 'react-loaders';
import BlockUi from 'react-block-ui';
import {setting} from '../../../../environment';
import axios from 'axios'
import {toast} from "react-toastify";

export default class BillRatesPage extends React.Component {
    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.OnclickHendler = this.OnclickHendler.bind(this);
        this.backToEdit = this.backToEdit.bind(this);

        this.state = {
            formData: {
                r1: "1.0",
                r2: "1.0",
                r3: "1.0",
                r4: "1.0",
                r5: "1.0",
                r6: "1.0",
                r7: "1.0",
                r8: "1.0",
                r9: "1.0",
                r10: "1.0",
                r11: "1.0",
                r12: "1.0",
                r13: "1.0",
                r14: "1.0",
                r15: "1.0",
                r16: "1.0",
                r17: "1.0",
                r18: "1.0",
                r19: "1.0",
                r20: "1.0",
                r21: "1.0",
                r22: "1.0",
                r23: "1.0",
                discountValue: "1.0",
                discountType: '$',
                perTransaction: "1.0",
                debit: "1.0",
                sameDayDebit: "1.0",
                credit: "1.0",
                sameDayCredit: "1.0",
                preNote: "1.0",
                refund: "1.0",
                applicationFee: "1.0",
                settlementTime: "1",
                reserveAmount: 1
            },

            currentData: null,
            upcommingData: null,
            loading: false,
            userId: localStorage.getItem('user_mon_id'),
            viewMode: false
        }
    }

    componentDidMount() {
        const options = {
            headers: {'x-access-token': localStorage.getItem('jwttoken')}
        };
        this.setState({loading: true})
        axios.get(setting.site_Setting.API_URL + 'billRate?userId=' + localStorage.getItem('user_mon_id'), {headers: setting.jwtTokenHeader}).then(result => {
            this.setState({loading: false})

            var rateData = result.data.data[0];
            if (rateData) this.setState({formData: rateData, currentData: rateData})

            axios.get(setting.site_Setting.API_URL + 'billRate/upcomming?userId=' + localStorage.getItem('user_mon_id'), {headers: setting.jwtTokenHeader}).then((result) => {
                var rateData = result.data.data[0];
                if (rateData) this.setState({formData: rateData, upcommingData: rateData})
            }).catch((error) => {
                this.setState({loading: false})
                if (error.response !== undefined) {
                    toast['error'](error.response.data.message);
                } else {
                    toast['error'](error.message);
                }
            })
        }).catch((error) => {
            this.setState({loading: false})
            if (error.response !== undefined) {
                toast['error'](error.response.data.message);
            } else {
                toast['error'](error.message);
            }
        })
    }

    handleSubmit(event, errors, values) {

        if (!errors.length) {
            const options = {
                headers: {'x-access-token': localStorage.getItem('jwttoken')}
            };
            this.setState({loading: true})

            let dateCreated = new Date();
            dateCreated.setHours(0);
            dateCreated.setMinutes(0);
            dateCreated.setSeconds(0);
            let dataTosend = values;

            // if we have current rate and future rate
            // We can only update future rate
            // Future rate will applied from tomorrow date
            // Dont update dateCreated and userId fields
            if (this.state.currentData && this.state.upcommingData) {
                axios.put(setting.site_Setting.API_URL + 'billRate/' + this.state.upcommingData['_id'], dataTosend, options).then((result) => {
                    this.setState({loading: false})
                }).catch(error => {
                    this.setState({loading: false})
                    if (error.response !== undefined) {
                        toast['error'](error.response.data.message);
                    } else {
                        toast['error'](error.message);
                    }
                })
            } else {

                // we already have current rate. New will be created but will take effect from tomorrow
                // we need add userId and dateCreated = tomorrow date
                if (this.state.currentData) {

                    dateCreated.setDate(dateCreated.getDate() + 1);

                    dataTosend.dateCreated = dateCreated;
                    dataTosend.userId = this.state.userId;

                    axios.post(setting.site_Setting.API_URL + 'billRate/create', dataTosend, options).then((result) => {
                        this.setState({loading: false})
                        let data = result.data.data;
                        delete data.userId
                        this.setState({formData: data, upcommingData: data})
                        toast['success']('Bill Rate was saved');
                    }).catch((error) => {
                        this.setState({loading: false})
                        if (error.response !== undefined) {
                            toast['error'](error.response.data.message);
                        } else {
                            toast['error'](error.message);
                        }
                    })
                } else {
                    // We dont have any current or future rate SO we creates our first rate
                    dataTosend.dateCreated = dateCreated;
                    dataTosend.userId = this.state.userId;

                    axios.post(setting.site_Setting.API_URL + 'billRate/create', dataTosend, options).then((result) => {
                        this.setState({loading: false})
                        let data = result.data.data;
                        this.setState({formData: data, currentData: data})
                        delete data.userId
                        toast['success']('Bill Rate was saved');
                    }).catch((error) => {
                        this.setState({loading: false})
                        if (error.response !== undefined) {
                            toast['error'](error.response.data.message);
                        } else {
                            toast['error'](error.message);
                        }
                    })
                }


            }
        }
    }

    getEditNotice(top = false) {

        let dateCreated = new Date();
        dateCreated.setHours(0);
        dateCreated.setMinutes(0);
        dateCreated.setSeconds(0);
        dateCreated.setDate(dateCreated.getDate() + 1);

        if (top) {
            return 'That is future rate data that will be apply from ' + `${dateCreated.getMonth()}/${dateCreated.getDate()}/${dateCreated.getFullYear()} 00:00:00`

        }

        if (this.state.currentData && !this.state.upcommingData) {
            return 'If you want update rates. Notice that new Rates will be applied tomorrow from ' + `${dateCreated.getMonth()}/${dateCreated.getDate()}/${dateCreated.getFullYear()} 00:00:00`
        }

        if (this.state.currentData && this.state.upcommingData) {
            return 'You can just update future rate';
        }

        return ''
    }

    OnclickHendler(event) {
        this.setState({formData: this.state.currentData, viewMode: true})
    }

    backToEdit() {
        this.setState({formData: this.state.upcommingData, viewMode: false})
    }

    updateType(event, data) {
        if (data === '%') {
            console.log(111)
            this.setState({
                formData: {
                    ...this.state.formData,
                    discountValue: parseInt(this.state.formData.discountValue)
                }
            })
        }
        if (data === '$') {
            this.setState({
                formData: {
                    ...this.state.formData,
                    discountValue: parseFloat(this.state.formData.discountValue).toFixed(1)
                }
            })
        }

        //parseFloat(1).toFixed(1)
    }

    render() {
        return (
            <Fragment>
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
                                    <CardTitle>Bill Rates</CardTitle>
                                    <Row>
                                        <Col md="12">
                                            {this.state.currentData && this.state.upcommingData && !this.state.viewMode &&
                                            <span style={{"color": "red"}}>
                                                {this.getEditNotice(true)}<br/>
                                                You can only edit future rate <br/>
                                                If you want to see current rates <span
                                                style={{"text-decoration": "underline", "cursor": "pointer"}}
                                                onClick={this.OnclickHendler}>click here</span>
                                            </span>}
                                            {this.state.viewMode &&
                                            <span style={{"color": "red"}}>
                                                <span style={{"text-decoration": "underline", "cursor": "pointer"}}
                                                      onClick={this.backToEdit}> back to edit mode</span>
                                            </span>}
                                        </Col>
                                    </Row>
                                    <AvForm onSubmit={this.handleSubmit}>
                                        <Row>
                                            <Col md="12">
                                                <p className={"menu-header-title text-capitalize mb-2 mt-2"}>Fees</p>
                                                <Row>
                                                    <Col md="6">
                                                        <Row>
                                                            <Col md="10">
                                                                <AvField
                                                                    step={this.state.formData.discountType === '$' ? '0.1' : '1'}
                                                                    value={this.state.formData.discountValue}
                                                                    name="discountValue"
                                                                    label="Discount Rate" type="number"
                                                                    disabled={this.state.viewMode}
                                                                    placeholder="" validate={{
                                                                    required: {
                                                                        value: true,
                                                                        errorMessage: 'This field is required.'
                                                                    },
                                                                }}/>
                                                            </Col>
                                                            <Col md="2">
                                                                <AvField type="select"
                                                                         value={this.state.formData.discountType}
                                                                         label="&nbsp;"
                                                                         onChange={this.updateType.bind(this)}
                                                                         disabled={this.state.viewMode}
                                                                         name="discountType"
                                                                         required>
                                                                    <option value="%">%</option>
                                                                    <option value="$">$</option>
                                                                </AvField>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                    <Col md="6">
                                                        <Row>
                                                            <Col md="12">
                                                                <AvField step="0.1"
                                                                         value={this.state.formData.perTransaction}
                                                                         name="perTransaction"
                                                                         disabled={this.state.viewMode}
                                                                         label="Per Transaction" type="number"
                                                                         placeholder="" validate={{
                                                                    required: {
                                                                        value: true,
                                                                        errorMessage: 'This field is required.'
                                                                    },
                                                                }}/>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                        <div className="divider"></div>
                                        <Row>
                                            <Col md="12">
                                                <p className={"menu-header-title text-capitalize mb-2 mt-2"}>Return
                                                    Pricing</p>
                                                <Row>
                                                    <Col md="1">
                                                        <AvField step="0.1" value={this.state.formData.r1} name="r1"
                                                                 label="R1" type="number"
                                                                 disabled={this.state.viewMode}
                                                                 placeholder="" validate={{
                                                            required: {
                                                                value: true,
                                                                errorMessage: 'This field is required.'
                                                            },
                                                        }}/>
                                                    </Col>
                                                    <Col md="1">
                                                        <AvField step="0.1" value={this.state.formData.r2} name="r2"
                                                                 label="R2" type="number"
                                                                 disabled={this.state.viewMode}
                                                                 placeholder="" validate={{
                                                            required: {
                                                                value: true,
                                                                errorMessage: 'This field is required.'
                                                            },
                                                        }}/>
                                                    </Col>
                                                    <Col md="1">
                                                        <AvField step="0.1" value={this.state.formData.r3} name="r3"
                                                                 label=" R3" type="number"
                                                                 disabled={this.state.viewMode}
                                                                 placeholder="" validate={{
                                                            required: {
                                                                value: true,
                                                                errorMessage: 'This field is required.'
                                                            },
                                                        }}/>
                                                    </Col>
                                                    <Col md="1">
                                                        <AvField step="0.1" value={this.state.formData.r4} name="r4"
                                                                 label="R4" type="number"
                                                                 disabled={this.state.viewMode}
                                                                 placeholder="" validate={{
                                                            required: {
                                                                value: true,
                                                                errorMessage: 'This field is required.'
                                                            },
                                                        }}/>
                                                    </Col>
                                                    <Col md="1">
                                                        <AvField step="0.1" value={this.state.formData.r5} name="r5"
                                                                 label="R5" type="number"
                                                                 disabled={this.state.viewMode}
                                                                 placeholder="" validate={{
                                                            required: {
                                                                value: true,
                                                                errorMessage: 'This field is required.'
                                                            },
                                                        }}/>
                                                    </Col>
                                                    <Col md="1">
                                                        <AvField step="0.1" value={this.state.formData.r6} name="r6"
                                                                 label="R6" type="number"
                                                                 disabled={this.state.viewMode}
                                                                 placeholder="" validate={{
                                                            required: {
                                                                value: true,
                                                                errorMessage: 'This field is required.'
                                                            },
                                                        }}/>
                                                    </Col>

                                                    <Col md="1">
                                                        <AvField step="0.1" value={this.state.formData.r7} name="r7"
                                                                 label="R7" type="number"
                                                                 disabled={this.state.viewMode}
                                                                 placeholder="" validate={{
                                                            required: {
                                                                value: true,
                                                                errorMessage: 'This field is required.'
                                                            },
                                                        }}/>
                                                    </Col>
                                                    <Col md="1">
                                                        <AvField step="0.1" value={this.state.formData.r8} name="r8"
                                                                 label="R8" type="number"
                                                                 disabled={this.state.viewMode}
                                                                 placeholder="" validate={{
                                                            required: {
                                                                value: true,
                                                                errorMessage: 'This field is required.'
                                                            },
                                                        }}/>
                                                    </Col>
                                                    <Col md="1">
                                                        <AvField step="0.1" value={this.state.formData.r9} name="r9"
                                                                 label=" R9" type="number"
                                                                 disabled={this.state.viewMode}
                                                                 placeholder="" validate={{
                                                            required: {
                                                                value: true,
                                                                errorMessage: 'This field is required.'
                                                            },
                                                        }}/>
                                                    </Col>
                                                    <Col md="1">
                                                        <AvField step="0.1" value={this.state.formData.r10} name="r10"
                                                                 label="R10" type="number"
                                                                 disabled={this.state.viewMode}
                                                                 placeholder="" validate={{
                                                            required: {
                                                                value: true,
                                                                errorMessage: 'This field is required.'
                                                            },
                                                        }}/>
                                                    </Col>
                                                    <Col md="1">
                                                        <AvField step="0.1" value={this.state.formData.r11} name="r11"
                                                                 label="R11" type="number"
                                                                 disabled={this.state.viewMode}
                                                                 placeholder="" validate={{
                                                            required: {
                                                                value: true,
                                                                errorMessage: 'This field is required.'
                                                            },
                                                        }}/>
                                                    </Col>
                                                    <Col md="1">
                                                        <AvField step="0.1" value={this.state.formData.r12} name="r12"
                                                                 label="R12" type="number"
                                                                 disabled={this.state.viewMode}
                                                                 placeholder="" validate={{
                                                            required: {
                                                                value: true,
                                                                errorMessage: 'This field is required.'
                                                            },
                                                        }}/>
                                                    </Col>
                                                </Row>

                                                <Row>
                                                    <Col md="1">
                                                        <AvField step="0.1" value={this.state.formData.r13} name="r13"
                                                                 label="R13" type="number"
                                                                 disabled={this.state.viewMode}
                                                                 placeholder="" validate={{
                                                            required: {
                                                                value: true,
                                                                errorMessage: 'This field is required.'
                                                            },
                                                        }}/>
                                                    </Col>
                                                    <Col md="1">
                                                        <AvField step="0.1" value={this.state.formData.r14} name="r14"
                                                                 label="R14" type="number"
                                                                 disabled={this.state.viewMode}
                                                                 placeholder="" validate={{
                                                            required: {
                                                                value: true,
                                                                errorMessage: 'This field is required.'
                                                            },
                                                        }}/>
                                                    </Col>
                                                    <Col md="1">
                                                        <AvField step="0.1" value={this.state.formData.r15} name="r15"
                                                                 label=" R15" type="number"
                                                                 disabled={this.state.viewMode}
                                                                 placeholder="" validate={{
                                                            required: {
                                                                value: true,
                                                                errorMessage: 'This field is required.'
                                                            },
                                                        }}/>
                                                    </Col>
                                                    <Col md="1">
                                                        <AvField step="0.1" value={this.state.formData.r16} name="r16"
                                                                 label="R16" type="number"
                                                                 disabled={this.state.viewMode}
                                                                 placeholder="" validate={{
                                                            required: {
                                                                value: true,
                                                                errorMessage: 'This field is required.'
                                                            },
                                                        }}/>
                                                    </Col>
                                                    <Col md="1">
                                                        <AvField step="0.1" value={this.state.formData.r17} name="r17"
                                                                 label="R17" type="number"
                                                                 disabled={this.state.viewMode}
                                                                 placeholder="" validate={{
                                                            required: {
                                                                value: true,
                                                                errorMessage: 'This field is required.'
                                                            },
                                                        }}/>
                                                    </Col>
                                                    <Col md="1">
                                                        <AvField step="0.1" value={this.state.formData.r18} name="r18"
                                                                 label="R18" type="number"
                                                                 disabled={this.state.viewMode}
                                                                 placeholder="" validate={{
                                                            required: {
                                                                value: true,
                                                                errorMessage: 'This field is required.'
                                                            },
                                                        }}/>
                                                    </Col>

                                                    <Col md="1">
                                                        <AvField step="0.1" value={this.state.formData.r19} name="r19"
                                                                 label="R19" type="number"
                                                                 disabled={this.state.viewMode}
                                                                 placeholder="" validate={{
                                                            required: {
                                                                value: true,
                                                                errorMessage: 'This field is required.'
                                                            },
                                                        }}/>
                                                    </Col>
                                                    <Col md="1">
                                                        <AvField step="0.1" value={this.state.formData.r20} name="r20"
                                                                 label="R20" type="number"
                                                                 disabled={this.state.viewMode}
                                                                 placeholder="" validate={{
                                                            required: {
                                                                value: true,
                                                                errorMessage: 'This field is required.'
                                                            },
                                                        }}/>
                                                    </Col>
                                                    <Col md="1">
                                                        <AvField step="0.1" value={this.state.formData.r21} name="r21"
                                                                 label=" R21" type="number"
                                                                 disabled={this.state.viewMode}
                                                                 placeholder="" validate={{
                                                            required: {
                                                                value: true,
                                                                errorMessage: 'This field is required.'
                                                            },
                                                        }}/>
                                                    </Col>
                                                    <Col md="1">
                                                        <AvField step="0.1" value={this.state.formData.r22} name="r22"
                                                                 label="R22" type="number"
                                                                 disabled={this.state.viewMode}
                                                                 placeholder="" validate={{
                                                            required: {
                                                                value: true,
                                                                errorMessage: 'This field is required.'
                                                            },
                                                        }}/>
                                                    </Col>
                                                    <Col md="1">
                                                        <AvField step="0.1" value={this.state.formData.r23} name="r23"
                                                                 label="R23" type="number"
                                                                 disabled={this.state.viewMode}
                                                                 placeholder="" validate={{
                                                            required: {
                                                                value: true,
                                                                errorMessage: 'This field is required.'
                                                            },
                                                        }}/>
                                                    </Col>
                                                    <Col md="1">
                                                        &nbsp;
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                        <div className="divider"></div>
                                        <Row>
                                            <Col md="12">
                                                <p className={"menu-header-title text-capitalize mb-2 mt-2"}></p>
                                                <Row>
                                                    <Col md="2">
                                                        <AvField step="0.1" value={this.state.formData.debit}
                                                                 name="debit"
                                                                 label="Debit" type="number"
                                                                 disabled={this.state.viewMode}
                                                                 placeholder="" validate={{
                                                            required: {
                                                                value: true,
                                                                errorMessage: 'This field is required.'
                                                            },
                                                        }}/>
                                                    </Col>
                                                    <Col md="2">
                                                        <AvField step="0.1" value={this.state.formData.sameDayDebit}
                                                                 name="sameDayDebit"
                                                                 label="Same Day Debit" type="number"
                                                                 disabled={this.state.viewMode}
                                                                 placeholder="" validate={{
                                                            required: {
                                                                value: true,
                                                                errorMessage: 'This field is required.'
                                                            },
                                                        }}/>
                                                    </Col>
                                                    <Col md="2">
                                                        <AvField step="0.1" value={this.state.formData.credit}
                                                                 name="credit"
                                                                 label="Credit" type="number"
                                                                 disabled={this.state.viewMode}
                                                                 placeholder="" validate={{
                                                            required: {
                                                                value: true,
                                                                errorMessage: 'This field is required.'
                                                            },
                                                        }}/>
                                                    </Col>
                                                    <Col md="2">
                                                        <AvField step="0.1" value={this.state.formData.sameDayCredit}
                                                                 name="sameDayCredit"
                                                                 label="Same Day Credit" type="number"
                                                                 disabled={this.state.viewMode}
                                                                 placeholder="" validate={{
                                                            required: {
                                                                value: true,
                                                                errorMessage: 'This field is required.'
                                                            },
                                                        }}/>
                                                    </Col>
                                                    <Col md="2">
                                                        <AvField step="0.1" value={this.state.formData.preNote}
                                                                 name="preNote"
                                                                 label="Pre-Note" type="number"
                                                                 disabled={this.state.viewMode}
                                                                 placeholder="" validate={{
                                                            required: {
                                                                value: true,
                                                                errorMessage: 'This field is required.'
                                                            },
                                                        }}/>
                                                    </Col>
                                                    <Col md="2">
                                                        <AvField step="0.1" value={this.state.formData.refund}
                                                                 name="refund"
                                                                 label="Refund" type="number"
                                                                 disabled={this.state.viewMode}
                                                                 placeholder="" validate={{
                                                            required: {
                                                                value: true,
                                                                errorMessage: 'This field is required.'
                                                            },
                                                        }}/>
                                                    </Col>
                                                    <Col md="2">
                                                        <AvField step="0.1" value={this.state.formData.applicationFee}
                                                                 name="applicationFee"
                                                                 label="Application Fee" type="number"
                                                                 disabled={this.state.viewMode}
                                                                 placeholder="" validate={{
                                                            required: {
                                                                value: true,
                                                                errorMessage: 'This field is required.'
                                                            },
                                                        }}/>
                                                    </Col>
                                                    <Col md="2">
                                                        <AvField step="1" value={this.state.formData.settlementTime}
                                                                 name="settlementTime"
                                                                 label="Settlement Time (In Days)" type="number"
                                                                 disabled={this.state.viewMode}
                                                                 placeholder="" validate={{
                                                            required: {
                                                                value: true,
                                                                errorMessage: 'This field is required.'
                                                            },
                                                        }}/>
                                                    </Col>
                                                    <Col md="2">
                                                        <AvField step="0.1" value={this.state.formData.reserveAmount}
                                                                 name="reserveAmount"
                                                                 label="Reserve Amount ( % )" type="number"
                                                                 disabled={this.state.viewMode}
                                                                 placeholder="" validate={{
                                                            required: {
                                                                value: true,
                                                                errorMessage: 'This field is required.'
                                                            },
                                                        }}/>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="12">
                                                <div style={{
                                                    height: '100px'
                                                }}></div>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="10">
                                                {!this.state.viewMode &&
                                                <b className={"pull-right"} style={{"color": "red"}}>
                                                    {this.getEditNotice()}
                                                </b>
                                                }
                                            </Col>
                                            <Col md="2">
                                                <FormGroup className={"pull-right"}>
                                                    <Button size="lg" className="mt-6"
                                                            disabled={this.state.viewMode}
                                                            color="info">{
                                                        this.state.currentData && this.state.upcommingData ? 'Update' : 'Save'
                                                    }
                                                    </Button>
                                                </FormGroup>
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
