import React, { Fragment } from 'react'
import Select from 'react-select';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {
    Row, Col,
    Card, CardBody, Button, ModalHeader, ModalBody, ModalFooter,
    Form, FormGroup, Label, InputGroup, InputGroupAddon
} from 'reactstrap';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactTable from "react-table";
import PageTitle from '../../../Layout/AppMain/PageTitle';
import Axios from 'axios';
import { setting } from '../../../environment';
import { toast } from 'react-toastify';
import Loader from 'react-loaders';
import BlockUi from 'react-block-ui';
import Rodal from 'rodal';
import PerfectScrollbar from 'react-perfect-scrollbar';
import DatePicker from 'react-datepicker';
import EmailTransaction from './emailTransaction';

var dateFormat = require('dateformat');
const transactionStatus = [
    {value: undefined, label: 'Attempted'},
    {value: 'Accepted', label: 'Successful'},
    {value: 'settled', label: 'Settled'},
    {value: 'declined', label: 'Declined'},
    {value: 'refunded', label: 'Refund'}
];
const submissionType = [
    {value: 'vt', label: 'Virtual Terminal'},
    {value: 'api', label: 'API'},
    {value: 'batch', label: 'Batch'}
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
            selectedTransactionStatusOption:null,
            selectedSubmissionTypeOption:null,
            untilStartDateSelect:true,
            params:{},
            emailTransactionId:''
        };
        this.handleChangeStart = this.handleChangeStart.bind(this);
        this.handleChangeEnd = this.handleChangeEnd.bind(this);
    }

    handleChangeTransactionStatus=(selectedTransactionStatusOption)=>{
        this.setState({selectedTransactionStatusOption});
        this.state.params.transactionStatus = selectedTransactionStatusOption.value;
        this.fetchFilterData();
    }
    handleChangeSubmissionType=(selectedSubmissionTypeOption)=>{
        this.setState({selectedSubmissionTypeOption});
        this.state.params.submissionType = selectedSubmissionTypeOption.value;
        this.fetchFilterData();
    }
    handleChangeStart(date) {
        this.setState({
            startDate: date,
            untilStartDateSelect:false,
            endDate:null
        })
        this.state.params.startDate = dateFormat(date, 'yyyy-mm-dd');
        delete this.state.params.endDate;
        this.fetchFilterData();
    }
    handleChangeEnd(date) {
        this.setState({
            endDate: date
        })
        this.state.params.endDate = dateFormat(date, 'yyyy-mm-dd');
        this.fetchFilterData();
    }
    fetchFilterData(){
        Axios.post(setting.site_Setting.API_URL+'virtualTerminal/getVTByDate',this.state.params, {headers: setting.jwtTokenHeader}).then(data=>{
            this.setState({data: data.data.data.virtualTerminalList});
        }).catch(data=>{
            this.setState({data: []});
        })
    }
    componentDidMount() {
        this.fetchVTList();
        let emailCheck = this.props.location.pathname.substring(this.props.location.pathname.lastIndexOf('/') + 1);
        if(emailCheck.split('|')[0] == "email"){
            this.setState({'emailTransactionId':emailCheck.split('|')[1]});
        }
    }
    fetchVTList() {
        Axios.get(setting.site_Setting.API_URL + 'virtualTerminal/virtualList', { headers: setting.jwtTokenHeader }).then(result => {
            this.setState({ data: result.data.data.virtualTerminalList });
        }).catch(error => {
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
    filterCaseInsensitive = ({ id, value }, row) => row[id] ? row[id].toLowerCase().includes(value.toLowerCase()) : true

    render() {
        const { data } = this.state;
        const {selectedOption} = this.state;
        const { modalpopInformation } = this.state;
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
                                heading="Transaction Report"
                                icon="pe-7s-notebook icon-gradient bg-tempting-azure"
                                childPageName="Terminal Report"
                                parentPageName="Virtual Terminal"
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
                                            data={data}
                                            getTdProps={(state, rowInfo, column, instance) => {
                                                return {
                                                    onClick: (e, handleOriginal) => {
                                                        this.state.modalpopInformation = [];
                                                        this.state.columnData = [];
                                                        if (rowInfo !== undefined) {
                                                            if (column.Header == "Action") {
                                                                if (rowInfo.original.paymentInformation.returnStatus != 0) {
                                                                    if (rowInfo.original.otherInformation.returnresponse.status == "Accepted") {
                                                                        this.setState({ 'loading': true });
                                                                        const rowValue = {
                                                                            action_code: 'R',
                                                                            prev_history_id: rowInfo.original.otherInformation.returnresponse.history_id,
                                                                            order_id: rowInfo.original.otherInformation.returnresponse.order_id,
                                                                            initial_amount: rowInfo.original.otherInformation.returnresponse.initial_amount
                                                                        }
                                                                        Axios.post(setting.site_Setting.API_URL + 'refund/refundInitialAmount', rowValue, { headers: setting.jwtTokenHeader }).then(data => {
                                                                            this.setState({ 'loading': false });
                                                                            toast['success'](data.data.message);
                                                                            this.fetchVTList();
                                                                        }).catch(error => {
                                                                            this.setState({ 'loading': false });
                                                                            toast['error'](error.response.data.message);
                                                                        })
                                                                    }
                                                                }

                                                            } else {
                                                                if (rowInfo !== undefined) {
                                                                    Axios.get(setting.site_Setting.API_URL + 'virtualTerminal/' + rowInfo.original.id, { headers: setting.jwtTokenHeader }).then(data => {

                                                                        this.state.modalpopInformation.push(data.data);
                                                                        this.state.columnData.push(rowInfo.row);
                                                                        this.show('flip');
                                                                    }).catch(error => {
                                                                    })
                                                                }
                                                            }
                                                        }
                                                        if (handleOriginal) {
                                                            handleOriginal()
                                                        }
                                                    }
                                                }
                                            }}
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
                                                            width: 200,
                                                            filterable: true,
                                                            accessor: "submitingData",
                                                        },
                                                        {
                                                            Header: "Transaction Id",
                                                            filterable: true,
                                                            width: 200,
                                                            accessor: "otherInformation.returnresponse.order_id",
                                                            Cell: cell => {
                                                                if (cell.original.id == undefined) {
                                                                    return (
                                                                        <span>N/A</span>
                                                                    )
                                                                } else {
                                                                    return (
                                                                        <span >{cell.original.id}</span>
                                                                    );
                                                                }

                                                            }
                                                        },
                                                        {
                                                            Header: "Customer Name",
                                                            width: 250,
                                                            accessor: "customerInformation.customerName",
                                                            filterable: true
                                                        },
                                                        {
                                                            Header: "Amount",
                                                            filterable: true,
                                                            accessor: "otherInformation.returnresponse.initial_amount"
                                                        },
                                                        {
                                                            Header: "Action",
                                                            filterable: true,
                                                            width: 200,
                                                            accessor: 'otherInformation.returnresponse.status',
                                                            Cell: cell => {
                                                                if (cell.original.otherInformation.returnresponse.status != "declined") {
                                                                    if (cell.original.paymentInformation.returnStatus) {
                                                                        return (
                                                                            <button className="btn bt-xs btn-warning">Refund</button>
                                                                        );
                                                                    } else {
                                                                        return (
                                                                            'Refunded on ' + dateFormat(cell.original.paymentInformation.returnDate, "mmmm dS, yyyy, h:MM TT")
                                                                        );
                                                                    }
                                                                } else {
                                                                    return (
                                                                        <label className="btn bt-xs btn-danger">Declined</label>
                                                                    );
                                                                }
                                                            }
                                                        }
                                                    ]
                                                },
                                            ]}
                                            defaultPageSize={10}
                                            className="-striped -highlight"
                                        />
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>

                        <Rodal
                            visible={this.state.visible}
                            onClose={this.hide.bind(this)}
                            animation={this.state.animation}
                            showMask={false}
                            width={700}
                        >
                            <ModalHeader>Transaction Info</ModalHeader>
                            <ModalBody>
                                <div className="scroll-area-md">
                                    <PerfectScrollbar>
                                        {modalpopInformation.map((data, key) =>
                                            <div key={key}>
                                                <h5 className="modalHeaderInformation">Customer Information</h5>
                                                <div className="col-count-2">
                                                    <p>Company Name : {data.data.transactionId.customerInformation.companyName}</p>
                                                    <p>Customer Email : {data.data.transactionId.customerInformation.customerEmail}</p>
                                                    <p>Customer Name : {data.data.transactionId.customerInformation.customerName}</p>
                                                    <p>Customer Phone : {data.data.transactionId.customerInformation.customerPhone}</p>
                                                    <p>Customer City : {data.data.transactionId.customerInformation.city}</p>
                                                    <p>Customer Province : {data.data.transactionId.customerInformation.stateProvince.toUpperCase()}</p>
                                                    <p>Customer Zip Code : {data.data.transactionId.customerInformation.zipCode}</p>
                                                </div>
                                                <div className={'mt-3'}>
                                                    <p>Customer Address : {data.data.transactionId.customerInformation.address1} {data.data.transactionId.customerInformation.address2}</p>
                                                </div>
                                                <h5 className="modalHeaderInformation">Billing Information</h5>
                                                <div key={key} className="col-count-2">
                                                    <p>Transaction Date : {this.state.columnData["0"].submitingData}</p>
                                                    <p>Settlement Speed : {
                                                        (data.data.transactionId.billingInformation.transactType == 'S' ? "Same-day" : "")
                                                    }
                                                        {
                                                            (data.data.transactionId.billingInformation.transactType == 'N' ? "Pre-note" : "")
                                                        }
                                                        {
                                                            (data.data.transactionId.billingInformation.transactType == 'Y' ? "NSF Retry" : "")
                                                        }</p>
                                                    <p className={data.data.transactionId.otherInformation.returnresponse.status}>Transaction Status : {data.data.transactionId.otherInformation.returnresponse.status}</p>
                                                    <p className={data.data.transactionId.paymentInformation.returnStatus == 0 ? "Refunded" : "Not-Refund"}>Refund Status : {data.data.transactionId.paymentInformation.returnStatus == 0 ? "Refunded" : "Not-Refund"}</p>
                                                </div>
                                                <h5 className="modalHeaderInformation">Transaction Information</h5>
                                                <div className="col-count-2">
                                                    <p>Transaction ID : {data.data.transactionId._id}</p>
                                                    {/* <p>Refund Status : N/A</p> */}
                                                    <p>Account Number : {data.data.transactionId.paymentInformation.accountNumber}</p>
                                                    <p>Routing Number : {data.data.transactionId.paymentInformation.routingNumber}</p>
                                                    <p>Transaction Type : {data.data.transactionId.otherInformation.returnresponse.acct_type}</p>
                                                    <p>Initial Amount : ${data.data.transactionId.otherInformation.returnresponse.initial_amount}</p>
                                                </div>
                                            </div>
                                        )}
                                    </PerfectScrollbar>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="primary" onClick={this.hide.bind(this)}>Cancel</Button>
                            </ModalFooter>
                        </Rodal>
                        <EmailTransaction
                            transactionId={this.state.emailTransactionId}
                        />
                    </ReactCSSTransitionGroup>
                </BlockUi>
            </Fragment>
        )
    }
}
