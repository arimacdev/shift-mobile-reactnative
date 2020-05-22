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
  ADD_GROUP_TASK_DATA,
  ADD_ALL_TASK_BY_GROUP_DATA,
  ADD_TASK_TO_GROUP_TASK_DATA,
  DELETE_GROUP_TASK_DATA,
  UPDATE_GROUP_TASK_DATA,
  GET_SINGLE_GROUP_TASK_DATA,
  GET_PEOPLE_IN_TASK,
  ADD_ALL_TASK_BY_ME_DATA,
  ADD_TASK_TO_MY_TASK_DATA,
  ADD_FILE_TO_PROJECT,
  DELETE_PROJECT_FILES,
  GET_PROJECT_FILES,
  ADD_PEOPLE_TO_TASK_GROUP,
  GET_GROUP_SINGLE_TASK_DATA,
  UPDATE_GROUP_TASK_SINGLE_TASK,
  GET_MY_SINGLE_TASK_DATA,
  UPDATE_MY_SINGLE_TASK_DATA,
  GET_ALL_PERSONAL_TASK_FILES,
  DELETE_PERSONAL_TASK_FILE,
  ADD_FILE_TO_MY_TASK,
  DELETE_MY_TASK,
  GET_ALL_SUB_TASKS_IN_MY_TASK,
  DELETE_SUB_TASKS_IN_MY_TASK,
  MY_TASK_ADD_SUB_TASK,
  MY_TASK_UPDATE_SUB_TASK,
  GET_SPRINTS_BY_PROJECT,
  ADD_EDIT_SPRINT_BY_PROJECT,
  UPDATE_SPRINT,
  ADD_MAIN_TASK_TO_PROJECT,
  ADD_SUB_TASK_TO_PROJECT,
  FILTER_TASK_IN_PROJECT,
  VIEW_ALL_TASK_BY_GROUP_DATA,
  UPLOAD_USER_PROFILE,
  UPDATE_PARENT_TO_CHILD,
  GET_TASK_LOG,
  GET_CHILD_TASK_OF_PARENT,
  DELETE_TASK_IN_GROUP,
  GET_CHILD_TASK_OF_TASK_GROUP,
  UPDATE_PARENT_TO_CHILD_IN_GROUP,
  GET_ALL_USERS_WORKLOAD_WITH_COMPLETION,
  GET_MOBILE_VERSION_STATUS
} from '../api/API';
import AsyncStorage from '@react-native-community/async-storage';
import {SET_UPLOAD_PROGRESS} from '../redux/types';
import _ from 'lodash';

async function getAllProjectsByUserData(userID) {
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');
  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  return request(
    {
      url: GET_ALL_PROJECTS_BY_USER + 'userId=' + userID,
      method: 'GET',
    },
    true,
    headers,
  );
}

function getUserData(userID) {
  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  return request(
    {
      url: GET_ALL_USER + '/' + userID,
      method: 'GET',
    },
    true,
    headers,
  );
}

function getAllTaskInProjectsData(userID, projectID) {
  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    type: 'project',
  };

  return request(
    {
      url: GET_MY_TASKS_BY_PROJECT + projectID + '/tasks?userId=' + userID,
      method: 'GET',
    },
    true,
    headers,
  );
}

function getMyTaskInProjectsData(userID, projectID) {
  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    type: 'project',
  };
  return request(
    {
      url:
        GET_ALL_TASKS_BY_PROJECT + projectID + '/tasks/user?userId=' + userID,
      method: 'GET',
    },
    true,
    headers,
  );
}

function getAllUsersData() {
  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  return request(
    {
      url: GET_ALL_USERS,
      method: 'GET',
    },
    true,
    headers,
  );
}

function addUserData(
  firstName,
  lastName,
  userName,
  email,
  password,
  confirmPassword,
) {
  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  return request(
    {
      url: CREATE_USER,
      method: 'POST',
      data: {
        firstName: firstName,
        lastName: lastName,
        userName: userName,
        email: email,
        password: password,
      },
    },
    true,
    headers,
  );
}

function editUserData(
  firstName,
  lastName,
  userName,
  email,
  password,
  confirmPassword,
  userID,
) {
  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  return request(
    {
      url: UPDATE_USER + '/' + userID,
      method: 'PUT',
      data: {
        firstName: firstName,
        lastName: lastName,
        userName: userName,
        email: email,
        password: password,
      },
    },
    true,
    headers,
  );
}

function addprojectData(
  projectName,
  projectClient,
  IsoStartDate,
  IsoSEndDate,
  projectOwner,
  projectAlias,
) {
  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  return request(
    {
      url: ADD_PROJECT,
      method: 'POST',
      data: {
        projectOwner: projectOwner,
        projectName: projectName,
        clientId: projectClient,
        projectStartDate: IsoStartDate,
        projectEndDate: IsoSEndDate,
        projectAlias: projectAlias,
      },
    },
    true,
    headers,
  );
}

async function getProjectData(projectID) {
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    user: userIDHeder,
  };
  return request(
    {
      url: GET_PROJECT + '/' + projectID,
      method: 'GET',
    },
    true,
    headers,
  );
}

function updateProjectData(
  projectID,
  userID,
  projectName,
  projectClient,
  IsoStartDate,
  IsoSEndDate,
  projectStatus,
  projectAlias
) {
  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  return request(
    {
      url: UPDATE_PROJECT + '/' + projectID,
      method: 'PUT',
      data: {
        modifierId: userID,
        projectName: projectName,
        clientId: projectClient,
        projectStatus: projectStatus,
        projectStartDate: IsoStartDate,
        projectEndDate: IsoSEndDate,
        projectAlias: projectAlias,
      },
    },
    true,
    headers,
  );
}

