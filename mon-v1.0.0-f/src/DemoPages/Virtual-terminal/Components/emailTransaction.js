import React, {Component, Fragment} from 'react';
import {
    Row, Col,
    Card, CardBody, Button, ModalHeader, ModalBody, ModalFooter,
    Form, FormGroup, Label, InputGroup, InputGroupAddon
} from 'reactstrap';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Rodal from 'rodal';
import Axios from 'axios';
import { setting } from '../../../environment';
export default class EmailTransaction extends Component {
    constructor(){
        super();
        this.state = {
            visible : false,
            modalpopInformation:[],
        }
    }
    hide() {
        this.setState({ visible: false });
    }
    redirectToTransaction(){
        let url = window.location.href.split('#/analytics/transaction');
        window.location.href = url[0] + "/#/analytics/transaction";
    }
    fetchTransactionId(transactionId){
        Axios.get(setting.site_Setting.API_URL+'virtualTerminal/'+transactionId, {headers: setting.jwtTokenHeader}).then(result=>{
            this.state.modalpopInformation.push(result.data);
            this.state.visible = true
        }). catch(error=>{
        })
    }
    render() {  
        let {
            transactionId
        } = this.props;
        if(transactionId != ''){
            
            this.fetchTransactionId(transactionId);
        }
        const { modalpopInformation } = this.state;
        return (
            <Fragment>
                <Rodal visible={this.state.visible} onClose={this.redirectToTransaction.bind(this)}
                    animation={'rotate'}
                    showMask={false}
                    width={700}
                >
                    <ModalHeader>Transaction Info</ModalHeader>
                    {}
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
                                        <h5 className="modalHeaderInformation">Billing Information 
                                        <span className={'pull-right pl-2 '+data.data.transactionId.otherInformation.returnresponse.status}><span className="text-black">Transaction Status :</span> {data.data.transactionId.otherInformation.returnresponse.status}</span>
                                        </h5>
                                        <div key={key} className="col-count-2">
                                            {/* <p>Transaction Date : {this.state.columnData["0"].submitingData}</p> */}
                                            <p>Settlement Speed : {
                                                (data.data.transactionId.billingInformation.transactType == 'S' ? "Same-day" : "")
                                            }
                                                {
                                                    (data.data.transactionId.billingInformation.transactType == 'N' ? "Pre-note" : "")
                                                }
                                                {
                                                    (data.data.transactionId.billingInformation.transactType == 'Y' ? "NSF Retry" : "")
                                                }</p>
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
                        <Button color="primary" onClick={this.redirectToTransaction.bind(this)}>Cancel</Button>
                    </ModalFooter>
                </Rodal>
            </Fragment>
        )
    }
}