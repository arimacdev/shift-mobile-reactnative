import request from './ApiCentral';
import {
    GET_ALL_PROJECTS_BY_USER,
    GET_ALL_TASKS_BY_PROJECT,
    GET_MY_TASKS_BY_PROJECT

} from '../api/API';

 function getAllProjectsByUserData(userID) {
    return request({
        url: GET_ALL_PROJECTS_BY_USER + 'userId='+userID,
        method: 'GET'
    }, true,false);
}

function getAllTaskInProjectsData(userID,projectID) {
    return request({
        url: GET_ALL_TASKS_BY_PROJECT + projectID + '/tasks/user?userId='+userID,
        method: 'GET'
    }, true,true);
}

function getMyTaskInProjectsData(userID,projectID) {
    return request({
        url: GET_MY_TASKS_BY_PROJECT + projectID + '/tasks?userId='+userID,
        method: 'GET'
    }, true,true);
}

const APIServices = {
    getAllProjectsByUserData,
    getAllTaskInProjectsData,
    getMyTaskInProjectsData
};

export default APIServices;