async function deleteProjectData(projectID) {
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    user: userIDHeder,
  };

  return request(
    {
      url: DELETE_PROJECT + '/' + projectID,
      method: 'DELETE',
    },
    true,
    headers,
  );
}

async function getProjectTaskDetails(projectID) {
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    user: userIDHeder,
  };

  return request(
    {
      url: GET_PROJECT_DETAILS_TASK + '/' + projectID + '/tasks/completion',
      method: 'GET',
    },
    true,
    headers,
  );
}

async function getProjectPeopleData(projectID, userID) {
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    user: userIDHeder,
    type: 'project',
  };

  return request(
    {
      url:
        GET_PROJECT_PEOPLE +
        '/' +
        projectID +
        '/tasks/' +
        userID +
        '/completion/details',
      method: 'GET',
    },
    true,
    headers,
  );
}

function getActiveUsers() {
  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  return request(
    {
      url: GET_ALL_USERS,
      method: 'GET',
    },
    true,
    headers,
  );
}

function addUserToProjectData(
  assignerId,
  userID,
  role,
  assigneeProjectRole,
  projectID,
) {
  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  return request(
    {
      url: ADD_PEOPLE_TO_PROJECT + '/' + projectID + '/users',
      method: 'POST',
      data: {
        assignerId: assignerId,
        assigneeId: userID,
        assigneeJobRole: role,
        assigneeProjectRole: assigneeProjectRole,
      },
    },
    true,
    headers,
  );
}

async function getAllUsersByProjectId(projectID) {
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    user: userIDHeder,
    type: 'project',
  };

  return request(
    {
      url: GET_ALL_USERS_BY_PROJECT_ID + '/' + projectID,
      method: 'GET',
    },
    true,
    headers,
  );
}

async function getProjecTaskData(projectID, selectedProjectTaskID) {
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    // type : 'project',
    user: userIDHeder,
  };
  return request(
    {
      url:
        GET_TASK_IN_PROJECT +
        '/' +
        projectID +
        '/tasks/' +
        selectedProjectTaskID,
      method: 'GET',
    },
    true,
    headers,
  );
}

async function updateTaskNameData(projectID, taskID, text) {
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    user: userIDHeder,
  };

  return request(
    {
      url: UPDATE_PROJECT_TASK + '/' + projectID + '/tasks/' + taskID,
      method: 'PUT',
      data: {
        taskName: text,
        taskType: 'project',
      },
    },
    true,
    headers,
  );
}

async function updateTaskStatusData(projectID, taskID, searchValue) {
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    user: userIDHeder,
  };

  return request(
    {
      url: UPDATE_PROJECT_TASK + '/' + projectID + '/tasks/' + taskID,
      method: 'PUT',
      data: {
        taskStatus: searchValue,
        taskType: 'project',
      },
    },
    true,
    headers,
  );
}

async function updateTaskDueDateData(projectID, taskID, dueDate) {
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    user: userIDHeder,
  };

  return request(
    {
      url: UPDATE_PROJECT_TASK + '/' + projectID + '/tasks/' + taskID,
      method: 'PUT',
      data: {
        taskDueDate: dueDate,
        taskType: 'project',
      },
    },
    true,
    headers,
  );
}

async function updateTaskReminderDateData(projectID, taskID, reminderDate) {
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    user: userIDHeder,
  };

  return request(
    {
      url: UPDATE_PROJECT_TASK + '/' + projectID + '/tasks/' + taskID,
      method: 'PUT',
      data: {
        taskRemindOnDate: reminderDate,
        taskType: 'project',
      },
    },
    true,
    headers,
  );
}

async function updateTaskAssigneeData(projectID, taskID, userID) {
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    user: userIDHeder,
  };

  return request(
    {
      url: UPDATE_PROJECT_TASK + '/' + projectID + '/tasks/' + taskID,
      method: 'PUT',
      data: {
        taskAssignee: userID,
        taskType: 'project',
      },
    },
    true,
    headers,
  );
}

async function updateTaskNoteData(projectID, taskID, note) {
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    user: userIDHeder,
  };

  return request(
    {
      url: UPDATE_PROJECT_TASK + '/' + projectID + '/tasks/' + taskID,
      method: 'PUT',
      data: {
        taskNotes: note,
        taskType: 'project',
      },
    },
    true,
    headers,
  );
}

function addTaskToProjectData(
  taskName,
  initiator,
  assigneeId,
  selectedStatus,
  dueDate,
  selectedDateReminder,
  notes,
  selectedProjectID,
  issueType,
  parentTaskId,
  sprintId,
) {
  console.log('issueType,', issueType);
  console.log(' parentTaskId,', parentTaskId);
  console.log(' sprintId,', sprintId);
  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  console.log(dueDate, 'dueDate');
  console.log(selectedDateReminder, 'selectedDateReminder');
  return request(
    {
      url: ADD_TASK_TO_PROJECT + '/' + selectedProjectID + '/tasks',
      method: 'POST',
      data: {
        taskName: taskName,
        projectId: selectedProjectID,
        taskInitiator: initiator,
        taskAssignee: assigneeId,
        taskDueDate: dueDate,
        taskRemindOnDate: selectedDateReminder,
        taskType: 'project',
        taskNotes: notes,
        taskStatus: selectedStatus,

        issueType: issueType,
        parentTaskId: parentTaskId,
        sprintId: sprintId,
      },
    },
    true,
    headers,
  );
}

