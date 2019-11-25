import React, { Fragment } from 'react';
import { Button, Col, Row } from "reactstrap";
import { AvField, AvForm } from "availity-reactstrap-validation";
import axios from 'axios'
import { setting } from './../../environment';
import SweetAlert from 'sweetalert-react/lib/SweetAlert';

export default class Accounts extends React.Component {
    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.removeAccount = this.removeAccounts.bind(this);
        this.cancelButton = this.cancelButton.bind(this)
        this.state = {
            editMode: false,
            accounts: {
                accountName: "",
                accountDescription: ""
            },
            hideFrom: false
        }
    }

    componentDidMount() {
        this.setState({ accounts: this.props.accounts })
    }

    confirmToRemove() {
        this.setState({message5: true});
    }
    removeAccounts(){
        console.log(this.state.accounts._id);
        
        axios.post(setting.site_Setting.API_URL + 'virtualAccount/remove', {_id: this.state.accounts._id}, {headers: setting.jwtTokenHeader}).then((result) => {
            this.setState({hideFrom: true})
            this.setState({showDeleteSuccessAlert: true})
            this.setState({'text': result.data.message})
        }).catch(error => {

        })
    }
    handleSubmit(event, errors, values) {
        console.log(errors, values, this.state.source)
        if (!errors.length) {
            let dataTosend = values;
            dataTosend['_id'] = this.state.accounts._id

            const options = {
                headers: { 'x-access-token': localStorage.getItem('jwttoken') }
            };

            axios.post(setting.site_Setting.API_URL + 'virtualAccount/update', dataTosend, options).then((result) => {
                this.setState({ accounts: result.data.body, editMode: false })
                
            }).catch(error => {

            })
        }
    }
    cancelButton(){
        this.setState({message5 : false})
        this.setState({'editMode': false})
    }
    render() {
        const accounts = this.state.accounts;
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
                                    <AvField value={this.props.accounts.accountName} name="accountName"
                                        type="text"
                                        placeholder="Virtual Account Name" validate={{
                                            required: {
                                                value: true,
                                                errorMessage: 'This field is required.'
                                            },
                                            pattern: {
                                                value: '^[A-Za-z0-9+!@#$-%&*(). ]+$',
                                                errorMessage: 'Virtual Account Name must be composed only with letter and numbers'
                                            },
                                            minLength: {
                                                value: 3,
                                                errorMessage: 'Virtual Account Name must be between 3 and 50 characters'
                                            },
                                            maxLength: {
                                                value: 50,
                                                errorMessage: 'Virtual Account Name must be between 6 and 50 characters'
                                            }
                                         }} />
                                    <AvField value={this.props.accounts.accountDescription} name="accountDescription"
                                        type="text"
                                        placeholder="Virtual Account Description" validate={{
                                            required: {
                                                value: true,
                                                errorMessage: 'This field is required.'
                                            },
                                            pattern: {
                                                value: '^[A-Za-z0-9+,\'’/!@#$-%&*(). ]+$',
                                                errorMessage: 'Virtual Account Description must be composed only with letter and numbers'
                                            },
                                            minLength: {
                                                value: 3,
                                                errorMessage: 'Virtual Account Description must be between 3 and 50 characters'
                                            },
                                            maxLength: {
                                                value: 10000,
                                                errorMessage: 'Virtual Account Description must be between 6 and 50 characters'
                                            }
                                         }} />
                                </div>}


                            {!this.state.editMode &&
                                <div className='source-data-edit' >
                                    <div style={{
                                        "display": "flex",
                                        "flexDirection": "column"
                                    }}>
                                        <div style={{
                                            "display": "flex",
                                            "lineHeight": "25px"
                                        }}>
                                            <span
                                                style={{ "flex": 1 }}>Virtual Account id: </span><span
                                                    style={{ "flex": 1 }}>{accounts.newAccountId}</span>
                                        </div>

                                        <div style={{
                                            "display": "flex",
                                            "lineHeight": "25px"
                                        }}>
                                            <span
                                                style={{ "flex": 1 }}>Virtual Account Name: </span><span
                                                    style={{ "flex": 1 }}>{accounts.accountName}</span>
                                        </div>
                                        
                                        <div style={{
                                            "display": "flex",
                                            "lineHeight": "28px"
                                        }}>
                                            <span
                                                style={{ "flex": 1 }}>Virtual Account Description: </span><span
                                                    style={{ "flex": 1 }}>{accounts.accountDescription}</span>
                                        </div>
                                    </div>
                                </div>}

                            <Row className="pull-right">
                                <Col md="12">
                                    <div className={"pull-right"}>
                                        {!this.state.editMode && <Button type="button" onClick={() => {
                                            self.setState({ editMode: true })
                                        }} size="lg" className="editSource mt-6" color="info">Edit</Button>}

                                        {this.state.editMode &&
                                            <div>
                                                <button type="submit" size="lg" className="btn btn-info mr-3" color="info">Update</button>
                                                <span onClick={() => this.confirmToRemove()} className="removeSource btn btn-danger customDanger">Remove</span>
                                                <SweetAlert
                                                title="Are you sure?"
                                                confirmButtonColor=""
                                                show={this.state.message5}
                                                text="You will not be able to recover this bank again!"
                                                showCancelButton
                                                onConfirm={() => this.removeAccounts()}
                                                onCancel={() => this.cancelButton()}/>

                                            <SweetAlert
                                                title="Deleted"
                                                confirmButtonColor=""
                                                show={this.state.showDeleteSuccessAlert}
                                                text={this.state.text}
                                                type="success"
                                                onConfirm={() => this.setState({showDeleteSuccessAlert: false, message5:false})}/>
                                                <button onClick={this.cancelButton} type="button" className="btn btn-warning text-white "> Cancel </button>
                                            </div>
                                        }
                                    </div>
                                </Col>
                            </Row>
                        </AvForm>
                    </div>
                </Col>


            </Fragment>);
    }
}
