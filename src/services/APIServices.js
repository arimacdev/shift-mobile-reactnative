import request from './ApiCentral';
import {
    GET_ALL_PROJECTS_BY_USER,
    GET_ALL_TASKS_BY_PROJECT,
    GET_MY_TASKS_BY_PROJECT,

    GET_ALL_USERS,
    GET_ALL_USER

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

function getAllUsersData() {
    return request({
        url: GET_ALL_USERS,
        method: 'GET'
    }, true,false);
}

function getUserData(userID) {
    return request({
        url: GET_ALL_USER+'/'+userID,
        method: 'GET'
    }, true,false);
}

const APIServices = {
    getAllProjectsByUserData,
    getAllTaskInProjectsData,
    getMyTaskInProjectsData,
    getAllUsersData,
    getUserData
};

export default APIServices;