async function addFileToTask(file, taskId, selectedProjectID) {
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'content-type': 'multipart/form-data',
    user: userIDHeder,
  };

  const file1 = {
    uri: file[0].uri,
    name: 'image-pmtool' + new Date().getTime(),
    type: file[0].type,
  };
  const formData = new FormData();
  formData.append('taskType', 'project');
  formData.append('type', 'taskFile');
  formData.append('files', file1);
  return request(
    {
      url:
        ADD_FILE_TO_TASK +
        '/' +
        selectedProjectID +
        '/tasks/' +
        taskId +
        '/upload',
      method: 'POST',
      data: formData,
    },
    true,
    headers,
  );
}

async function deleteSingleTask(
  selectedProjectID,
  taskId,
  taskName,
  initiator,
) {
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    user: userIDHeder,
    type: 'project',
  };

  return request(
    {
      url: DELETE_TASK + '/' + selectedProjectID + '/tasks/' + taskId,
      method: 'DELETE',
      data: {
        taskName: taskName,
        projectId: selectedProjectID,
        taskInitiator: initiator,
        taskType: 'project',
      },
    },
    true,
    headers,
  );
}

function updateSlackNotificationStatus(userID, email, value) {
  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  return request(
    {
      url: UPDATE_USER + '/' + userID + '/slack/status',
      method: 'PUT',
      data: {
        slackAssignerId: userID,
        slackAssigneeId: userID,
        assigneeSlackId: email,
        notificationStatus: value,
      },
    },
    true,
    headers,
  );
}

function getSubTaskData(projectID, taskID, userID) {
  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    type: 'project',
  };

  return request(
    {
      url:
        GET_ALL_SUB_TASKS +
        '/' +
        projectID +
        '/tasks/' +
        taskID +
        '/subtask?userId=' +
        userID,
      method: 'GET',
    },
    true,
    headers,
  );
}

async function deleteSubTask(projectID, taskID, subtaskId) {
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    user: userIDHeder,
    type: 'project',
  };

  return request(
    {
      url:
        DELETE_SUB_TASK +
        '/' +
        projectID +
        '/tasks/' +
        taskID +
        '/subtask/' +
        subtaskId,
      method: 'DELETE',
    },
    true,
    headers,
  );
}

function addSubTask(userID, projectID, taskID, subTaskName) {
  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  return request(
    {
      url: ADD_SUB_TASK + '/' + projectID + '/tasks/' + taskID + '/subtask',
      method: 'POST',
      data: {
        taskId: taskID,
        subtaskName: subTaskName,
        subTaskCreator: userID,
        taskType: 'project',
      },
    },
    true,
    headers,
  );
}

async function updateSubTask(
  userID,
  projectID,
  taskID,
  subTaskID,
  subTaskName,
  isSelected,
) {
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    user: userIDHeder,
  };

  return request(
    {
      url:
        UPDATE_SUB_TASK +
        '/' +
        projectID +
        '/tasks/' +
        taskID +
        '/subtask/' +
        subTaskID,
      method: 'PUT',
      data: {
        subtaskName: subTaskName, //
        subtaskStatus: isSelected, //
        subTaskEditor: userID, //
        taskType: 'project',
      },
    },
    true,
    headers,
  );
}

async function getFilesInTaskData(projectID, taskID) {
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    user: userIDHeder,
    type: 'project',
  };

  return request(
    {
      url: GET_FILES_IN_TASK + '/' + projectID + '/tasks/' + taskID + '/files',
      method: 'GET',
    },
    true,
    headers,
  );
}

async function deleteFileInTaskData(projectID, taskID, taskFileId) {
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    user: userIDHeder,
    taskType: 'project',
  };

  return request(
    {
      url:
        DELETE_FILE_IN_TASK +
        '/' +
        projectID +
        '/tasks/' +
        taskID +
        '/upload/' +
        taskFileId,
      method: 'DELETE',
    },
    true,
    headers,
  );
}

async function addSlackID(userID, authedUserID) {
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  return request(
    {
      url: ADD_SLACK_ID + '/' + userIDHeder + '/slack',
      method: 'PUT',
      data: {
        slackAssignerId: userID,
        slackAssigneeId: userID,
        assigneeSlackId: authedUserID,
      },
    },
    true,
    headers,
  );
}

async function getWorkloadWithCompletionAll() {
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    user: userIDHeder,
    from : 'all',
    to : 'all',
  };

  return request(
    {
      url: GET_ALL_USERS_WORKLOAD_WITH_COMPLETION + '/workload?assignee=all',
      method: 'GET',
    },
    true,
    headers,
  );
}

async function updateRolePeopleData(
  isSelected,
  role,
  userType,
  projectID,
  assignerId,
) {
  let userIDHeder = null;
  userID = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  return request(
    {
      url: UPDATE_PEOPLE_PROJECT + '/' + projectID + '/users/' + assignerId,
      method: 'PUT',
      data: {
        assignerId: userID,
        assigneeJobRole: role,
        assigneeProjectRole: userType,
      },
    },
    true,
    headers,
  );
}

async function getWorkloadWithAssignTasksCompletion(userID, from, to) {
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    user: userIDHeder,
    from: from,
    to: to,
  };

  return request(
    {
      url: GET_WORKLOAD_WITH_COMPLETION + '/' + userID + '/workload',
      method: 'GET',
    },
    true,
    headers,
  );
}

