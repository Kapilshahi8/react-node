import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Select from 'react-select';
import {
    Row, Col,
    Card, CardBody,
    Form, FormGroup, Label, InputGroup, InputGroupAddon
} from 'reactstrap';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactTable from "react-table";
import DatePicker from 'react-datepicker';
import PageTitle from '../../Layout/AppMain/PageTitle';
import Axios from 'axios';
import { setting } from '../../environment';
import Loader from 'react-loaders';
import BlockUi from 'react-block-ui';
import AppHeader from '../../Layout/AppHeader/';
import AppSidebar from '../../Layout/AppSidebar/';
import AppFooter from '../../Layout/AppFooter/';
import dateFormat from 'dateformat';
import ThemeOptions from '../../Layout/ThemeOptions/';
const transactionStatus = [
    { value: undefined, label: 'Attempted' },
    {value: 'settled', label: 'Settled'},
    { value: 'Accepted', label: 'Successful' },
    { value: 'refunded', label: 'Refund' }
];
const submissionType = [
    { value: 'vt', label: 'Virtual Terminal' },
    { value: 'api', label: 'API' },
    { value: 'batch', label: 'Batch' }
];
export default class VirtualTerminalreport extends React.Component {
    constructor() {
        super();
        this.state = {
            data: [],
            loading: false,
            visible: false,
            animation: 'zoom',
            modalpopInformation: [],
            columnData: [],
            startDate: '',
            endDate: '',
            selectedTransactionStatusOption: null,
            selectedSubmissionTypeOption: null,
            untilStartDateSelect: true,
            params: {},
        };
        this.handleChangeStart = this.handleChangeStart.bind(this);
        this.handleChangeEnd = this.handleChangeEnd.bind(this);
    }
    handleChangeTransactionStatus = (selectedTransactionStatusOption) => {
        this.setState({ selectedTransactionStatusOption });
        this.state.params.transactionStatus = selectedTransactionStatusOption.value;
        this.filterOption()
    }
    handleChangeSubmissionType = (selectedSubmissionTypeOption) => {
        this.setState({ selectedSubmissionTypeOption });
        this.state.params.submissionType = selectedSubmissionTypeOption.value;
        this.filterOption()
    }
    handleChangeStart(date) {
        this.setState({
            startDate: date,
            untilStartDateSelect: false,
            endDate: null
        })
        this.state.params.startDate = dateFormat(date, 'yyyy-mm-dd');
        delete this.state.params.endDate;
        this.filterOption()
    }
    handleChangeEnd(date) {
        this.setState({
            endDate: date
        })
        this.state.params.endDate = dateFormat(date, 'yyyy-mm-dd');
        this.filterOption();
    }
    componentDidMount() {
        this.fetchVTList()
    }
    fetchVTList() {
        Axios.get(setting.site_Setting.API_URL + 'transacLedger/calculateAvailableBlnc', { headers: setting.jwtTokenHeader }).then(result => {
            if (result.data.totalData.length != 0) {
                var newdata = 0;
                result.data.totalData.forEach((data, index) => {
                    if (data.otherInformation.returnresponse.status == 'Accepted') {
                        newdata += parseFloat(data.otherInformation.returnresponse.initial_amount)
                    } else if (data.otherInformation.returnresponse.status == 'refunded') {
                        newdata -= parseFloat(data.otherInformation.returnresponse.initial_amount)
                    }
                    result.data.totalData[index].otherInformation.availableBalance = '$' + newdata.toFixed(2)
                })
            }
            this.setState({ data: result.data.totalData });
        }).catch(error => {
            console.log(error);
        })
    }

filterOption() {
    Axios.post(setting.site_Setting.API_URL + 'transacLedger/calculateAvailableBlncByDate', this.state.params, { headers: setting.jwtTokenHeader }).then(result => {
        if (result.data.totalData.length != 0) {
            var newdata = 0;
            result.data.totalData.forEach((data, index) => {
                if (data.otherInformation.returnresponse.status == 'Accepted') {
                    newdata += parseFloat(data.otherInformation.returnresponse.initial_amount)
                } else if (data.otherInformation.returnresponse.status == 'refunded') {
                    newdata -= parseFloat(data.otherInformation.returnresponse.initial_amount)
                }
                result.data.totalData[index].otherInformation.availableBalance = '$' + newdata.toFixed(2)
            })
        }
        this.setState({ data: result.data.totalData });
    })
}

