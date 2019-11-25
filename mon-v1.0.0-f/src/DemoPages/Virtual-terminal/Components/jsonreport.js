import React, { Fragment } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {
    Row, Col,
    Card, CardBody
} from 'reactstrap';

import ReactTable from "react-table";
import PageTitle from '../../../Layout/AppMain/PageTitle';
import Axios from 'axios';
import { setting } from '../../../environment';



export default class VirtualJsonLoopBack extends React.Component {
    constructor() {
        super();
        this.state = {
            data: []
        };
    }
    componentDidMount(){
        this.fetchVTList()
    }
    fetchVTList(){
        Axios.post('http://localhost:3010/json-data', {headers: setting.jwtTokenHeader}).then(result=>{
            this.setState({data: JSON.parse(result.data.jData)});
            
        }).catch(error=>{
            console.log(error);
        })
    }
    filterCaseInsensitive = ({ id, value }, row) =>row[id] ? row[id].toLowerCase().includes(value.toLowerCase()) : true
    render(){
        return (
            <Fragment>
                <ReactCSSTransitionGroup
                    component="div"
                    transitionName="TabsAnimation"
                    transitionAppear={true}
                    transitionAppearTimeout={0}
                    transitionEnter={false}
                    transitionLeave={false}>
                    <div>
                        <PageTitle
                            heading="Virtual Terminal Report"
                            subheading="Choose between regular React Bootstrap tables or advanced dynamic ones."
                            icon="pe-7s-notebook icon-gradient bg-tempting-azure"
                            childPageName="Terminal Report"
                            parentPageName="Virtual Terminal"
                        />
                    </div>
                    <Row>
                        <Col md="12">
                            <Card className="main-card mb-3">
                                <CardBody>
                                <ReactTable
                                        data={this.state.data}
                                        defaultFilterMethod={this.filterCaseInsensitive}
                                        columns={[
                                            {
                                                columns: [
                                                    {
                                                        Header: "Id",
                                                        filterable:true,
                                                        accessor: "id",
                                                    },
                                                    {
                                                        Header: "Employee Name",
                                                        filterable:true,
                                                        accessor: "employee_name",
                                                    },
                                                    {
                                                        Header: "Employee age",
                                                        accessor: "employee_age",
                                                        filterable:true
                                                    },
                                                    {
                                                        Header: "Employee Salary",
                                                        filterable:true,
                                                        accessor: "employee_salary"
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
                </ReactCSSTransitionGroup>
            </Fragment>
        )
    }
}