async function getGroupTaskData() {
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    user: userIDHeder,
  };
  return request(
    {
      url: GET_GROUP_TASK_DATA,
      method: 'GET',
    },
    true,
    headers,
  );
}

async function addGroupTaskData(groupName) {
  let taskGroupCreator = null;
  taskGroupCreator = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  return request(
    {
      url: ADD_GROUP_TASK_DATA,
      method: 'POST',
      data: {
        taskGroupName: groupName,
        taskGroupCreator: taskGroupCreator,
      },
    },
    true,
    headers,
  );
}

async function getAllTaskByGroup(selectedTaskGroupId) {
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    type: 'taskGroup',
  };
  return request(
    {
      url:
        VIEW_ALL_TASK_BY_GROUP_DATA +
        '/' +
        selectedTaskGroupId +
        '/tasks?userId=' +
        userIDHeder,
      method: 'GET',
    },
    true,
    headers,
  );
}

async function addTaskGroupTaskData(taskName, taskGroupId) {
  let taskGroupCreator = null;
  taskInitiator = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  return request(
    {
      url: ADD_TASK_TO_GROUP_TASK_DATA + '/' + taskGroupId + '/task',
      method: 'POST',
      data: {
        taskName: taskName,
        taskGroupId: taskGroupId,
        taskInitiator: taskInitiator,
        parentTaskId: null,
      },
    },
    true,
    headers,
  );
}

async function deleteGroupTaskData(selectedTaskGroupId) {
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    user: userIDHeder,
  };

  return request(
    {
      url: DELETE_GROUP_TASK_DATA + '/' + selectedTaskGroupId,
      method: 'DELETE',
    },
    true,
    headers,
  );
}

async function updateGroupTaskData(selectedTaskGroupId, groupName) {
  let user = null;
  user = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  return request(
    {
      url: UPDATE_GROUP_TASK_DATA + '/' + selectedTaskGroupId,
      method: 'PUT',
      data: {
        taskGroupName: groupName,
        taskGroupEditor: user,
      },
    },
    true,
    headers,
  );
}

async function getSingleGroupTaskData(selectedTaskGroupId) {
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    user: userIDHeder,
  };
  return request(
    {
      url: GET_SINGLE_GROUP_TASK_DATA + '/' + selectedTaskGroupId,
      method: 'GET',
    },
    true,
    headers,
  );
}

async function getTaskPeopleData(selectedTaskGroupId) {
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    user: userIDHeder,
    type: 'taskGroup',
  };
  return request(
    {
      url:
        GET_PEOPLE_IN_TASK +
        '/' +
        selectedTaskGroupId +
        '/tasks/' +
        userIDHeder +
        '/completion/details',
      method: 'GET',
    },
    true,
    headers,
  );
}

async function getAllTaskByMySelf() {
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    type: 'taskGroup',
  };
  return request(
    {
      url: ADD_ALL_TASK_BY_ME_DATA + '/' + userIDHeder,
      method: 'GET',
    },
    true,
    headers,
  );
}

async function addNewMyTaskData(taskName) {
  let taskAssignee = null;
  taskAssignee = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  return request(
    {
      url: ADD_TASK_TO_MY_TASK_DATA,
      method: 'POST',
      data: {
        taskName: taskName,
        taskAssignee: taskAssignee,
        taskDueDate: null,
        taskRemindOnDate: null,
        taskType: 'personal',
      },
    },
    true,
    headers,
  );
}

async function getGroupSingleTaskData(selectedTaskGroupId, selectedTaskID) {
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    user: userIDHeder,
    type: 'taskGroup',
  };
  return request(
    {
      url:
        GET_GROUP_SINGLE_TASK_DATA +
        '/' +
        selectedTaskGroupId +
        '/tasks/' +
        selectedTaskID,
      method: 'GET',
    },
    true,
    headers,
  );
};

async function uploadFileData(file, selectedProjectID, dispatch) {
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'content-type': 'multipart/form-data',
    user: userIDHeder,
  };

  const file1 = {
    uri: file[0].uri,
    name: 'image-pmtool' + new Date().getTime(),
    type: file[0].type,
  };
  let uri = file[0].uri;
  const formData = new FormData();
  formData.append('type', 'projectFile');
  formData.append('files', file1);
  return request(
    {
      url: ADD_FILE_TO_PROJECT + '/' + selectedProjectID + '/files/upload',
      method: 'POST',
      data: formData,
      onUploadProgress: progress => {
        const {loaded, total} = progress;
        const percentageProgress = Math.floor((loaded / total) * 100);
        dispatch({
          type: SET_UPLOAD_PROGRESS,
          payload: {uri, percentageProgress},
        });
      },
    },
    true,
    headers,
  );

  //   if (files.length) {
  //     files.forEach(async file => {
  //       const formPayload = new FormData();
  //       formPayload.append('file', file.file);
  //       try {
  //         await axios({
  //           baseURL: 'http://localhost:5000',
  //           url: '/file',
  //           method: 'post',
  //           data: formPayload,
  //           onUploadProgress: progress => {
  //             const {loaded, total} = progress;
  //             const percentageProgress = Math.floor((loaded / total) * 100);
  //             dispatch(setUploadProgress(file.id, percentageProgress));
  //           },
  //         });
  //         dispatch(successUploadFile(file.id));
  //       } catch (error) {
  //         dispatch(failureUploadFile(file.id));
  //       }
  //     });
  //   }
}

