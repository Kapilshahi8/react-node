import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { Button, Card, CardBody, CardTitle, Col, Container, FormGroup, Row, ButtonGroup, ListGroup, ListGroupItem } from 'reactstrap';
import Tabs, {TabPane} from 'rc-tabs';
import TabContent from 'rc-tabs/lib/SwipeableTabContent';
import ScrollableInkTabBar from 'rc-tabs/lib/ScrollableInkTabBar';
import { AvField, AvForm } from 'availity-reactstrap-validation';
import { setting } from '../../../../environment';
import axios from 'axios'
import Loader from 'react-loaders';
import BlockUi from 'react-block-ui';
import { toast } from "react-toastify";
import { permissionUpdated } from '../../../../reducers/ThemeOptions';
import Can from './../../../../config/can'
import { getUserInfo } from '../../../../services/userService';
import PageTitle from '../../../../Layout/AppMain/PageTitle';
import ProfileBox from './profilebox';
import ChangePassword from './changePassword';
class UserEditPage extends React.Component {
    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {
            fname: '',
            lname: '',
            email: '',
            phone: '',
            user_metadata: {},
            loading: false,
            roleUpdated: this.props.roleUpdated,
            activeTab: '1',
            expSlideRight: false,
            userProfilebox: {},
            userimage: "",
        }
    }

    componentDidMount() {
        let userinformation = JSON.parse(localStorage.getItem('userinformation'))
        let isArr = Array.isArray(userinformation)
        userinformation = isArr ? userinformation[0] : userinformation;
        this.state.userimage = userinformation.picture;

        let { family_name: lname, given_name: fname, email, phone = '', user_id, user_metadata = {} } = userinformation
        if (isArr) {
            [fname, ...lname] = userinformation.name.split(' ')
            lname = lname.join(' ')
        }
        this.setState({ ...this.state, ...{ fname, lname, email, phone, user_id, user_metadata } })
        getUserInfo().then(data => {
            this.setState({ 'userProfilebox': data.data.body });
        });
    }

    handleSubmit(event, errors, values) {

        if (!errors.length) {
            this.setState({ loading: true })
            const dataToSend = {
                email: values.email,
                user_metadata: {
                    updated: Date.now(),
                    role: values.role,
                    source: values.source
                },
                app_metadata: {}
            }
            axios.post(setting.site_Setting.API_URL + 'users/' + this.state.user_id + '/update', dataToSend).then((result) => {
                const userData = result.data.body
                localStorage.setItem('userinformation', JSON.stringify(Object.assign({}, JSON.parse(localStorage.getItem('userinformation')), userData)))
                const userinformation = JSON.parse(localStorage.getItem('userinformation'))
                const [firstName, lastName] = (userinformation.name || '').split(' ')
                this.setState({
                    fname: firstName || '',
                    lname: lastName || '',
                    email: userinformation.email || '',
                    phone: userinformation.phone || '',
                    companyName: userinformation.user_metadata.companyName || '',
                    loading: false,
                    userinformation
                })
                toast['success']('User was updated');
                this.props.permissionUpdated();

                setTimeout(() => {
                    window.location.reload(true)
                }, 1000)

            }).catch(error => {
                this.setState({ loading: false })
                if (error.response !== undefined) {
                    toast['error'](error.response.data.message);
                } else {
                    toast['error'](error.message);
                }
            })
        }
    }
    toggle2(name) {
        this.setState({
            [name]: !this.state[name],
            progress: 0.5,
        })
    }
    render() {
        const { role = 'MERCHANT', source = 'Actum' } = this.state.user_metadata
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
                            <PageTitle
                                    heading="User Profile"
                                    icon="lnr-user icon-gradient bg-ripe-malin"
                            />
                        <Tabs
                            defaultActiveKey="1"
                            renderTabBar={() => <ScrollableInkTabBar />}
                            renderTabContent={() => <TabContent />}
                        >
                            <TabPane tab='User Profile' key="1">
                                <Row>
                                    <ProfileBox
                                    userProfilebox={this.state.userProfilebox}
                                    userimage={this.state.userimage}/>
                                    <Col md={8}>
                                        <Card className="main-card mb-3">
                                            <CardBody>
                                                <CardTitle>User Profile</CardTitle>
                                                <AvForm onSubmit={this.handleSubmit}>
                                                    <Row>
                                                        <Col md="12">
                                                            <Row>
                                                                <Col md="12">
                                                                    <Row>
                                                                        <Col md="6">
                                                                            <AvField value={this.state.fname} disabled name="fname"
                                                                                label="First Name" type="text"
                                                                                placeholder="First Name" validate={{
                                                                                    required: {
                                                                                        value: true,
                                                                                        errorMessage: 'This field is required.'
                                                                                    },
                                                                                    pattern: {
                                                                                        value: '^[A-Za-z0-9]+$',
                                                                                        errorMessage: 'Your name must be composed only with letter and numbers'
                                                                                    },
                                                                                    minLength: {
                                                                                        value: 3,
                                                                                        errorMessage: 'Your name must be between 3 and 16 characters'
                                                                                    },
                                                                                    maxLength: {
                                                                                        value: 16,
                                                                                        errorMessage: 'Your name must be between 6 and 16 characters'
                                                                                    }
                                                                                }} />
                                                                        </Col>
                                                                        <Col md="6">
                                                                            <AvField value={this.state.lname} disabled name="lname"
                                                                                label="Last Name" type="text"
                                                                                placeholder="Last Name" validate={{
                                                                                    required: {
                                                                                        value: true,
                                                                                        errorMessage: 'This field is required.'
                                                                                    },
                                                                                    pattern: {
                                                                                        value: '^[A-Za-z0-9]+$',
                                                                                        errorMessage: 'Your name must be composed only with letter and numbers'
                                                                                    },
                                                                                    minLength: {
                                                                                        value: 3,
                                                                                        errorMessage: 'Your name must be between 3 and 16 characters'
                                                                                    },
                                                                                    maxLength: {
                                                                                        value: 16,
                                                                                        errorMessage: 'Your name must be between 6 and 16 characters'
                                                                                    }
                                                                                }} />
                                                                        </Col>
                                                                    </Row>

                                                                    {/* Radios */}
                                                                    {this.state.email && this.state.email.length > 0 &&
                                                                        <AvField disabled value={this.state.email}
                                                                            name="email" label="E-mail"
                                                                            type="email"
                                                                            placeholder="Email Address" validate={{
                                                                                required: {
                                                                                    value: true,
                                                                                    errorMessage: 'This field is required.'
                                                                                }
                                                                            }} />
                                                                    }
                                                                    {this.state.phone && this.state.phone.length > 0 &&
                                                                        <AvField disabled value={this.state.phone} name="phone"
                                                                            label="Phone Number"
                                                                            type="text"
                                                                            placeholder="Enter Mobile Number" validate={{
                                                                                required: {
                                                                                    value: false,
                                                                                    errorMessage: 'This field is required.'
                                                                                },
                                                                                pattern: {
                                                                                    value: '^[+,0-9]+$',
                                                                                    errorMessage: 'Your name must be composed only with letter and numbers'
                                                                                },
                                                                                minLength: {
                                                                                    value: 3,
                                                                                    errorMessage: 'Your name must be between 3 and 16 characters'
                                                                                },
                                                                                maxLength: {
                                                                                    value: 16,
                                                                                    errorMessage: 'Your name must be between 6 and 16 characters'
                                                                                }
                                                                            }} />
                                                                    }

                                                                    <Row>
                                                                        <Col md="6">
                                                                            <AvField type="select" value={role} label="Role"
                                                                                name="role"
                                                                                required>
                                                                                {(['ADMIN', 'AGENT'].includes(role)) &&
                                                                                    <option value="ADMIN">Admin</option>}
                                                                                {(['ADMIN', 'ISO'].includes(role)) &&
                                                                                    <option value="ISO">ISO</option>}
                                                                                {(['ADMIN', 'AGENT'].includes(role)) &&
                                                                                    <option value="AGENT">Agent</option>}
                                                                                {(['ADMIN', 'MERCHANT'].includes(role)) &&
                                                                                    <option value="MERCHANT">Merchant</option>}
                                                                                {(['ADMIN', 'ODFI'].includes(role)) &&
                                                                                    <option value="ODFI">ODFI</option>}
                                                                            </AvField>
                                                                        </Col>
                                                                        <Col md="6">
                                                                            <Can I="see" on="source">
                                                                                <AvField type="select" value={source} label="Source"
                                                                                    name="source"
                                                                                    required>
                                                                                    <option value="Actum">Actum</option>
                                                                                </AvField>
                                                                            </Can>
                                                                        </Col>
                                                                    </Row>
                                                                </Col>
                                                            </Row>
                                                            <Row className="pull-right">
                                                                <Col md="12">
                                                                    <FormGroup className={"pull-right"}>
                                                                        <Button size="lg" className="mt-6"
                                                                            color="info">Update</Button>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                    </Row>

                                                </AvForm>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                </Row>
                            </TabPane>
                            <TabPane tab='Change Password' key="2">
                                <Row>
                                    <Col md={8} lg={8} xs={12}>
                                        <ChangePassword/>
                                    </Col>
                                </Row>
                            </TabPane>
                        </Tabs>
                    </ReactCSSTransitionGroup>
                </BlockUi>
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    roleUpdated: state.ThemeOptions.roleUpdated
})

const mapDispatchToProps = dispatch => ({
    permissionUpdated: () => dispatch(permissionUpdated())

})

export default connect(mapStateToProps, mapDispatchToProps)(UserEditPage)
