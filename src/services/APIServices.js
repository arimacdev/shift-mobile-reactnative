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
    UPDATE_PROJECT_TASK

} from '../api/API';

function getAllProjectsByUserData(userID) {
    return request({
        url: GET_ALL_PROJECTS_BY_USER + 'userId=' + userID,
        method: 'GET'
    }, true, false, false);
}

function getAllTaskInProjectsData(userID, projectID) {
    return request({
        url: GET_MY_TASKS_BY_PROJECT + projectID + '/tasks?userId=' + userID,
        method: 'GET'
    }, true, true, false);
}


function getMyTaskInProjectsData(userID, projectID) {
    return request({
        url: GET_ALL_TASKS_BY_PROJECT + projectID + '/tasks/user?userId=' + userID,
        method: 'GET'
    }, true, true, false);
}

function getAllUsersData() {
    return request({
        url: GET_ALL_USERS,
        method: 'GET'
    }, true, false, false);
}

function getUserData(userID) {
    return request({
        url: GET_ALL_USER + '/' + userID,
        method: 'GET'
    }, true, false, false);
}

function addUserData(firstName, lastName, userName, email, password, confirmPassword) {
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
    }, true, false, false);
}

function editUserData(firstName, lastName, userName, email, password, confirmPassword, userID) {
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
    }, true, false, false);
};

function addprojectData(projectName, projectClient, IsoStartDate, IsoSEndDate, projectOwner) {
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
    }, true, false, false);
}

function getProjectData(projectID) {
    return request({
        url: GET_PROJECT + '/' + projectID,
        method: 'GET'
    }, true, false, true);
}

function updateProjectData(projectID, userID, projectName, projectClient, IsoStartDate, IsoSEndDate, projectStatus) {
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
    }, true, false, false);
};

function deleteProjectData(projectID) {
    return request({
        url: DELETE_PROJECT + '/' + projectID,
        method: 'DELETE'
    }, true, false, true);
}

function getProjectTaskDetails(projectID) {
    return request({
        url: GET_PROJECT_DETAILS_TASK + '/' + projectID + '/tasks/completion',
        method: 'GET'
    }, true, false, true);
};

function getProjectPeopleData(projectID, userID) {
    return request({
        url: GET_PROJECT_PEOPLE + '/' + projectID + '/tasks/' + userID + '/completion/details',
        method: 'GET'
    }, true, true, true);
};

function getActiveUsers() {
    return request({
        url: GET_ALL_USERS,
        method: 'GET'
    }, true, false, false);
};

function addUserToProjectData(assignerId, userID, role, assigneeProjectRole, projectID) {
    return request({
        url: ADD_PEOPLE_TO_PROJECT + '/' + projectID + '/users',
        method: 'POST',
        data: {
            assignerId: assignerId,
            assigneeId: userID,
            assigneeJobRole: role,
            assigneeProjectRole: assigneeProjectRole,
        }
    }, true, false, false);
};

function getAllUsersByProjectId(projectID) {
    return request({
        url: GET_ALL_USERS_BY_PROJECT_ID + '/' + projectID,
        method: 'GET'
    }, true, true, true);
}

function getProjecTaskData(projectID,selectedProjectTaskID) {
    return request({
        url: GET_TASK_IN_PROJECT+'/'+projectID +'/tasks/'+selectedProjectTaskID,
        method: 'GET'
    }, true,false,true);
};

function updateTaskNameData(projectID,taskID,text) {
    return request({
        url: UPDATE_PROJECT_TASK +'/'+projectID+'/tasks/'+taskID,
        method: 'PUT',
        data: {
            taskName : text,
            taskType: "project"
        }
    }, true,false,true);
};

function updateTaskStatusData(projectID,taskID,searchValue) {
    return request({
        url: UPDATE_PROJECT_TASK +'/'+projectID+'/tasks/'+taskID,
        method: 'PUT',
        data: {
            taskStatus : searchValue,
            taskType: "project"
        }
    }, true,false,true);
};

function updateTaskDueDateData(projectID,taskID,dueDate) {
    return request({
        url: UPDATE_PROJECT_TASK +'/'+projectID+'/tasks/'+taskID,
        method: 'PUT',
        data: {
            taskDueDate : dueDate,
            taskType: "project"
        }
    }, true,false,true);
};

function updateTaskReminderDateData(projectID,taskID,reminderDate) {
    return request({
        url: UPDATE_PROJECT_TASK +'/'+projectID+'/tasks/'+taskID,
        method: 'PUT',
        data: {
            taskRemindOnDate : reminderDate,
            taskType: "project"
        }
    }, true,false,true);
};

function updateTaskAssigneeData(projectID,taskID,userID) {
    return request({
        url: UPDATE_PROJECT_TASK +'/'+projectID+'/tasks/'+taskID,
        method: 'PUT',
        data: {
            taskAssignee : userID,
            taskType: "project"
        }
    }, true,false,true);
};

function updateTaskNoteData(projectID,taskID,note) {
    return request({
        url: UPDATE_PROJECT_TASK +'/'+projectID+'/tasks/'+taskID,
        method: 'PUT',
        data: {
            taskNotes : note,
            taskType: "project"
        }
    }, true,false,true);
};

function addTaskToProjectData(taskName, initiator, assigneeId, selectedStatus, dueDate, selectedDateReminder, notes, selectedProjectID) {
    console.log(selectedProjectID, 'selectedProjectIDselectedProjectID')
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
            taskNotes: notes
        }
    }, true, false, false);
};

function addFileToTask(file, taskId, selectedProjectID) {

    const file1 = {
        uri: file[0].uri,
        name: 'image-pmtool'+ new Date().getTime(),
        type: file[0].type,
    };
    const formData = new FormData();
    formData.append('taskType', "project");
    formData.append('type', "profileImage");
    formData.append('files', file1);
    return request({
        url: ADD_FILE_TO_TASK + '/' + selectedProjectID + '/tasks/' + taskId + '/upload',
        method: 'POST',
        data: formData
    }, true, false, true);
};

function updateSlackNotificationStatus(userID, email, value) {
    return request({
        url: UPDATE_USER + '/' + userID + '/slack/status',
        method: 'PUT',
        data: {
            slackAssignerId: userID,
            slackAssigneeId: userID,
            assigneeSlackId: email,
            notificationStatus: value
        }
    }, true, false, false);
};


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
    updateTaskAssigneeData,
    updateTaskNoteData,
    updateSlackNotificationStatus
};

export default APIServices;
