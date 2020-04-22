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

    GET_PROJECT_DETAILS_TASK,
    GET_PROJECT_PEOPLE,

    GET_ALL_USERS_BY_PROJECT_ID,
    ADD_PEOPLE_TO_PROJECT,
    ADD_TASK_TO_PROJECT,
    ADD_FILE_TO_TASK,
    GET_TASK_IN_PROJECT,
    UPDATE_PROJECT_TASK,
    GET_ALL_SUB_TASKS,
    DELETE_SUB_TASK,
    ADD_SUB_TASK,
    UPDATE_SUB_TASK,
    DELETE_TASK,
    GET_FILES_IN_TASK,
    DELETE_FILE_IN_TASK,
    ADD_SLACK_ID,
    GET_WORKLOAD_WITH_COMPLETION,
    UPDATE_PEOPLE_PROJECT,
    GET_GROUP_TASK_DATA,
    ADD_GROUP_TASK_DATA

} from '../api/API';
import AsyncStorage from '@react-native-community/async-storage';

async function getAllProjectsByUserData(userID) {
    let userIDHeder = null;
    userIDHeder =  await AsyncStorage.getItem('userID');
    let headers =  {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    };

    return request({
        url: GET_ALL_PROJECTS_BY_USER + 'userId=' + userID,
        method: 'GET'
    }, true, headers);
}

function getUserData(userID) {
    let headers =  {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    };
    
    return request({
        url: GET_ALL_USER + '/' + userID,
        method: 'GET'
    }, true, headers);
}

function getAllTaskInProjectsData(userID, projectID) {
    let headers =  {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        type : 'project',
    };

    return request({
        url: GET_MY_TASKS_BY_PROJECT + projectID + '/tasks?userId=' + userID,
        method: 'GET'
    }, true, headers);
}


function getMyTaskInProjectsData(userID, projectID) {
    let headers =  {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        type : 'project',
    };
    return request({
        url: GET_ALL_TASKS_BY_PROJECT + projectID + '/tasks/user?userId=' + userID,
        method: 'GET'
    }, true, headers);
}

function getAllUsersData() {
    let headers =  {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    };

    return request({
        url: GET_ALL_USERS,
        method: 'GET'
    }, true, headers);
}

function addUserData(firstName, lastName, userName, email, password, confirmPassword) {
    let headers =  {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    };
    return request({
        url: CREATE_USER,
        method: 'POST',
        data: {
            firstName: firstName,
            lastName: lastName,
            userName: userName,
            email: email,
            password: password,
        }
    }, true, headers);
}

function editUserData(firstName, lastName, userName, email, password, confirmPassword, userID) {
    let headers =  {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    };
    return request({
        url: UPDATE_USER + '/' + userID,
        method: 'PUT',
        data: {
            firstName: firstName,
            lastName: lastName,
            userName: userName,
            email: email,
            password: password,
        }
    }, true, headers);
};

function addprojectData(projectName, projectClient, IsoStartDate, IsoSEndDate, projectOwner) {
    let headers =  {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    };
    return request({
        url: ADD_PROJECT,
        method: 'POST',
        data: {
            projectOwner: projectOwner,
            projectName: projectName,
            clientId: projectClient,
            projectStartDate: IsoStartDate,
            projectEndDate: IsoSEndDate
        }
    }, true,headers);
}

async function getProjectData(projectID) {
    let userIDHeder = null;
    userIDHeder =  await AsyncStorage.getItem('userID');
    
    let headers =  {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        user : userIDHeder,
    };
    return request({
        url: GET_PROJECT + '/' + projectID,
        method: 'GET'
    }, true,headers);
}

function updateProjectData(projectID, userID, projectName, projectClient, IsoStartDate, IsoSEndDate, projectStatus) {

    let headers =  {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    };

    return request({
        url: UPDATE_PROJECT + '/' + projectID,
        method: 'PUT',
        data: {
            modifierId: userID,
            projectName: projectName,
            clientId: projectClient,
            projectStatus: projectStatus,
            projectStartDate: IsoStartDate,
            projectEndDate: IsoSEndDate
        }
    }, true, headers);
};

async function deleteProjectData(projectID) {
    let userIDHeder = null;
    userIDHeder =  await AsyncStorage.getItem('userID');

    let headers =  {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        user : userIDHeder,
    };

    return request({
        url: DELETE_PROJECT + '/' + projectID,
        method: 'DELETE'
    }, true, headers);
}

