import React, {Fragment} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {Card, CardBody, CardTitle, Col, Container, Input, Row} from 'reactstrap';
import AppHeader from '../../Layout/AppHeader/';
import AppSidebar from '../../Layout/AppSidebar/';
import AppFooter from '../../Layout/AppFooter/';
import ThemeOptions from '../../Layout/ThemeOptions/';
import {setting} from "../../environment";
import Axios from 'axios';
import ReactTable from "react-table";

import moment from 'moment'

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

var dateFormat = require('dateformat');

const transactionStatus = [
    {value: undefined, label: 'Attempted'},
    {value: 'Accepted', label: 'Successful'},
    {value: 'declined', label: 'Declined'},
    {value: 'refunded', label: 'Refund'}
];
const submissionType = [
    {value: 'vt', label: 'VT'},
    {value: 'api', label: 'API'},
    {value: 'batch', label: 'Batch'}
];

export default class WebAuthorization extends React.Component {
    constructor(props) {
        super(props);

        this.handleSearch = this.handleSearch.bind(this)
        this.getData = this.getData.bind(this)
        this.clear = this.clear.bind(this)
    }

    state = {
        data: [],
        loading: false,
        visible: false,
        animation: 'zoom',
        modalpopInformation: [],
        columnData: [],
        selectedTransactionStatusOption: null,
        selectedSubmissionTypeOption: null,
        params: {},
        transactionId: '',
        customerName: '',
        isSearch: false
    }

    componentDidMount() {
        this.getData()
    }

    handleSearch() {
        Axios.get(setting.site_Setting.API_URL + 'virtualTerminal/' + this.state.transactionId, {headers: setting.jwtTokenHeader}).then(data => {
            console.log(8888)
            var transaction = data.data.data.transactionId
            transaction['id'] = transaction['_id']
            transaction['submitingData'] = dateFormat(transaction['otherInformation']['submitingData'], "mmmm dS, yyyy, h:MM TT")
            this.setState({
                data: [data.data.data.transactionId],
                isSearch: true
            });
        }).catch(error => {
            console.log(error)
        })
    }

    getData() {
        Axios.get(setting.site_Setting.API_URL + 'virtualTerminal/virtualList?limit=10', {headers: setting.jwtTokenHeader}).then(result => {
            this.setState({data: result.data.data.virtualTerminalList, isSearch: false, transactionId: ''});
        }).catch(error => {
        })
    }

    clear() {
        this.getData()
    }

    filterCaseInsensitive = ({id, value}, row) => row[id] ? row[id].toLowerCase().includes(value.toLowerCase()) : true