async function getProjectFiles(selectedProjectID) {
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    user: userIDHeder,
  };
  return request(
    {
      url: GET_PROJECT_FILES + '/' + selectedProjectID + '/files',
      method: 'GET',
    },
    true,
    headers,
  );
}

async function deleteProjectFile(selectedProjectID, fileId) {
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    user: userIDHeder,
  };

  return request(
    {
      url: DELETE_PROJECT_FILES + '/' + selectedProjectID + '/files/' + fileId,
      method: 'DELETE',
    },
    true,
    headers,
  );
}

async function addUserToGroupTask(userID, taskGroupId) {
  let assignerId = null;
  assignerId = await AsyncStorage.getItem('userID');
  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  return request(
    {
      url: ADD_PEOPLE_TO_TASK_GROUP,
      method: 'POST',
      data: {
        taskGroupId: taskGroupId,
        taskGroupAssigner: assignerId,
        taskGroupAssignee: userID,
      },
    },
    true,
    headers,
  );
}

async function groupTaskUpdateTaskNameData(
  selectedTaskGroupId,
  selectedTaskID,
  text,
) {
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    user: userIDHeder,
  };

  return request(
    {
      url:
        UPDATE_GROUP_TASK_SINGLE_TASK +
        '/' +
        selectedTaskGroupId +
        '/tasks/' +
        selectedTaskID,
      method: 'PUT',
      data: {
        taskName: text,
      },
    },
    true,
    headers,
  );
}

async function groupTaskUpdateTaskStatusData(
  selectedTaskGroupId,
  selectedTaskID,
  selectedTaskStatusId,
) {
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    user: userIDHeder,
  };

  return request(
    {
      url:
        UPDATE_GROUP_TASK_SINGLE_TASK +
        '/' +
        selectedTaskGroupId +
        '/tasks/' +
        selectedTaskID,
      method: 'PUT',
      data: {
        taskStatus: selectedTaskStatusId,
      },
    },
    true,
    headers,
  );
}

async function groupTaskUpdateTaskAssigneeData(
  selectedTaskGroupId,
  selectedTaskID,
  userID,
) {
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    user: userIDHeder,
  };

  return request(
    {
      url:
        UPDATE_GROUP_TASK_SINGLE_TASK +
        '/' +
        selectedTaskGroupId +
        '/tasks/' +
        selectedTaskID,
      method: 'PUT',
      data: {
        taskAssignee: userID,
      },
    },
    true,
    headers,
  );
}

async function groupTaskUpdateDueDateData(
  selectedTaskGroupId,
  selectedTaskID,
  IsoDueDate,
) {
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    user: userIDHeder,
  };

  return request(
    {
      url:
        UPDATE_GROUP_TASK_SINGLE_TASK +
        '/' +
        selectedTaskGroupId +
        '/tasks/' +
        selectedTaskID,
      method: 'PUT',
      data: {
        taskDueDate: IsoDueDate,
      },
    },
    true,
    headers,
  );
}

async function groupTaskUpdateReminderDateData(
  selectedTaskGroupId,
  selectedTaskID,
  IsoReminderDate,
) {
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    user: userIDHeder,
  };

  return request(
    {
      url:
        UPDATE_GROUP_TASK_SINGLE_TASK +
        '/' +
        selectedTaskGroupId +
        '/tasks/' +
        selectedTaskID,
      method: 'PUT',
      data: {
        taskRemindOnDate: IsoReminderDate,
      },
    },
    true,
    headers,
  );
}

async function groupTaskUpdateTaskNoteData(
  selectedTaskGroupId,
  selectedTaskID,
  note,
) {
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    user: userIDHeder,
  };

  return request(
    {
      url:
        UPDATE_GROUP_TASK_SINGLE_TASK +
        '/' +
        selectedTaskGroupId +
        '/tasks/' +
        selectedTaskID,
      method: 'PUT',
      data: {
        taskNotes: note,
      },
    },
    true,
    headers,
  );
}

async function deleteSingleInGroupTaskData(selectedTaskGroupId, taskID) {
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    user: userIDHeder,
    type: 'taskGroup',
  };

  return request(
    {
      url: DELETE_TASK_IN_GROUP + '/' + selectedTaskGroupId + '/tasks/' + taskID,
      method: 'DELETE',
    },
    true,
    headers,
  );
}

async function getMySingleTaskData(selectedTaskID) {
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    user: userIDHeder,
  };
  return request(
    {
      url: GET_MY_SINGLE_TASK_DATA + '/' + selectedTaskID,
      method: 'GET',
    },
    true,
    headers,
  );
}

async function myTaskUpdateTaskNoteData(selectedTaskID, note) {
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    user: userIDHeder,
  };

  return request(
    {
      url: UPDATE_MY_SINGLE_TASK_DATA + '/' + selectedTaskID,
      method: 'PUT',
      data: {
        taskNotes: note,
      },
    },
    true,
    headers,
  );
}

async function myTaskUpdateTaskStatusData(selectedTaskID, searchValue) {
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    user: userIDHeder,
  };

  return request(
    {
      url: UPDATE_MY_SINGLE_TASK_DATA + '/' + selectedTaskID,
      method: 'PUT',
      data: {
        taskStatus: searchValue,
      },
    },
    true,
    headers,
  );
}