async function getProjectTaskDetails(projectID) {
    let userIDHeder = null;
    userIDHeder =  await AsyncStorage.getItem('userID');
    
    let headers =  {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        user : userIDHeder,
    };

    return request({
        url: GET_PROJECT_DETAILS_TASK + '/' + projectID + '/tasks/completion',
        method: 'GET'
    }, true,headers);
};

async function getProjectPeopleData(projectID, userID) {

    let userIDHeder = null;
    userIDHeder =  await AsyncStorage.getItem('userID');
    
    let headers =  {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        user : userIDHeder,
        type : 'project',
    };

    return request({
        url: GET_PROJECT_PEOPLE + '/' + projectID + '/tasks/' + userID + '/completion/details',
        method: 'GET'
    }, true, headers);
};

function getActiveUsers() {
    let headers =  {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    };
    return request({
        url: GET_ALL_USERS,
        method: 'GET'
    }, true, headers);
};

function addUserToProjectData(assignerId, userID, role, assigneeProjectRole, projectID) {
    let headers =  {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    };

    return request({
        url: ADD_PEOPLE_TO_PROJECT + '/' + projectID + '/users',
        method: 'POST',
        data: {
            assignerId: assignerId,
            assigneeId: userID,
            assigneeJobRole: role,
            assigneeProjectRole: assigneeProjectRole,
        }
    }, true, headers);
};

async function getAllUsersByProjectId(projectID) {
    let userIDHeder = null;
    userIDHeder =  await AsyncStorage.getItem('userID');
    
    let headers =  {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        user : userIDHeder,
        type : 'project',
    };

    return request({
        url: GET_ALL_USERS_BY_PROJECT_ID + '/' + projectID,
        method: 'GET'
    }, true, headers);
}

async function getProjecTaskData(projectID,selectedProjectTaskID) {
    let userIDHeder = null;
    userIDHeder =  await AsyncStorage.getItem('userID');
    
    let headers =  {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        user : userIDHeder,
    };
    return request({
        url: GET_TASK_IN_PROJECT+'/'+projectID +'/tasks/'+selectedProjectTaskID,
        method: 'GET'
    }, true,headers);
};

async function updateTaskNameData(projectID,taskID,text) {
    let userIDHeder = null;
    userIDHeder =  await AsyncStorage.getItem('userID');
    
    let headers =  {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        user : userIDHeder,
    };

    return request({
        url: UPDATE_PROJECT_TASK +'/'+projectID+'/tasks/'+taskID,
        method: 'PUT',
        data: {
            taskName : text,
            taskType: "project"
        }
    }, true,headers);
};

async function updateTaskStatusData(projectID,taskID,searchValue) {

    let userIDHeder = null;
    userIDHeder =  await AsyncStorage.getItem('userID');
    
    let headers =  {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        user : userIDHeder,
    };

    return request({
        url: UPDATE_PROJECT_TASK +'/'+projectID+'/tasks/'+taskID,
        method: 'PUT',
        data: {
            taskStatus : searchValue,
            taskType: "project"
        }
    }, true,headers);
};

async function updateTaskDueDateData(projectID,taskID,dueDate) {

    let userIDHeder = null;
    userIDHeder =  await AsyncStorage.getItem('userID');
    
    let headers =  {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        user : userIDHeder,
    };

    return request({
        url: UPDATE_PROJECT_TASK +'/'+projectID+'/tasks/'+taskID,
        method: 'PUT',
        data: {
            taskDueDate : dueDate,
            taskType: "project"
        }
    }, true,headers);
};

async function updateTaskReminderDateData(projectID,taskID,reminderDate) {
    let userIDHeder = null;
    userIDHeder =  await AsyncStorage.getItem('userID');
    
    let headers =  {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        user : userIDHeder,
    };

    return request({
        url: UPDATE_PROJECT_TASK +'/'+projectID+'/tasks/'+taskID,
        method: 'PUT',
        data: {
            taskRemindOnDate : reminderDate,
            taskType: "project"
        }
    }, true,headers);
};

async function updateTaskAssigneeData(projectID,taskID,userID) {
    let userIDHeder = null;
    userIDHeder =  await AsyncStorage.getItem('userID');
    
    let headers =  {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        user : userIDHeder,
    };

    return request({
        url: UPDATE_PROJECT_TASK +'/'+projectID+'/tasks/'+taskID,
        method: 'PUT',
        data: {
            taskAssignee : userID,
            taskType: "project"
        }
    }, true,headers);
};

