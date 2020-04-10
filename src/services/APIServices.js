import request from './ApiCentral';
import {
    GET_ALL_PROJECTS_BY_USER,
    GET_ALL_TASKS_BY_PROJECT
} from '../api/API';

 function getAllProjectsByUserData(userID) {
    return request({
        url: GET_ALL_PROJECTS_BY_USER + 'userId='+userID,
        method: 'GET'
    }, true,false);
}

function getAllTaskInProjectsData(userID,projectID) {
    return request({
        url: GET_ALL_TASKS_BY_PROJECT + projectID + '/tasks?userId='+userID,
        method: 'GET'
    }, true,true);
}

const APIServices = {
    getAllProjectsByUserData,
    getAllTaskInProjectsData
};

export default APIServices;
