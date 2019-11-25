import React, {Component} from 'react';
import jwt_decode from 'jwt-decode';
import Loader from 'react-loaders';
import Axios from 'axios';
import {setting} from './environment';
import {toast} from 'react-toastify';

export default class CallBack extends Component {
    componentDidMount() {
        let hash = this.props.location.hash;
        let query = hash ? hash.replace('#', '') : '';
        const params = new URLSearchParams(query);
        const token = params.get('id_token');
        if (token) {
            const userDetails = jwt_decode(token);
            Axios.post(setting.site_Setting.API_URL + 'users/getUserById', {Id: userDetails.sub}).then((result) => {

                if (result.status == 200) {
                    Axios.post(setting.site_Setting.API_URL + 'users/getUser', {email: result.data.message.email}).then((data) => {

                        localStorage.setItem('user_mon_id', data.data.body._id);
                        localStorage.setItem('jwttoken', data.data.token);

                        const serverName = process.env.REACT_APP_REDIRECT_AFTER_LOGOUT
                        window.location.href = serverName.split('#')[0] + "#/dashboards/commerce";

                        // this.props.history.push('/virtualTerminal/virtual-terminal')
                        // window.location.reload();
                        //user is found that why we are not doing anything....
                    }).catch(error => {
                        const socialUserInformation = {
                            email: result.data.message.email,
                            name: result.data.message.name,
                            user_metadata: {
                                username: result.data.message.name,
                                given_name: result.data.message.given_name,
                                nickname: result.data.message.nickname,
                                user_type: result.data.message.identities[0].connection,
                                isSocial: result.data.message.identities[0].isSocial,
                                user_id: result.data.message.user_id,
                                family_name: result.data.message.family_name,
                                picture: result.data.message.picture,
                                source: "Actum"
                            }
                        };

                        Axios.post(setting.site_Setting.API_URL + 'users/createUserInOurDatabase', socialUserInformation).then(result => {
                            localStorage.setItem('jwttoken', result.data.token);
                            localStorage.setItem('user_mon_id', result.data._id);
                            window.location.href = window.location.origin + "/#/virtualTerminal/virtual-terminal";
                        }).catch(error => {
                        })
                    });

                    toast['success']('Welcome ' + result.data.message.name);
                    localStorage.setItem('userinformation', JSON.stringify(result.data.message));
                }
            }).catch((error) => {

            })
        } else {
            toast['error']('Access denied.');
            this.props.history.push('/pages/login');
        }
    }


    render() {
        return (
            <>
                <div className="loader-container">
                    <div className="loader-container-inner">
                        <div className="text-center">
                            <Loader type="ball-pulse-rise"/>
                        </div>
                        <h6 className="mt-5">
                            Please wait while we fetching the details of user
                        </h6>
                    </div>
                </div>
            </>
        )
    }
}