async function updateTaskNoteData(projectID,taskID,note) {

    let userIDHeder = null;
    userIDHeder =  await AsyncStorage.getItem('userID');
    
    let headers =  {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        user : userIDHeder,
    };

    return request({
        url: UPDATE_PROJECT_TASK +'/'+projectID+'/tasks/'+taskID,
        method: 'PUT',
        data: {
            taskNotes : note,
            taskType: "project"
        }
    }, true,headers);
};

function addTaskToProjectData(taskName, initiator, assigneeId, selectedStatus, dueDate, selectedDateReminder, notes, selectedProjectID) {
    
    let headers =  {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    };

    console.log(dueDate, 'dueDate')
    console.log(selectedDateReminder, 'selectedDateReminder')
    return request({
        url: ADD_TASK_TO_PROJECT + '/' + selectedProjectID + '/tasks',
        method: 'POST',
        data: {
            taskName: taskName,
            projectId: selectedProjectID,
            taskInitiator: initiator,
            taskAssignee: assigneeId,
            taskDueDate: dueDate,
            taskRemindOnDate: selectedDateReminder,
            taskType: "project",
            taskNotes: notes,
            taskStatus: selectedStatus
        }
    }, true, headers);
};

async function addFileToTask(file, taskId, selectedProjectID) {

    let userIDHeder = null;
    userIDHeder =  await AsyncStorage.getItem('userID');
    
    let headers =  {
        Accept: 'application/json',
        'content-type': 'multipart/form-data',
        user : userIDHeder,
    };

    const file1 = {
        uri: file[0].uri,
        name: 'image-pmtool'+ new Date().getTime(),
        type: file[0].type,
    };
    const formData = new FormData(); 
    formData.append('taskType', "project");
    formData.append('type', "taskFile");
    formData.append('files', file1);
    return request({
        url: ADD_FILE_TO_TASK + '/' + selectedProjectID + '/tasks/' + taskId + '/upload',
        method: 'POST',
        data: formData
    }, true, headers);
};

async function deleteSingleTask(selectedProjectID, taskId, taskName, initiator) {

    let userIDHeder = null;
    userIDHeder =  await AsyncStorage.getItem('userID');
    
    let headers =  {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        user : userIDHeder,
        type: "project"
    };

    return request({
        url: DELETE_TASK + '/' + selectedProjectID + '/tasks/' + taskId,
        method: 'DELETE',
        data: {
            taskName: taskName,
            projectId: selectedProjectID,
            taskInitiator: initiator,
            taskType: "project",
        }
    }, true, headers);
}

function updateSlackNotificationStatus(userID, email, value) {

    let headers =  {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    };

    return request({
        url: UPDATE_USER + '/' + userID + '/slack/status',
        method: 'PUT',
        data: {
            slackAssignerId: userID,
            slackAssigneeId: userID,
            assigneeSlackId: email,
            notificationStatus: value
        }
    }, true, headers);
};

function getSubTaskData(projectID,taskID,userID) {
    let headers =  {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        type : 'project',
    };

    return request({
        url: GET_ALL_SUB_TASKS + '/' + projectID + '/tasks/' + taskID + '/subtask?userId=' + userID,
        method: 'GET'
    }, true, headers);
}

async function deleteSubTask(projectID,taskID,subtaskId) {

    let userIDHeder = null;
    userIDHeder =  await AsyncStorage.getItem('userID');
    
    let headers =  {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        user : userIDHeder,
        type: "project"
    };

    return request({
        url: DELETE_SUB_TASK + '/' + projectID + '/tasks/' + taskID + '/subtask/' + subtaskId,
        method: 'DELETE'
    }, true, headers);
};

function addSubTask(userID,projectID,taskID,subTaskName) {

    let headers =  {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    };

    return request({
        url: ADD_SUB_TASK + '/' + projectID + '/tasks/' + taskID + '/subtask',
        method: 'POST',
        data : {
            taskId : taskID,
            subtaskName : subTaskName,
            subTaskCreator: userID,
            taskType: "project"
        
        }
    }, true, headers);
};

async function updateSubTask(userID,projectID,taskID,subTaskID,subTaskName,isSelected) {

    let userIDHeder = null;
    userIDHeder =  await AsyncStorage.getItem('userID');

    let headers =  {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        user : userIDHeder,
    };

    return request({
        url: UPDATE_SUB_TASK + '/' + projectID + '/tasks/' + taskID + '/subtask/' + subTaskID,
        method: 'PUT',
        data : {
            subtaskName : subTaskName,//
            subtaskStatus : isSelected,//
            subTaskEditor: userID,//
            taskType: "project"
        
        }
    }, true, headers);
};

