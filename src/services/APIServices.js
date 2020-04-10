import request from './ApiCentral';
import {
    GET_ALL_PROJECTS_BY_USER,
} from '../api/API';

 function getAllProjectsByUserData(userID) {
    return request({
        url: GET_ALL_PROJECTS_BY_USER + 'userId='+userID,
        method: 'GET'
    }, true);
}

const APIServices = {
    getAllProjectsByUserData,
};

export default APIServices;
