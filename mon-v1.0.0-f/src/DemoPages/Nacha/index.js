import React, {Fragment} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {Card, CardBody, CardTitle, Col, Container, Row} from 'reactstrap';
import AppHeader from '../../Layout/AppHeader/';
import AppSidebar from '../../Layout/AppSidebar/';
import AppFooter from '../../Layout/AppFooter/';
import ThemeOptions from '../../Layout/ThemeOptions/';
import axios from 'axios'
import {setting} from './../../environment';
import FileDownload from 'js-file-download';


export default class NachaPage extends React.Component {
    constructor(props) {
        super(props);
        this.onHandleGenerate = this.onHandleGenerate.bind(this)
        this.downloadFile = this.downloadFile.bind(this)
    }

    state = {
        vxvtTotalCount: 0,
        refundTotal: 0,
        vxvtTotalAmount: 0,
        refundTotalAmount: 0,
        disabled: false
    }

    componentDidMount() {
        const options = {
            headers: {'x-access-token': localStorage.getItem('jwttoken')}
        };
        axios.get(setting.site_Setting.API_URL + 'nacha/getData?id=' + localStorage.getItem('user_mon_id'), options).then((result) => {
            this.setState({...result.data})
        }).catch(error => {

        })
    }

    onHandleGenerate() {
        const options = {
            headers: {'x-access-token': localStorage.getItem('jwttoken')}
        };
        this.setState({disabled: true})
        axios.post(setting.site_Setting.API_URL + 'nacha/create', {}, options).then((result) => {
            console.log(result)
            this.setState({disabled: false, url: setting.site_Setting.API_URL + result.data.url})
            console.log(result.data.url)
        }).catch(error => {

        })
    }

    downloadFile() {
        const options = {
            headers: {'x-access-token': localStorage.getItem('jwttoken')}
        };
        axios.get(setting.site_Setting.API_URL + 'nacha/download', options).then((result) => {
            FileDownload(result.data, 'NACHA.txt')
        }).catch(error => {

        })
    }

    render() {
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
                                            <CardTitle>Nacha</CardTitle>
                                            <Row>
                                                <Col className="bottomcard" sm="4" xs="4" xl="4" lg="4" md="4">
                                                    <div className="source-wrapper_nacha">
                                                        <div className="info">
                                                            <div className="label">
                                                                Total Transactions
                                                            </div>
                                                            <div className="value">
                                                                {this.state.vxvtTotalCount + this.state.refundTotal}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Col>

                                                <Col className="bottomcard" sm="4" xs="4" xl="4" lg="4" md="4">
                                                    <div className="source-wrapper_nacha">
                                                        <div className="info">
                                                            <div className="label">
                                                                Total Debits ({this.state.vxvtTotalCount})
                                                            </div>
                                                            <div className="value">
                                                                {this.state.vxvtTotalAmount.toFixed(2)} $
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Col>

                                                <Col className="bottomcard" sm="4" xs="4" xl="4" lg="4" md="4">
                                                    <div className="source-wrapper_nacha">
                                                        <div className="info">
                                                            <div className="label">
                                                                Total Credits ({this.state.refundTotal})
                                                            </div>
                                                            <div className="value">
                                                                {this.state.refundTotalAmount.toFixed(2)} $
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col className="bottomcard" sm="12" xs="12" xl="12" lg="12" md="12">
                                                    <div className="nacha-wrapper">
                                                        <button disabled={this.state.disabled}
                                                                onClick={this.onHandleGenerate}
                                                                className="mt-6 btn btn-info btn-lg">Generate NACHA File
                                                        </button>
                                                        {this.state.url &&
                                                        <span className="fileDownload">
                                                            {`Your NACHA file was generated. `}
                                                            <span className='download-link' onClick={this.downloadFile}>Download File</span>
                                                        </span>}
                                                    </div>
                                                </Col>
                                            </Row>
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