async function getFilesInTaskData(projectID,taskID,userID) {

    let userIDHeder = null;
    userIDHeder =  await AsyncStorage.getItem('userID');
    
    let headers =  {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        user : userIDHeder,
        type: "project"
    };

    return request({
        url: GET_FILES_IN_TASK + '/' + projectID + '/tasks/' + taskID + '/files' ,
        method: 'GET',
    }, true, headers);
};

async function deleteFileInTaskData(projectID,taskID,taskFileId) {

    let userIDHeder = null;
    userIDHeder =  await AsyncStorage.getItem('userID');
    
    let headers =  {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        user : userIDHeder,
        taskType : "project"
    };

    return request({
        url: DELETE_FILE_IN_TASK + '/' + projectID + '/tasks/' + taskID + '/upload/' + taskFileId,
        method: 'DELETE'
    }, true, headers);
};

async function addSlackID(userID, authedUserID) {
    let userIDHeder = null;
    userIDHeder =  await AsyncStorage.getItem('userID');
    

    return request({
        url: ADD_SLACK_ID +'/'+ userIDHeder + '/slack',
        method: 'PUT',
        data: {
            slackAssignerId: userID,
            slackAssigneeId: userID,
            assigneeSlackId: authedUserID
        }
    }, true,headers);
};

async function getWorkloadWithCompletion(userID) {
    let userIDHeder = null;
    userIDHeder =  await AsyncStorage.getItem('userID');
    
    let headers =  {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        user : userIDHeder,
    };

    return request({
        url: GET_WORKLOAD_WITH_COMPLETION + '/workload',
        method: 'GET',
    }, true,headers);
};
    
async function updateRolePeopleData(isSelected,role,userType,projectID,assignerId) {

    let userIDHeder = null;
    userID =  await AsyncStorage.getItem('userID');

    let headers =  {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    };
    return request({
        url: UPDATE_PEOPLE_PROJECT + '/' + projectID + '/users/' + assignerId,
        method: 'PUT',
        data: {
            assignerId : userID,
            assigneeJobRole : role,
            assigneeProjectRole : userType
        }
    }, true, headers);
};

async function getWorkloadWithAssignTasksCompletion(userID, from, to) {
    let userIDHeder = null;
    userIDHeder =  await AsyncStorage.getItem('userID');
    
    let headers =  {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        user : userIDHeder,
        from : from,
        to   : to
    };

    return request({
        url: GET_WORKLOAD_WITH_COMPLETION + '/' + userIDHeder +'/workload',
        method: 'GET',
    }, true,headers);
};





async function getGroupTaskData() {
    let userIDHeder = null;
    userIDHeder =  await AsyncStorage.getItem('userID');
    
    let headers =  {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        user : userIDHeder,
    };
    return request({
        url: GET_GROUP_TASK_DATA ,
        method: 'GET',
    }, true,headers);
};

async function addGroupTaskData(groupName) {

    let taskGroupCreator = null;
    taskGroupCreator =  await AsyncStorage.getItem('userID');

    let headers =  {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    };

    return request({
        url: GET_GROUP_TASK_DATA,
        method: 'POST',
        data: {
            taskGroupName: groupName,
            taskGroupCreator: taskGroupCreator,
        }
    }, true, headers);
};

const APIServices = {
    getAllProjectsByUserData,
    getUserData,
    getAllTaskInProjectsData,
    getMyTaskInProjectsData,
    getAllUsersData,
    addUserData,
    editUserData,
    addprojectData,
    getProjectData,
    updateProjectData,
    deleteProjectData,
    getProjectTaskDetails,
    getProjectPeopleData,
    getAllUsersByProjectId,
    getActiveUsers,
    addUserToProjectData,
    addTaskToProjectData,
    addFileToTask,
    getProjecTaskData,
    updateTaskNameData,
    updateTaskStatusData,
    updateTaskDueDateData,
    updateTaskReminderDateData,
    deleteSingleTask,
    updateTaskAssigneeData,
    updateTaskNoteData,
    updateSlackNotificationStatus,
    getSubTaskData,
    deleteSubTask,
    addSubTask,
    updateSubTask,
    getFilesInTaskData,
    deleteFileInTaskData,
    addSlackID,
    getWorkloadWithCompletion,
    getWorkloadWithAssignTasksCompletion,
    updateRolePeopleData,
    getGroupTaskData,
    addGroupTaskData
};

export default APIServices;
