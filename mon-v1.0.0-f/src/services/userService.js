import Axios from "axios";
import { setting } from "../environment";

export const getUserInfo = (JwtToken)=> new Promise((resolve, reject)=>{
    Axios.post(setting.site_Setting.API_URL +'users/getUser', {'_id': JwtToken}).then(data=>{
        return resolve(data);
    }).catch(error=>{
        return reject(error);
    })
})