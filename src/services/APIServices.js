import request from './ApiCentral';
import {
    GET_ALL_PROJECTS_BY_USER,
    GET_ALL_TASKS_BY_PROJECT,
    GET_MY_TASKS_BY_PROJECT,

    GET_ALL_USERS,
    GET_ALL_USER,
    CREATE_USER,
    UPDATE_USER,

    ADD_PROJECT,
    GET_PROJECT,
    UPDATE_PROJECT,
    DELETE_PROJECT,

    GET_PROJECT_DETAILS_TASK

} from '../api/API';

 function getAllProjectsByUserData(userID) {
    return request({
        url: GET_ALL_PROJECTS_BY_USER + 'userId='+userID,
        method: 'GET'
    }, true,false,false);
}

function getAllTaskInProjectsData(userID,projectID) {
    return request({
        url: GET_MY_TASKS_BY_PROJECT + projectID + '/tasks?userId='+userID,
        method: 'GET'
    }, true,true,false);
}


function getMyTaskInProjectsData(userID,projectID) {
    return request({
        url: GET_ALL_TASKS_BY_PROJECT + projectID + '/tasks/user?userId='+userID,
        method: 'GET'
    }, true,true,false);
}

function getAllUsersData() {
    return request({
        url: GET_ALL_USERS,
        method: 'GET'
    }, true,false,false);
}

function getUserData(userID) {
    return request({
        url: GET_ALL_USER+'/'+userID,
        method: 'GET'
    }, true,false,false);
}

function addUserData(firstName,lastName,userName,email,password,confirmPassword) {
    return request({
        url: CREATE_USER,
        method: 'POST',
        data: {
            firstName: firstName,
            lastName: lastName,
            userName: userName,
            email: email,
            password:password,
        }
    }, true,false,false);
}

function editUserData(firstName,lastName,userName,email,password,confirmPassword,userID) {
    return request({
        url: UPDATE_USER+'/'+userID,
        method: 'PUT',
        data: {
            firstName: firstName,
            lastName: lastName,
            userName: userName,
            email: email,
            password:password,
        }
    }, true,false,false);
};

function addprojectData(projectName,projectClient,IsoStartDate,IsoSEndDate,projectOwner) {
    return request({
        url: ADD_PROJECT,
        method: 'POST',
        data: {
            projectOwner : projectOwner,
            projectName : projectName,
            clientId : projectClient,
            projectStartDate : IsoStartDate,
            projectEndDate : IsoSEndDate
        }
    }, true,false,false);
}

function getProjectData(projectID) {
    return request({
        url: GET_PROJECT+'/'+projectID,
        method: 'GET'
    }, true,false,true);
}

function updateProjectData(projectID,userID,projectName,projectClient,IsoStartDate,IsoSEndDate,projectStatus) {
    return request({
        url: UPDATE_PROJECT +'/'+projectID,
        method: 'PUT',
        data: {
            modifierId : userID,
            projectName : projectName,
            clientId : projectClient,
            projectStatus : projectStatus,
            projectStartDate : IsoStartDate,
            projectEndDate : IsoSEndDate
        }
    }, true,false,false);
};

function deleteProjectData(projectID) {
    return request({
        url: DELETE_PROJECT+'/'+projectID,
        method: 'DELETE'
    }, true,false,true);
}

function getProjectTaskDetails(projectID) {
    return request({
        url: GET_PROJECT_DETAILS_TASK+'/'+projectID+'/tasks/completion',
        method: 'GET'
    }, true,false,true);
}

const APIServices = {
    getAllProjectsByUserData,
    getAllTaskInProjectsData,
    getMyTaskInProjectsData,
    getAllUsersData,
    getUserData,
    addUserData,
    editUserData,
    addprojectData,
    getProjectData,
    updateProjectData,
    deleteProjectData,
    getProjectTaskDetails
};

export default APIServices;
