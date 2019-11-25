import React, {Component, Fragment} from 'react';

import { setting } from '../../../../../environment';
import axios from 'axios';
import {
    Row, Col,
    CardTitle,
    Progress,

} from 'reactstrap';

import {
    ResponsiveContainer,
    LineChart,
    Tooltip,
    Line, XAxis, YAxis, CartesianGrid
} from 'recharts';

export default class IncomeReport extends Component {
    constructor() {
        super();
    }
    GetSortOrder(prop) {  
        return function(a, b) {  
            if (a[prop] > b[prop]) {  
                return 1;  
            } else if (a[prop] < b[prop]) {  
                return -1;  
            }  
            return 0;  
        }  
    }
    componentDidMount(){
    }
    render() {
        let salesAverage = 0;
        let {
            vtreport,
            rfreport,
            totalSubmissionOfVirtualTerminalAMT,
            totalSubmissionOfRefundAMT
        } = this.props;
        let terminalAmount = totalSubmissionOfVirtualTerminalAMT;
        let refundAmount = totalSubmissionOfRefundAMT;

        salesAverage = (terminalAmount  - refundAmount) / (terminalAmount) * 100;
        if(isNaN(salesAverage)){
            salesAverage = 0;
        }
        let virtualnonTerminalData = new Array;
        console.log(rfreport)
        virtualnonTerminalData =  [].slice.call(vtreport).sort(this.GetSortOrder('_id'))
        virtualnonTerminalData.forEach((data, index)=>{
            virtualnonTerminalData[index].TotalTransactionAmount = '$'+ data.TotalTranasactionAmount;
            virtualnonTerminalData[index].TotalTransactionAmounts = data.totalAmount;
            virtualnonTerminalData[index].TotalTransactionCount = data.TotalTranasactionCount;
            virtualnonTerminalData[index]._id = data._id;
         })
         const CustomTooltip = ({ active, payload, label }) => {
            if (active) {
                if(payload != null){
                    let amountSplit = payload[1].value.split(".");
                    let dollarAmount = amountSplit[0];
                    let centAmount = amountSplit[1];
                    return (
                        <div className="customToogleTip">
                        <div>{`${label}`}</div>
                        <div>{` Total Transaction Amounts : ${dollarAmount}`}{(!centAmount)? `.00`:'.'+centAmount} </div>
                        <div>{` Total Transaction Count : ${payload[2].value}`}</div>
                        </div>
                    );
                }
                
             }
            return null;
        };
        return (
            <Fragment>
                <div className="widget-chart-wrapper widget-chart-wrapper-lg opacity-10 m-0">
                    <ResponsiveContainer width={'100%'} height={240}>
                        <LineChart data={virtualnonTerminalData}
                                   margin={{top: 0, right: 50, left: 0, bottom: 0}}>
                            <XAxis dataKey="_id"/>
                            <YAxis/>
                            <CartesianGrid stroke="#eee" strokeDasharray="2 2"/>
                            <Line type="monotone" dataKey="TotalTransactionAmounts" strokeOpacity={.4}
                                  strokeWidth={2}/>
                            <Tooltip content={<CustomTooltip />} />
                            <Line type="monotone" dataKey="TotalTransactionAmount" stroke="var(--pink)" strokeOpacity={.4}
                                  strokeWidth={2}/>
                            <Line type="monotone" dataKey="TotalTransactionCount" stroke="var(--green)"
                                  strokeWidth={2}/>
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <Row className="mt-3 sr-only">
                    <Col sm="12" md="12">
                        <div className="widget-content p-0">
                            <div className="widget-content-outer">
                                <div className="widget-content-wrapper">
                                    <div className="widget-content-left">
                                        <div className="widget-numbers text-dark">
                                            {salesAverage == NaN ? 0 : salesAverage.toFixed(2)}%
                                        </div>
                                    </div>
                                </div>
                                <div className="widget-progress-wrapper mt-1">
                                    <Progress
                                        className="progress-bar-xs progress-bar-animated-alt"
                                        color="info"
                                        value={salesAverage == NaN ? 0 : salesAverage.toFixed(2)}/>
                                    <div className="progress-sub-label">
                                        <div className="sub-label-left font-size-md">
                                            Sales
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Fragment>
        )
    }
}