async function myTaskUpdateTaskNameData(selectedTaskID, text) {
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    user: userIDHeder,
  };

  return request(
    {
      url: UPDATE_MY_SINGLE_TASK_DATA + '/' + selectedTaskID,
      method: 'PUT',
      data: {
        taskName: text,
      },
    },
    true,
    headers,
  );
}

async function myTaskUpdateDueDateData(selectedTaskID, IsoDueDate) {
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    user: userIDHeder,
  };

  return request(
    {
      url: UPDATE_MY_SINGLE_TASK_DATA + '/' + selectedTaskID,
      method: 'PUT',
      data: {
        taskDueDate: IsoDueDate,
      },
    },
    true,
    headers,
  );
}

async function myTaskUpdateReminderDateData(selectedTaskID, IsoReminderDate) {
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    user: userIDHeder,
  };

  return request(
    {
      url: UPDATE_MY_SINGLE_TASK_DATA + '/' + selectedTaskID,
      method: 'PUT',
      data: {
        taskRemindOnDate: IsoReminderDate,
      },
    },
    true,
    headers,
  );
}

async function getFilesInMyTaskData(taskID) {
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    user: userIDHeder,
  };

  return request(
    {
      url: GET_ALL_PERSONAL_TASK_FILES + '/' + taskID + '/files',
      method: 'GET',
    },
    true,
    headers,
  );
}

async function deleteFileInMyTaskData(taskID, taskFileId) {
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    user: userIDHeder,
  };

  return request(
    {
      url: DELETE_PERSONAL_TASK_FILE + '/' + taskID + '/files/' + taskFileId,
      method: 'DELETE',
    },
    true,
    headers,
  );
}

async function addFileToMyTaskData(file, taskId) {
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'content-type': 'multipart/form-data',
    user: userIDHeder,
  };

  const file1 = {
    uri: file[0].uri,
    name: 'image-pmtool' + new Date().getTime(),
    type: file[0].type,
  };
  const formData = new FormData();
  formData.append('type', 'taskFile');
  formData.append('files', file1);
  return request(
    {
      url: ADD_FILE_TO_MY_TASK + '/' + taskId + '/upload',
      method: 'POST',
      data: formData,
    },
    true,
    headers,
  );
}

async function deleteSingleInMyTaskData(taskID) {
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    user: userIDHeder,
  };

  return request(
    {
      url: DELETE_MY_TASK + '/' + taskID,
      method: 'DELETE',
    },
    true,
    headers,
  );
}

async function getMyTaskSubTaskData(selectedTaskID) {
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  return request(
    {
      url:
        GET_ALL_SUB_TASKS_IN_MY_TASK +
        '/' +
        selectedTaskID +
        '/subtask?userId=' +
        userIDHeder,
      method: 'GET',
    },
    true,
    headers,
  );
}

async function myTaskdeleteSubTask(taskID, subtaskId) {
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    user: userIDHeder,
  };

  return request(
    {
      url: DELETE_SUB_TASKS_IN_MY_TASK + '/' + taskID + '/subtask/' + subtaskId,
      method: 'DELETE',
    },
    true,
    headers,
  );
}

function myTaskAddSubTask(userID, taskID, subTaskName) {
  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  return request(
    {
      url: MY_TASK_ADD_SUB_TASK + '/' + taskID + '/subtask',
      method: 'POST',
      data: {
        taskId: taskID,
        subtaskName: subTaskName,
        subTaskCreator: userID,
        taskType: 'personal',
      },
    },
    true,
    headers,
  );
}

async function myTaskUpdateSubTask(
  userID,
  taskID,
  subTaskID,
  subTaskName,
  isSelected,
) {
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    user: userIDHeder,
  };

  return request(
    {
      url: MY_TASK_UPDATE_SUB_TASK + '/' + taskID + '/subtask/' + subTaskID,
      method: 'PUT',
      data: {
        subtaskName: subTaskName, //
        subtaskStatus: isSelected, //
        subTaskEditor: userID, //
        taskType: 'personal',
      },
    },
    true,
    headers,
  );
}

async function getAllTaskInDefaultBoardData(projectID) {
  let userID = null;
  userID = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    type: 'project',
  };

  return request(
    {
      url: GET_MY_TASKS_BY_PROJECT + projectID + '/tasks?userId=' + userID,
      method: 'GET',
    },
    true,
    headers,
  );
}

async function getAllSprintInProject(projectID) {
  let userID = null;
  userID = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    userId: userID,
  };

  return request(
    {
      url: GET_SPRINTS_BY_PROJECT + '/' + projectID,
      method: 'GET',
    },
    true,
    headers,
  );
}

async function addSprintData(projectID, sprintName, sprintDescription) {
  let userID = null;
  userID = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  return request(
    {
      url: ADD_EDIT_SPRINT_BY_PROJECT,
      method: 'POST',
      data: {
        projectId: projectID,
        sprintName: sprintName,
        sprintDescription: sprintDescription,
        sprintCreatedBy: userID,
      },
    },
    true,
    headers,
  );
}

async function editSprintData(
  projectID,
  sprintName,
  sprintDescription,
  sprintId,
) {
  let userID = null;
  userID = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    userId: userID,
  };

  return request(
    {
      url: ADD_EDIT_SPRINT_BY_PROJECT + '/' + projectID + '/' + sprintId,
      method: 'PUT',
      data: {
        sprintName: sprintName,
        sprintDescription: sprintDescription,
      },
    },
    true,
    headers,
  );
}