    render() {
        const {data} = this.state;
        const {selectedOption} = this.state;
        const {modalpopInformation} = this.state;

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
                                            <CardTitle>Web Authorization</CardTitle>
                                            <Row>
                                                <Col md={12}>

                                                    <Row form>
                                                        <Col md={6}>
                                                            <Input value={this.state.transactionId}
                                                                   name="transactionId" type="text"
                                                                   placeholder="Transaction ID"
                                                                   onChange={(e, v) => {
                                                                       this.setState({transactionId: e.target.value})
                                                                   }}
                                                            />
                                                        </Col>
                                                        <Col md={1}>
                                                            <button
                                                                style={{"display": "block"}}
                                                                disabled={this.state.transactionId.length != 24}
                                                                onClick={this.handleSearch}
                                                                className="btn btn-md btn-primary">Search
                                                            </button>
                                                        </Col>
                                                        <Col md={1}>
                                                            {this.state.isSearch &&
                                                            <button
                                                                className="btn btn-md btn-warning"
                                                                style={{"display": "block"}}
                                                                onClick={this.clear}>Clear</button>}
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>

                                            <ReactTable
                                                data={data}
                                                getTdProps={(state, rowInfo, column, instance) => {
                                                    return {
                                                        onClick: (e, handleOriginal) => {
                                                            // this.state.modalpopInformation = [];
                                                            // this.state.columnData = [];
                                                            if (rowInfo !== undefined) {
                                                                console.log(column.Header)
                                                                if (column.Header == "Action") {
                                                                    console.log(rowInfo.original)
                                                                    const userinformation = JSON.parse(localStorage.getItem('userinformation'))
                                                                    const metaData = userinformation.user_metadata


                                                                    var docDefinition = {
                                                                        header: {
                                                                            columns: [
                                                                                {
                                                                                    image: 'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAABakAAADQCAYAAAANr+1kAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF/mlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoyYzRlNDY5Ny04ZGU1LTRiMmYtYWRlYi04YjgyYjcwZjg4NTEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RDI0RjE1N0FGODZFMTFFOUIwOTJGMDVCREM5OEQxMTkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MjhjMDA3N2MtZjYwYi00NjBjLWEwMzctM2M0ZmM0NTQ3NjI3IiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChNYWNpbnRvc2gp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',
                                                                                    width: 100,
                                                                                    margin: [35, 20, 0, 0]
                                                                                },
                                                                                {
                                                                                    text: 'Web TransactionAuthorization Form',
                                                                                    alignment: 'right',
                                                                                    margin: [0, 20, 35, 0]
                                                                                },
                                                                            ]
                                                                        },
                                                                        content: [
                                                                            {
                                                                                text: '4660 NE Belknap ct',
                                                                                margin: [-5, 0, 0, 0],
                                                                                style: 'address'
                                                                            },
                                                                            {
                                                                                text: 'Ste 101',
                                                                                margin: [-5, 0, 0, 0],
                                                                                style: 'address'
                                                                            },
                                                                            {
                                                                                text: 'Hillsboro, Oregon 97124',
                                                                                margin: [-5, 0, 0, 0],
                                                                                style: 'address'

                                                                            },
                                                                            {
                                                                                margin: [0, 30, 0, 0],
                                                                                columns: [
                                                                                    {
                                                                                        width: '50%',
                                                                                        text: 'Account Number',
                                                                                        style: 'title'
                                                                                    },
                                                                                    {
                                                                                        width: '50%',
                                                                                        text: metaData.accountId,
                                                                                        style: 'value'
                                                                                    }
                                                                                ]
                                                                            },
                                                                            {
                                                                                margin: [0, 10, 0, 0],
                                                                                columns: [
                                                                                    {
                                                                                        width: '50%',
                                                                                        text: 'Consumer Name',
                                                                                        style: 'title'
                                                                                    },
                                                                                    {
                                                                                        width: '50%',
                                                                                        text: rowInfo.original.customerInformation.customerName,
                                                                                        style: 'value'
                                                                                    }
                                                                                ]
                                                                            },
                                                                            {
                                                                                margin: [0, 10, 0, 0],
                                                                                columns: [
                                                                                    {
                                                                                        width: '50%',
                                                                                        text: 'Consumer Address',
                                                                                        style: 'title'
                                                                                    },
                                                                                    {
                                                                                        width: '50%',
                                                                                        text: rowInfo.original.customerInformation.address1,
                                                                                        style: 'value'
                                                                                    }
                                                                                ]
                                                                            },
                                                                            {
                                                                                margin: [0, 5, 0, 0],
                                                                                columns: [
                                                                                    {
                                                                                        width: '100%',
                                                                                        text: rowInfo.original.customerInformation.address2,
                                                                                        style: 'value'
                                                                                    }
                                                                                ]
                                                                            },
                                                                            {
                                                                                margin: [0, 5, 0, 0],
                                                                                columns: [
                                                                                    {
                                                                                        width: '100%',
                                                                                        text: rowInfo.original.customerInformation.city + ' ' + rowInfo.original.customerInformation.stateProvince,
                                                                                        style: 'value'
                                                                                    }
                                                                                ]
                                                                            },
                                                                            {
                                                                                margin: [0, 5, 0, 0],
                                                                                columns: [
                                                                                    {
                                                                                        width: '100%',
                                                                                        text: rowInfo.original.customerInformation.zipCode,
                                                                                        style: 'value'
                                                                                    }
                                                                                ]
                                                                            },
                                                                            {
                                                                                margin: [0, 50, 0, 0],
                                                                                columns: [
                                                                                    {
                                                                                        width: '50%',
                                                                                        text: 'Transaction ID',
                                                                                        style: 'title'
                                                                                    },
                                                                                    {
                                                                                        width: '50%',
                                                                                        text: rowInfo.original.id,
                                                                                        style: 'value'
                                                                                    }
                                                                                ]
                                                                            },
                                                                            {
                                                                                margin: [0, 10, 0, 0],
                                                                                columns: [
                                                                                    {
                                                                                        width: '50%',
                                                                                        text: 'Transaction Date',
                                                                                        style: 'title'
                                                                                    },
                                                                                    {
                                                                                        width: '50%',
                                                                                        text: moment(rowInfo.original.otherInformation.submitingData).format('MM/DD/YYYY, hh:MMa'),
                                                                                        style: 'value'
                                                                                    }
                                                                                ]
                                                                            },
                                                                            {
                                                                                margin: [0, 10, 0, 0],
                                                                                columns: [
                                                                                    {
                                                                                        width: '50%',
                                                                                        text: 'Payment Amount',
                                                                                        style: 'title'
                                                                                    },
                                                                                    {
                                                                                        width: '50%',
                                                                                        text: '$ ' + rowInfo.original.otherInformation.returnresponse.initial_amount,
                                                                                        style: 'value'
                                                                                    }
                                                                                ]
                                                                            },
                                                                            {
                                                                                margin: [0, 10, 0, 0],
                                                                                columns: [
                                                                                    {
                                                                                        width: '50%',
                                                                                        text: 'Bank Routing Number',
                                                                                        style: 'title'
                                                                                    },
                                                                                    {
                                                                                        width: '50%',
                                                                                        text: rowInfo.original.paymentInformation.routingNumber,
                                                                                        style: 'value'
                                                                                    }
                                                                                ]
                                                                            },
                                                                            {
                                                                                margin: [0, 10, 0, 0],
                                                                                columns: [
                                                                                    {
                                                                                        width: '50%',
                                                                                        text: 'Bank Account Number',
                                                                                        style: 'title'
                                                                                    },
                                                                                    {
                                                                                        width: '50%',
                                                                                        text: rowInfo.original.paymentInformation.accountNumber,
                                                                                        style: 'value'
                                                                                    }
                                                                                ]
                                                                            },
                                                                            {
                                                                                margin: [0, 10, 0, 0],
                                                                                columns: [
                                                                                    {
                                                                                        width: '50%',
                                                                                        text: 'Bank Account Type',
                                                                                        style: 'title'
                                                                                    },
                                                                                    {
                                                                                        width: '50%',
                                                                                        text: rowInfo.original.paymentInformation.accountType,
                                                                                        style: 'value'
                                                                                    }
                                                                                ]
                                                                            },
                                                                            {
                                                                                margin: [0, 50, 0, 0],
                                                                                columns: [
                                                                                    {
                                                                                        width: '50%',
                                                                                        text: 'Consumer E-mail Address',
                                                                                        style: 'title'
                                                                                    },
                                                                                    {
                                                                                        width: '50%',
                                                                                        text: rowInfo.original.otherInformation.returnresponse.custemail,
                                                                                        style: 'value'
                                                                                    }
                                                                                ]
                                                                            }

                                                                        ],
                                                                        styles: {
                                                                            title: {},
                                                                            value: {
                                                                                alignment: 'right'
                                                                            },
                                                                            address: {
                                                                                fontSize: '8'
                                                                            }
                                                                        }
                                                                    };

                                                                    pdfMake.createPdf(docDefinition).open();
                                                                    ;


                                                                    //         if (rowInfo.original.paymentInformation.returnStatus != 0) {
                                                                    //             if (rowInfo.original.otherInformation.returnresponse.status == "Accepted") {
                                                                    //                 this.setState({'loading': true});
                                                                    //                 const rowValue = {
                                                                    //                     action_code: 'R',
                                                                    //                     prev_history_id: rowInfo.original.otherInformation.returnresponse.history_id,
                                                                    //                     order_id: rowInfo.original.otherInformation.returnresponse.order_id,
                                                                    //                     initial_amount: rowInfo.original.otherInformation.returnresponse.initial_amount
                                                                    //                 }
                                                                    //                 Axios.post(setting.site_Setting.API_URL + 'refund/refundInitialAmount', rowValue, {headers: setting.jwtTokenHeader}).then(data => {
                                                                    //                     this.setState({'loading': false});
                                                                    //                     toast['success'](data.data.message);
                                                                    //                     this.fetchVTList();
                                                                    //                 }).catch(error => {
                                                                    //                     this.setState({'loading': false});
                                                                    //                     toast['error'](error.response.data.message);
                                                                    //                 })
                                                                    //             }
                                                                    //         }
                                                                    //
                                                                } else {
                                                                    console.log(222)
                                                                    //         if (rowInfo !== undefined) {
                                                                    //             Axios.get(setting.site_Setting.API_URL + 'virtualTerminal/' + rowInfo.original.id, {headers: setting.jwtTokenHeader}).then(data => {
                                                                    //
                                                                    //                 this.state.modalpopInformation.push(data.data);
                                                                    //                 this.state.columnData.push(rowInfo.row);
                                                                    //                 this.show('flip');
                                                                    //             }).catch(error => {
                                                                    //             })
                                                                    //         }
                                                                }
                                                            }
                                                            if (handleOriginal) {
                                                                handleOriginal()
                                                            }
                                                        }
                                                    }
                                                }}
                                                defaultFilterMethod={this.filterCaseInsensitive}
                                                sorted={[{
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
                                                                            <span>{cell.original.id}</span>
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
                                                                Header: "Customer Email",
                                                                width: 250,
                                                                accessor: "customerInformation.customerEmail",
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
                                                                Cell: cell => {
                                                                    return (
                                                                        <label
                                                                            className="btn bt-xs btn-danger">Generate
                                                                            Document</label>
                                                                    );

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
                                </Container>
                            </ReactCSSTransitionGroup>
                        </div>
                        <AppFooter/>
                    </div>
                </div>
            </Fragment>);
    }
}