    show(animation) {
        this.setState({
            animation,
            visible: true
        });
    }
    hide() {
        this.setState({ visible: false });
    }

    render() {
        const { selectedOption } = this.state;
        return (
            <Fragment>
                <ThemeOptions />
                <AppHeader />
                <div className="app-main">
                    <AppSidebar />
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
                                    <div>
                                        <PageTitle
                                            heading="Transaction Ledger"
                                            icon="pe-7s-notebook icon-gradient bg-tempting-azure"
                                            childPageName="Transaction Ledger"
                                            parentPageName="Analytics"
                                        />
                                    </div>
                                    <Row>
                                        <Col md="12">
                                            <Card className="main-card mb-3">
                                                <CardBody>
                                                    <Row>
                                                        <Col md={12}>
                                                            <Form>
                                                                <Row form>
                                                                    <Col md={3}>
                                                                        <FormGroup>
                                                                            <Label for="exampleEmail" className="mr-sm-2">Start Date</Label>
                                                                            <InputGroup>
                                                                                <InputGroupAddon addonType="prepend">
                                                                                    <div className="input-group-text">
                                                                                        <FontAwesomeIcon icon={faCalendarAlt} />
                                                                                    </div>
                                                                                </InputGroupAddon>
                                                                                <DatePicker
                                                                                    selected={this.state.startDate}
                                                                                    selectsStart
                                                                                    className="form-control"
                                                                                    startDate={this.state.startDate}
                                                                                    endDate={this.state.endDate}
                                                                                    onChange={this.handleChangeStart}
                                                                                />
                                                                            </InputGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                    <Col md={3}>
                                                                        <FormGroup>
                                                                            <Label for="examplePassword" className="mr-sm-2">End Date</Label>
                                                                            <DatePicker
                                                                                selected={this.state.endDate}
                                                                                selectsEnd
                                                                                className="form-control"
                                                                                startDate={this.state.startDate}
                                                                                endDate={this.state.endDate}
                                                                                onChange={this.handleChangeEnd}
                                                                                minDate={this.state.startDate}
                                                                                disabled={this.state.untilStartDateSelect}
                                                                            />
                                                                        </FormGroup>
                                                                    </Col>
                                                                    <Col md={3}>
                                                                        <FormGroup>
                                                                            <Label for="examplePassword" className="mr-sm-2">Transaction Status</Label>
                                                                            <Select
                                                                                value={selectedOption}
                                                                                onChange={this.handleChangeTransactionStatus}
                                                                                options={transactionStatus}
                                                                            />
                                                                        </FormGroup>
                                                                    </Col>
                                                                    <Col md={3}>
                                                                        <FormGroup>
                                                                            <Label for="examplePassword" className="mr-sm-2">Submission Type</Label>
                                                                            <Select
                                                                                value={selectedOption}
                                                                                onChange={this.handleChangeSubmissionType}
                                                                                options={submissionType}
                                                                            />
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>
                                                            </Form>
                                                        </Col>
                                                    </Row>
                                                    <ReactTable
                                                        data={this.state.data}
                                                        defaultFilterMethod={this.filterCaseInsensitive}
                                                        sorted={[{ // the sorting model for the table
                                                            id: 'date',
                                                            desc: true
                                                        }]}
                                                        columns={[
                                                            {
                                                                columns: [
                                                                    {
                                                                        Header: "Date",
                                                                        width: 220,
                                                                        Cell: cell => {
                                                                            if (cell.original.otherInformation.returnresponse.status == "refunded") {
                                                                                return (
                                                                                    <span className="text-danger">
                                                                                        {cell.original.otherInformation.readingDate}
                                                                                    </span>
                                                                                )
                                                                            } else {
                                                                                return cell.original.otherInformation.readingDate
                                                                            }

                                                                        }
                                                                    },
                                                                    {
                                                                        Header: "Description",
                                                                        width: 450,
                                                                        accessor: "otherInformation.showDescription",
                                                                        Cell: cell => {
                                                                            if (cell.original.otherInformation.returnresponse.status == "refunded") {
                                                                                return (
                                                                                    <span className="text-danger">{cell.original.otherInformation.showDescription} <br />Transaction id : {cell.original._id}<br /> Comment: {cell.original.otherInformation.returnresponse.comments}
                                                                                    </span>
                                                                                )
                                                                            } else {
                                                                                return (
                                                                                    <span>
                                                                                        {cell.original.otherInformation.showDescription} <br />Transaction id : {cell.original._id} <br /> Comment: {cell.original.otherInformation.returnresponse.comments}
                                                                                    </span>
                                                                                )
                                                                            }

                                                                        }
                                                                    },
                                                                    {
                                                                        Header: "Type",
                                                                        width: 150,
                                                                        Cell: cell => {
                                                                            if (cell.original.otherInformation.returnresponse.status == "refunded") {
                                                                                return (
                                                                                    <span className="text-danger">
                                                                                        {cell.original.capture_type}
                                                                                    </span>
                                                                                )
                                                                            } else {
                                                                                return (
                                                                                    <span >
                                                                                        {cell.original.capture_type}
                                                                                    </span>
                                                                                )
                                                                            }

                                                                        }
                                                                    },
                                                                    {
                                                                        Header: "Status",
                                                                        width: 100,
                                                                        accessor: "otherInformation.returnresponse.status",
                                                                        Cell: cell => {
                                                                            if (cell.original.otherInformation.returnresponse.status == "refunded") {
                                                                                return (
                                                                                    <span className="text-danger text-capital">
                                                                                        {cell.original.otherInformation.returnresponse.status}
                                                                                    </span>
                                                                                )
                                                                            } else {
                                                                                return (
                                                                                    <span className="text-capital">
                                                                                        {cell.original.otherInformation.returnresponse.status}
                                                                                    </span>
                                                                                )
                                                                            }

                                                                        }

                                                                    },
                                                                    {
                                                                        Header: "Amount",
                                                                        width: 100,
                                                                        accessor: "otherInformation.returnresponse.written_amount",
                                                                        Cell: cell => {
                                                                            if (cell.original.otherInformation.returnresponse.status == "refunded") {
                                                                                return (
                                                                                    <span className="text-danger">
                                                                                        {cell.original.otherInformation.returnresponse.written_amount}
                                                                                    </span>
                                                                                )
                                                                            } else {
                                                                                return cell.original.otherInformation.returnresponse.written_amount
                                                                            }

                                                                        }
                                                                    },
                                                                    {
                                                                        Header: "Available Balance",
                                                                        width: 100,
                                                                        accessor: 'otherInformation.availableBalance',
                                                                        Cell: cell => {
                                                                            if (cell.original.otherInformation.returnresponse.status == "refunded") {
                                                                                return (
                                                                                    <span className="text-danger">
                                                                                        {cell.original.otherInformation.availableBalance}
                                                                                    </span>
                                                                                )
                                                                            } else {
                                                                                return cell.original.otherInformation.availableBalance
                                                                            }

                                                                        }
                                                                    }
                                                                ]
                                                            },
                                                        ]}
                                                        defaultPageSize={10}
                                                        SubComponent={(row) => {
                                                            return (
                                                                <div className="pt-3 pl-3 pb-3 pr-3 border-top">
                                                                    <ul>
                                                                        <li>Merchant Name : {row.original.customerInformation.customerName}</li>
                                                                        <li>Transaction Type : {row.original.billingInformation.transactType == "S" ? "Saving" : "Checking"}</li>
                                                                        <li>Description : {row.original.otherInformation.showDescription}</li>
                                                                        <li>Device Wallet Name : {(row.original.otherInformation.userDevice)? row.original.otherInformation.userDevice : ""} </li>
                                                                        <li>Device IP : {(row.original.otherInformation.userIp)? row.original.otherInformation.userIp: ""}</li>
                                                                        <li>Device Phone :</li>
                                                                        {/*<li>Company Name : {row.original.customerInformation.companyName}</li>
                                                                        <li>Customer Email : {row.original.customerInformation.customerEmail}</li>
                                                                        <li>Customer Phone : {row.original.customerInformation.customerPhone}</li>*/}
                                                                    </ul>
                                                                </div>
                                                            )
                                                        }
                                                        }
                                                        className="-striped-highlight"
                                                    />
                                                </CardBody>
                                            </Card>
                                        </Col>
                                    </Row>
                                </ReactCSSTransitionGroup>
                            </BlockUi>
                        </div>
                        <AppFooter />
                    </div>
                </div>
            </Fragment>
        )
    }
}