async function changeSprint(
  selectedId,
  previousSprintID,
  selectedProjectID,
  selectedProjectTaskID,
) {
  let userID = null;
  userID = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    user: userID,
  };

  return request(
    {
      url:
        UPDATE_SPRINT +
        '/' +
        selectedProjectID +
        '/tasks/' +
        selectedProjectTaskID +
        '/sprint',
      method: 'PUT',
      data: {
        newSprint: selectedId,
        previousSprint: previousSprintID,
      },
    },
    true,
    headers,
  );
}

async function addMainTaskToProjectData(taskName, selectedProjectID) {
  let userID = null;
  userID = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  return request(
    {
      url: ADD_MAIN_TASK_TO_PROJECT + '/' + selectedProjectID + '/tasks',
      method: 'POST',
      data: {
        taskName: taskName,
        projectId: selectedProjectID,
        taskInitiator: userID,
        //taskType: "project",
        issueType: 'general',
      },
    },
    true,
    headers,
  );
}

async function addSubTaskToProjectData(taskName, selectedProjectID, taskID) {
  let userID = null;
  userID = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  return request(
    {
      url: ADD_MAIN_TASK_TO_PROJECT + '/' + selectedProjectID + '/tasks',
      method: 'POST',
      data: {
        taskName: taskName,
        projectId: selectedProjectID,
        taskInitiator: userID,
        //taskType: "project",
        issueType: 'development',
        parentTaskId: taskID,
      },
    },
    true,
    headers,
  );
}

async function filterTaskByDate(
  selectedProjectID,
  selectedStartDate,
  selectedEndDate,
) {
  let userID = null;
  userID = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    user: userID,
    filterType: 'dueDate',
    issueType: null,
    from: selectedStartDate,
    to: selectedEndDate,
    assignee: null,
  };

  return request(
    {
      url: FILTER_TASK_IN_PROJECT + '/' + selectedProjectID + '/tasks/filter',
      method: 'GET',
    },
    true,
    headers,
  );
}

async function filterTaskByUser(selectedProjectID, assignee) {
  let userID = null;
  userID = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    user: userID,
    filterType: 'assignee',
    issueType: null,
    from: null,
    to: null,
    assignee: assignee,
  };

  return request(
    {
      url: FILTER_TASK_IN_PROJECT + '/' + selectedProjectID + '/tasks/filter',
      method: 'GET',
    },
    true,
    headers,
  );
}

async function filterTaskByTaskTypeData(selectedProjectID, issueType) {
  let userID = null;
  userID = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    user: userID,
    filterType: 'issueType',
    issueType: issueType,
    from: null,
    to: null,
    assignee: null,
  };

  return request(
    {
      url: FILTER_TASK_IN_PROJECT + '/' + selectedProjectID + '/tasks/filter',
      method: 'GET',
    },
    true,
    headers,
  );
}

async function addSubTaskGroupTaskData(taskName, taskGroupId, parentTaskId) {
  taskInitiator = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  return request(
    {
      url: ADD_TASK_TO_GROUP_TASK_DATA + '/' + taskGroupId + '/task',
      method: 'POST',
      data: {
        taskName: taskName,
        taskGroupId: taskGroupId,
        taskInitiator: taskInitiator,
        parentTaskId: parentTaskId,
      },
    },
    true,
    headers,
  );
}

async function updateMyDetails(firstName, lastName, email, password) {
  let userID = null;
  userID = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  let data = null;
  if (!password && _.isEmpty(password)) {
    data = {
      firstName: firstName,
      lastName: lastName,
      email: email,
    };
  } else {
    data = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
    };
  }

  return request(
    {
      url: UPDATE_USER + '/' + userID,
      method: 'PUT',
      data: data,
    },
    true,
    headers,
  );
}

async function uplaodProfilePhoto(fileUri,fileType) {
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'content-type': 'multipart/form-data',
    user: userIDHeder,
  };

  const file1 = {
    uri: fileUri,
    name: 'image-pmtool-user' + new Date().getTime(),
    type: fileType,
  };
  const formData = new FormData();
  formData.append('files', file1);
  formData.append('type', 'profileImage');
  return request(
    {
      url: UPLOAD_USER_PROFILE,
      method: 'POST',
      data: formData,
    },
    true,
    headers,
  );
}

async function updateParentToChild(projectId, taskId, newParent) {
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    user: userIDHeder
  };

  return request(
    {
      url: UPDATE_PARENT_TO_CHILD + '/' + projectId + '/tasks/' + taskId + '/parent/transition',
      method: 'PUT',
      data: {
         newParent: newParent,
      },
    },
    true,
    headers,
  );
}

async function getTaskLogData(taskId) {
    let userID = null;
    userID = await AsyncStorage.getItem('userID');
  
    let headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
  
    return request(
      {
        url: GET_TASK_LOG + '/' + taskId,
        method: 'GET',
      },
      true,
      headers,
    );
  }

  async function updateTaskIssueTypeData(projectID, taskID, selectedIssueTypeId) {
    let userIDHeder = null;
    userIDHeder = await AsyncStorage.getItem('userID');
  
    let headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      user: userIDHeder,
    };
  
    return request(
      {
        url: UPDATE_PROJECT_TASK + '/' + projectID + '/tasks/' + taskID,
        method: 'PUT',
        data: {
          issueType: selectedIssueTypeId,
          taskType: 'project',
        },
      },
      true,
      headers,
    );
  }

  async function getChildTasksOfParentData(selectedProjectID, taskId) {
    let userID = null;
    userID = await AsyncStorage.getItem('userID');
  
    let headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      user: userID,
    };
  
    return request(
      {
        url: GET_CHILD_TASK_OF_PARENT + '/' + selectedProjectID + '/tasks/'+ taskId +'/children',
        method: 'GET',
      },
      true,
      headers,
    );
  };

