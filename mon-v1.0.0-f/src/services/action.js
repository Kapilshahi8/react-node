import Axios from "axios";

class apiService{

    post(url, data){
        Axios.post(process.env.REACT_APP_API_URL+url)
    }

    get(){

    }

    patch(){

    }

    put(){

    }

    delete(){
        Axios
    }

}