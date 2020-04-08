import request from './ApiCentral';
import {
    LOGIN,
} from '../api/API';


//auth--------------------------------------------------------------------------------------
function login(email, password) {
    return request({
        url: LOGIN,
        method: 'POST',
        data: {
            email : email,
            password : password,
        }
    }, false);
}

const APIServices = {
    login,
};

export default APIServices;