async function getFilesInGroupTaskData(selectedGroupTaskID, selectedTaskID) {
    let userIDHeder = null;
    userIDHeder = await AsyncStorage.getItem('userID');
  
    let headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      user: userIDHeder,
    };
  
    return request(
      {
        url: GET_GROUP_TASK_DATA + '/' + selectedGroupTaskID + '/tasks/' + selectedTaskID + '/files',
        method: 'GET',
      },
      true,
      headers,
    );
};

async function deleteFileInGroupTaskData(selectedGroupTaskID, selectedTaskID,taskFileId) {
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    user: userIDHeder,
  };

  return request(
    {
      url: GET_GROUP_TASK_DATA + '/' + selectedGroupTaskID + '/tasks/' + selectedTaskID + '/upload/'+taskFileId,
      method: 'DELETE',
    },
    true,
    headers,
  );
};

async function addFileToGroupTask(file,selectedGroupTaskID, selectedTaskID) {
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    user: userIDHeder,
  };

  const file1 = {
    uri: file[0].uri,
    name: 'image-pmtool' + new Date().getTime(),
    type: file[0].type,
  };
  const formData = new FormData();
  formData.append('type', 'taskFile');
  formData.append('files', file1);

  return request(
    {
      url: GET_GROUP_TASK_DATA + '/' + selectedGroupTaskID + '/tasks/' + selectedTaskID + '/upload',
      method: 'POST',
      data: formData,
    },
    true,
    headers,
  );
};

async function getChildTasksOfTaskGroupData(selectedGroupTaskID, taskId) {
  let userID = null;
  userID = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    user: userID,
  };

  return request(
    {
      url: GET_CHILD_TASK_OF_TASK_GROUP + '/' + selectedGroupTaskID + '/tasks/'+ taskId +'/children',
      method: 'GET',
    },
    true,
    headers,
  );
};

async function updateParentToChildInGroup(selectedGroupTaskID, taskId, newParent) {
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    user: userIDHeder
  };

  return request(
    {
      url: UPDATE_PARENT_TO_CHILD_IN_GROUP + '/' + selectedGroupTaskID + '/tasks/' + taskId + '/parent/transition',
      method: 'PUT',
      data: {
         newParent: newParent,
      },
    },
    true,
    headers,
  );
};

async function getWorkloadWithCompletionUser() {
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    user: userIDHeder,
    from : 'all',
    to : 'all',
  };

  return request(
    {
      url: GET_ALL_USERS_WORKLOAD_WITH_COMPLETION + '/workload?assignee='+userIDHeder,
      method: 'GET',
    },
    true,
    headers,
  );
}

async function getMobileVersionStatusData(platform, version) {
  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  return request(
    {
      url: GET_MOBILE_VERSION_STATUS + '/' + platform + '/' + version,
      method: 'GET',
    },
    true,
    headers,
  );
}

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
  getWorkloadWithCompletionAll,
  getWorkloadWithAssignTasksCompletion,
  updateRolePeopleData,
  getGroupTaskData,
  addGroupTaskData,
  getAllTaskByGroup,
  addTaskGroupTaskData,
  deleteGroupTaskData,
  updateGroupTaskData,
  getSingleGroupTaskData,
  getTaskPeopleData,
  getAllTaskByMySelf,
  addNewMyTaskData,
  getGroupSingleTaskData,
  uploadFileData,
  getProjectFiles,
  deleteProjectFile,
  addUserToGroupTask,
  addUserToGroupTask,
  groupTaskUpdateTaskNameData,
  groupTaskUpdateTaskStatusData,
  groupTaskUpdateTaskAssigneeData,
  groupTaskUpdateDueDateData,
  groupTaskUpdateReminderDateData,
  groupTaskUpdateTaskNoteData,
  deleteSingleInGroupTaskData,
  getMySingleTaskData,
  myTaskUpdateTaskNoteData,
  myTaskUpdateTaskStatusData,
  myTaskUpdateTaskNameData,
  myTaskUpdateDueDateData,
  myTaskUpdateReminderDateData,
  getFilesInMyTaskData,
  deleteFileInMyTaskData,
  addFileToMyTaskData,
  deleteSingleInMyTaskData,
  getMyTaskSubTaskData,
  myTaskdeleteSubTask,
  myTaskAddSubTask,
  myTaskUpdateSubTask,
  getAllTaskInDefaultBoardData,
  getAllSprintInProject,
  addSprintData,
  editSprintData,
  changeSprint,
  addMainTaskToProjectData,
  addSubTaskToProjectData,
  filterTaskByDate,
  filterTaskByUser,
  filterTaskByTaskTypeData,
  addSubTaskGroupTaskData,
  updateMyDetails,
  uplaodProfilePhoto,
  updateParentToChild,
  getTaskLogData,
  updateTaskIssueTypeData,
  getChildTasksOfParentData,
  getFilesInGroupTaskData,
  deleteFileInGroupTaskData,
  addFileToGroupTask,
  getChildTasksOfTaskGroupData,
  updateParentToChildInGroup,
  getWorkloadWithCompletionUser,
  getMobileVersionStatusData
};

export default APIServices;
