import React, {Fragment, Component} from 'react';
import {
    Row, Col,
    Card, CardBody, CardTitle,
    Container,
} from 'reactstrap';

import IncomeReport from './Components/IncomeReport';
import Axios from 'axios';
import { setting } from '../../../../environment';
const dateFormat = require('dateformat');
export default class CommerceDashboard1 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: '1',
            popoverOpen1: false,
            popoverOpen2: false,
            popoverOpen3: false,
            popoverOpen4: false,
            value: 45,
            value2: 72,
            currentmonth: dateFormat(new Date(), 'yyyy-mm'),
            vtChartInfo:{},
            rfChartInfo:{},
            vtcount:0,
            vttotalAmount:0,
            rfcount:0,
            rftotalAmount:0
        }
    }

    componentDidMount(){
        this.vtLineData();
        this.rFLineData();
        this.submissionVTData();
        this.submissionRFData();
    }

    submissionVTData(){
        Axios.get(setting.site_Setting.API_URL+'chart/getVTSubmittedTimes', {headers: setting.jwtTokenHeader}).then(vtLineInfo=>{
            if(vtLineInfo.data.data.length != 0){
                this.setState({vtcount : vtLineInfo.data.data[0].count});
                this.setState({vttotalAmount : vtLineInfo.data.data[0].totalAmount});
            }
        }).catch(error=>{
            console.log(error);
        })
    }
    submissionRFData(){
        Axios.get(setting.site_Setting.API_URL+'chart/getTotalAmountOfRefundByUserId', {headers: setting.jwtTokenHeader}).then(rFLineData=>{
            if(rFLineData.data.data.length != 0){
                this.setState({rfcount : rFLineData.data.data[0].count});
                this.setState({rftotalAmount : rFLineData.data.data[0].totalAmount});
            }
        })
    }
    vtLineData(){
        Axios.get(setting.site_Setting.API_URL+'chart/vTLineData', {headers: setting.jwtTokenHeader}).then(vtLineInfo=>{
            if(vtLineInfo.data.data.length != 0){
                var passingdata  = vtLineInfo.data.data.reverse();
                this.setState({'vtChartInfo': passingdata});
            }
        })
    }
    rFLineData(){
        Axios.get(setting.site_Setting.API_URL+'chart/rFLineData', {headers: setting.jwtTokenHeader}).then(rFLineData=>{
            if(rFLineData.data.data.length != 0){
                this.setState({'rfChartInfo':rFLineData.data.data});
            }
        })
    }
    render() {


        return (
            <Fragment>
                <Container fluid>
                    <Row>
                        <Col lg="12" xl="12" md="12">
                            <Card className="main-card mb-3">
                                <CardBody>
                                    <CardTitle>
                                        Transaction Report
                                    </CardTitle>
                                    <IncomeReport 
                                    vtreport={this.state.vtChartInfo} 
                                    rfreport={this.state.rfChartInfo}
                                    totalSubmissionOfRefundCounts = {this.state.rfcount}
                                    totalSubmissionOfRefundAMT = {this.state.rftotalAmount}
                                    totalSubmissionOfVirtualTerminalCounts = {this.state.vtcount}
                                    totalSubmissionOfVirtualTerminalAMT = {this.state.vttotalAmount}
                                    />
                                </CardBody>
                            </Card>
                        </Col>
                        <Col lg="12" xl="12" md="12">
                            <Card className="main-card mb-3">
                                <div className="grid-menu grid-menu-2col">
                                    <Row className="no-gutters">
                                        <Col sm="6">
                                            <div className="widget-chart ">
                                                <div className="icon-wrapper rounded-circle">
                                                    <div className="icon-wrapper-bg bg-danger"/>
                                                    <i className="lnr-laptop-phone text-danger"/>
                                                </div>
                                                <div className="widget-numbers">
                                               {this.state.vtcount} times
                                                </div>
                                                <div className="widget-subheading">
                                                    Terminal Submitted
                                                </div>
                                            </div>
                                        </Col>
                                        <Col sm="6">
                                            <div className="widget-chart br-br">
                                                <div className="icon-wrapper rounded-circle">
                                                    <div className="icon-wrapper-bg bg-success"/>
                                                    <i className="lnr-screen"/>
                                                </div>
                                                <div className="widget-numbers">
                                                ${this.state.vttotalAmount}
                                                </div>
                                                <div className="widget-subheading">
                                                    Terminal Amount
                                                </div>
                                            </div>
                                        </Col>
                                        <Col sm="6">
                                            <div className="widget-chart ">
                                                <div className="icon-wrapper rounded-circle">
                                                    <div className="icon-wrapper-bg bg-primary"/>
                                                    <i className="lnr-redo icon-gradient bg-plum-plate"/>
                                                </div>
                                                <div className="widget-numbers">
                                                    {this.state.rfcount} times
                                                </div>
                                                <div className="widget-subheading">
                                                    Refund Submitted
                                                </div>
                                            </div>
                                        </Col>
                                        <Col sm="6">
                                            <div className="widget-chart ">
                                                <div className="icon-wrapper rounded-circle">
                                                    <div className="icon-wrapper-bg bg-info"/>
                                                    <i className="lnr-graduation-hat text-info"/>
                                                </div>
                                                <div className="widget-numbers">
                                                ${this.state.rftotalAmount.toFixed(2)}
                                                </div>
                                                <div className="widget-subheading">
                                                    Refunded Amount
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </Fragment>
        )
    }
}
