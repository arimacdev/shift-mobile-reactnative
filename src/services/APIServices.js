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
  GET_MOBILE_VERSION_STATUS,
  GET_ORGANIZATION_WORK_SPACE,
  GET_USER_SKILL_MAP,
  SET_ONE_SIGNAL_USER_ID,
  SET_ONE_SIGNAL_USER_UNSUBSCRIBE,
  GET_COMMENTS,
  ADD_COMMENT,
  DELETE_COMMENT,
  UPDATE_COMMENT,
  ADD_UPDATE_COMMENT_REACTION,
  DELETE_COMMENT_REACTION,
  GET_COMMENTS_COUNT,
  UPLOAD_FILE_TO_COMMENT,
  ADD_COMMENT_MENTION_NOTIFICATION,
  UPDATE_PROJECT_WEIGHT_TYPE,
  ADD_PROJECT_FOLDER,
  ADD_FILE_TO_PROJECT_FOLDER,
  GET_ALL_MAIN_FOLDERS_FILES_IN_PROJECT,
  GET_ALL_SUB_FOLDERS_FILES_IN_PROJECT,
  UPDATE_PROJECT_FOLDER,
  DELETE_PROJECT_FOLDER,
  MOVE_FILES_BETWEEN_FOLDERS,
  BLOCK_USER,
  INITIATE_MEETING,
  PIN_PROJECT,
  ADD_DISCUSSION_POINT,
  UPDATE_MEETING,
  GET_MEETINGS,
} from '../api/API';
import AsyncStorage from '@react-native-community/async-storage';
import {SET_UPLOAD_PROGRESS} from '../redux/types';
import _, {filter} from 'lodash';

async function getAllProjectsByUserData(userID) {
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');
  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  return request(
    {
      url: baseURL + GET_ALL_PROJECTS_BY_USER + 'userId=' + userID,
      method: 'GET',
    },
    true,
    headers,
  );
}

async function getUserData(userID) {
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  return request(
    {
      url: baseURL + GET_ALL_USER + '/' + userID,
      method: 'GET',
    },
    true,
    headers,
  );
}

async function getAllTaskInProjectsData(
  userID,
  projectID,
  startIndex,
  endIndex,
  allTasks,
) {
  let listStartIndex = startIndex;
  let listEndIndex = endIndex;
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    type: 'project',
  };

  return request(
    {
      url:
        baseURL +
        GET_MY_TASKS_BY_PROJECT +
        projectID +
        '/tasks?userId=' +
        userID +
        '&startIndex=' +
        listStartIndex +
        '&endIndex=' +
        listEndIndex +
        '&allTasks=' +
        allTasks,
      method: 'GET',
    },
    true,
    headers,
  );
}

async function getMyTaskInProjectsData(
  userID,
  projectID,
  myListStartIndex,
  myListEndIndex,
) {
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    type: 'project',
  };
  return request(
    {
      url:
        baseURL +
        GET_ALL_TASKS_BY_PROJECT +
        projectID +
        '/tasks/user?userId=' +
        userID +
        '&startIndex=' +
        myListStartIndex +
        '&endIndex=' +
        myListEndIndex,
      method: 'GET',
    },
    true,
    headers,
  );
}

async function getAllUsersData() {
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  return request(
    {
      url: baseURL + GET_ALL_USERS,
      method: 'GET',
    },
    true,
    headers,
  );
}

async function addUserData(
  firstName,
  lastName,
  userName,
  email,
  password,
  confirmPassword,
) {
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  return request(
    {
      url: baseURL + CREATE_USER,
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

async function editUserData(
  firstName,
  lastName,
  userName,
  email,
  password,
  confirmPassword,
  userID,
) {
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  return request(
    {
      url: baseURL + UPDATE_USER + '/' + userID,
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

async function addprojectData(
  projectName,
  projectClient,
  IsoStartDate,
  IsoSEndDate,
  projectOwner,
  projectAlias,
  weightType,
) {
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  return request(
    {
      url: baseURL + ADD_PROJECT,
      method: 'POST',
      data: {
        projectOwner: projectOwner,
        projectName: projectName,
        clientId: projectClient,
        projectStartDate: IsoStartDate,
        projectEndDate: IsoSEndDate,
        projectAlias: projectAlias,
        weightType: weightType,
      },
    },
    true,
    headers,
  );
}

async function getProjectData(projectID) {
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    user: userIDHeder,
  };
  return request(
    {
      url: baseURL + GET_PROJECT + '/' + projectID,
      method: 'GET',
    },
    true,
    headers,
  );
}

async function updateProjectData(
  projectID,
  userID,
  projectName,
  projectClient,
  IsoStartDate,
  IsoSEndDate,
  projectStatus,
  projectAlias,
) {
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  let data = {};

  if (projectAlias !== '') {
    data = {
      modifierId: userID,
      projectName: projectName,
      clientId: projectClient,
      projectStatus: projectStatus,
      projectStartDate: IsoStartDate,
      projectEndDate: IsoSEndDate,
      projectAlias: projectAlias,
    };
  } else {
    data = {
      modifierId: userID,
      projectName: projectName,
      clientId: projectClient,
      projectStatus: projectStatus,
      projectStartDate: IsoStartDate,
      projectEndDate: IsoSEndDate,
    };
  }

  return request(
    {
      url: baseURL + UPDATE_PROJECT + '/' + projectID,
      method: 'PUT',
      data: data,
    },
    true,
    headers,
  );
}

async function deleteProjectData(projectID) {
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    user: userIDHeder,
  };

  return request(
    {
      url: baseURL + DELETE_PROJECT + '/' + projectID,
      method: 'DELETE',
    },
    true,
    headers,
  );
}

async function getProjectTaskDetails(projectID) {
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
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
        baseURL +
        GET_PROJECT_DETAILS_TASK +
        '/' +
        projectID +
        '/tasks/completion',
      method: 'GET',
    },
    true,
    headers,
  );
}

async function getProjectPeopleData(projectID, userID) {
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
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
        baseURL +
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

async function getActiveUsers() {
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  return request(
    {
      url: baseURL + GET_ALL_USERS,
      method: 'GET',
    },
    true,
    headers,
  );
}

async function addUserToProjectData(
  assignerId,
  userID,
  role,
  assigneeProjectRole,
  projectID,
) {
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  return request(
    {
      url: baseURL + ADD_PEOPLE_TO_PROJECT + '/' + projectID + '/users',
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
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
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
      url: baseURL + GET_ALL_USERS_BY_PROJECT_ID + '/' + projectID,
      method: 'GET',
    },
    true,
    headers,
  );
}

async function getProjecTaskData(projectID, selectedProjectTaskID) {
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
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
        baseURL +
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
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    user: userIDHeder,
  };

  return request(
    {
      url: baseURL + UPDATE_PROJECT_TASK + '/' + projectID + '/tasks/' + taskID,
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
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    user: userIDHeder,
  };

  return request(
    {
      url: baseURL + UPDATE_PROJECT_TASK + '/' + projectID + '/tasks/' + taskID,
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
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    user: userIDHeder,
  };

  return request(
    {
      url: baseURL + UPDATE_PROJECT_TASK + '/' + projectID + '/tasks/' + taskID,
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
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    user: userIDHeder,
  };

  return request(
    {
      url: baseURL + UPDATE_PROJECT_TASK + '/' + projectID + '/tasks/' + taskID,
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
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    user: userIDHeder,
  };

  return request(
    {
      url: baseURL + UPDATE_PROJECT_TASK + '/' + projectID + '/tasks/' + taskID,
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
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    user: userIDHeder,
  };

  return request(
    {
      url: baseURL + UPDATE_PROJECT_TASK + '/' + projectID + '/tasks/' + taskID,
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

async function addTaskToProjectData(
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
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
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
      url: baseURL + ADD_TASK_TO_PROJECT + '/' + selectedProjectID + '/tasks',
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
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'content-type': 'multipart/form-data',
    user: userIDHeder,
  };

  const file1 = {
    uri: file[0].uri,
    name: file[0].name,
    type: file[0].type,
  };
  const formData = new FormData();
  formData.append('taskType', 'project');
  formData.append('type', 'taskFile');
  formData.append('files', file1);
  return request(
    {
      url:
        baseURL +
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
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
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
      url: baseURL + DELETE_TASK + '/' + selectedProjectID + '/tasks/' + taskId,
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

async function updateSlackNotificationStatus(userID, email, value) {
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  return request(
    {
      url: baseURL + UPDATE_USER + '/' + userID + '/slack/status',
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

async function getSubTaskData(projectID, taskID, userID) {
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    type: 'project',
  };

  return request(
    {
      url:
        baseURL +
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
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
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
        baseURL +
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

async function addSubTask(userID, projectID, taskID, subTaskName) {
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  return request(
    {
      url:
        baseURL +
        ADD_SUB_TASK +
        '/' +
        projectID +
        '/tasks/' +
        taskID +
        '/subtask',
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
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
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
        baseURL +
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
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
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
        baseURL +
        GET_FILES_IN_TASK +
        '/' +
        projectID +
        '/tasks/' +
        taskID +
        '/files',
      method: 'GET',
    },
    true,
    headers,
  );
}

async function deleteFileInTaskData(projectID, taskID, taskFileId) {
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
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
        baseURL +
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
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  return request(
    {
      url: baseURL + ADD_SLACK_ID + '/' + userIDHeder + '/slack',
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
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    user: userIDHeder,
    from: 'all',
    to: 'all',
  };

  return request(
    {
      url:
        baseURL +
        GET_ALL_USERS_WORKLOAD_WITH_COMPLETION +
        '/workload?assignee=all',
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
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  return request(
    {
      url:
        baseURL +
        UPDATE_PEOPLE_PROJECT +
        '/' +
        projectID +
        '/users/' +
        assignerId,
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
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
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
      url: baseURL + GET_WORKLOAD_WITH_COMPLETION + '/' + userID + '/workload',
      method: 'GET',
    },
    true,
    headers,
  );
}

async function getGroupTaskData() {
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    user: userIDHeder,
  };
  return request(
    {
      url: baseURL + GET_GROUP_TASK_DATA,
      method: 'GET',
    },
    true,
    headers,
  );
}

async function addGroupTaskData(groupName) {
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
  let taskGroupCreator = null;
  taskGroupCreator = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  return request(
    {
      url: baseURL + ADD_GROUP_TASK_DATA,
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
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
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
        baseURL +
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

async function addTaskGroupTaskData(
  taskName,
  taskGroupId,
  taskAssignee,
  taskDueDate,
) {
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
  let taskInitiator = null;
  taskInitiator = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  return request(
    {
      url: baseURL + ADD_TASK_TO_GROUP_TASK_DATA + '/' + taskGroupId + '/task',
      method: 'POST',
      data: {
        taskName: taskName,
        taskGroupId: taskGroupId,
        taskInitiator: taskInitiator,
        parentTaskId: null,
        taskAssignee: taskAssignee == '' ? taskInitiator : taskAssignee,
        taskDueDate: taskDueDate,
      },
    },
    true,
    headers,
  );
}

async function deleteGroupTaskData(selectedTaskGroupId) {
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    user: userIDHeder,
  };

  return request(
    {
      url: baseURL + DELETE_GROUP_TASK_DATA + '/' + selectedTaskGroupId,
      method: 'DELETE',
    },
    true,
    headers,
  );
}

async function updateGroupTaskData(selectedTaskGroupId, groupName) {
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
  let user = null;
  user = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  return request(
    {
      url: baseURL + UPDATE_GROUP_TASK_DATA + '/' + selectedTaskGroupId,
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
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    user: userIDHeder,
  };
  return request(
    {
      url: baseURL + GET_SINGLE_GROUP_TASK_DATA + '/' + selectedTaskGroupId,
      method: 'GET',
    },
    true,
    headers,
  );
}

async function getTaskPeopleData(selectedTaskGroupId) {
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
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
        baseURL +
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
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    type: 'taskGroup',
  };
  return request(
    {
      url: baseURL + ADD_ALL_TASK_BY_ME_DATA + '/' + userIDHeder,
      method: 'GET',
    },
    true,
    headers,
  );
}

async function addNewMyTaskData(taskName) {
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
  let taskAssignee = null;
  taskAssignee = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  return request(
    {
      url: baseURL + ADD_TASK_TO_MY_TASK_DATA,
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
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
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
        baseURL +
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
}

async function uploadFileData(file, selectedProjectID, folderId, dispatch) {
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'content-type': 'multipart/form-data',
    user: userIDHeder,
  };

  const file1 = {
    uri: file[0].uri,
    name: file[0].name,
    type: file[0].type,
  };
  let uri = file[0].uri;
  const formData = new FormData();
  formData.append('type', 'projectFile');
  formData.append('files', file1);
  formData.append('folderId', folderId);
  return request(
    {
      url:
        baseURL +
        ADD_FILE_TO_PROJECT +
        '/' +
        selectedProjectID +
        '/files/upload',
      method: 'POST',
      data: formData,
      // onUploadProgress: progress => {
      //   const {loaded, total} = progress;
      //   const percentageProgress = Math.floor((loaded / total) * 100);
      //   dispatch({
      //     type: SET_UPLOAD_PROGRESS,
      //     payload: {uri, percentageProgress},
      //   });
      // },
    },
    true,
    headers,
  );
}

async function getProjectFiles(selectedProjectID) {
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    user: userIDHeder,
  };
  return request(
    {
      url: baseURL + GET_PROJECT_FILES + '/' + selectedProjectID + '/files',
      method: 'GET',
    },
    true,
    headers,
  );
}

async function deleteProjectFile(selectedProjectID, fileId) {
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
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
        baseURL +
        DELETE_PROJECT_FILES +
        '/' +
        selectedProjectID +
        '/files/' +
        fileId,
      method: 'DELETE',
    },
    true,
    headers,
  );
}

async function addUserToGroupTask(userID, taskGroupId) {
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
  let assignerId = null;
  assignerId = await AsyncStorage.getItem('userID');
  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  return request(
    {
      url: baseURL + ADD_PEOPLE_TO_TASK_GROUP,
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
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
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
        baseURL +
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
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
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
        baseURL +
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
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
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
        baseURL +
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
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
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
        baseURL +
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
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
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
        baseURL +
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
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
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
        baseURL +
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
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
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
        baseURL +
        DELETE_TASK_IN_GROUP +
        '/' +
        selectedTaskGroupId +
        '/tasks/' +
        taskID,
      method: 'DELETE',
    },
    true,
    headers,
  );
}

async function getMySingleTaskData(selectedTaskID) {
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    user: userIDHeder,
  };
  return request(
    {
      url: baseURL + GET_MY_SINGLE_TASK_DATA + '/' + selectedTaskID,
      method: 'GET',
    },
    true,
    headers,
  );
}

async function myTaskUpdateTaskNoteData(selectedTaskID, note) {
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    user: userIDHeder,
  };

  return request(
    {
      url: baseURL + UPDATE_MY_SINGLE_TASK_DATA + '/' + selectedTaskID,
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
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    user: userIDHeder,
  };

  return request(
    {
      url: baseURL + UPDATE_MY_SINGLE_TASK_DATA + '/' + selectedTaskID,
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
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    user: userIDHeder,
  };

  return request(
    {
      url: baseURL + UPDATE_MY_SINGLE_TASK_DATA + '/' + selectedTaskID,
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
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    user: userIDHeder,
  };

  return request(
    {
      url: baseURL + UPDATE_MY_SINGLE_TASK_DATA + '/' + selectedTaskID,
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
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    user: userIDHeder,
  };

  return request(
    {
      url: baseURL + UPDATE_MY_SINGLE_TASK_DATA + '/' + selectedTaskID,
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
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    user: userIDHeder,
  };

  return request(
    {
      url: baseURL + GET_ALL_PERSONAL_TASK_FILES + '/' + taskID + '/files',
      method: 'GET',
    },
    true,
    headers,
  );
}

async function deleteFileInMyTaskData(taskID, taskFileId) {
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
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
        baseURL +
        DELETE_PERSONAL_TASK_FILE +
        '/' +
        taskID +
        '/files/' +
        taskFileId,
      method: 'DELETE',
    },
    true,
    headers,
  );
}

async function addFileToMyTaskData(file, taskId) {
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'content-type': 'multipart/form-data',
    user: userIDHeder,
  };

  const file1 = {
    uri: file[0].uri,
    name: file[0].name,
    type: file[0].type,
  };
  const formData = new FormData();
  formData.append('type', 'taskFile');
  formData.append('files', file1);
  return request(
    {
      url: baseURL + ADD_FILE_TO_MY_TASK + '/' + taskId + '/upload',
      method: 'POST',
      data: formData,
    },
    true,
    headers,
  );
}

async function deleteSingleInMyTaskData(taskID) {
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    user: userIDHeder,
  };

  return request(
    {
      url: baseURL + DELETE_MY_TASK + '/' + taskID,
      method: 'DELETE',
    },
    true,
    headers,
  );
}

async function getMyTaskSubTaskData(selectedTaskID) {
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  return request(
    {
      url:
        baseURL +
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
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
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
        baseURL +
        DELETE_SUB_TASKS_IN_MY_TASK +
        '/' +
        taskID +
        '/subtask/' +
        subtaskId,
      method: 'DELETE',
    },
    true,
    headers,
  );
}

async function myTaskAddSubTask(userID, taskID, subTaskName) {
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  return request(
    {
      url: baseURL + MY_TASK_ADD_SUB_TASK + '/' + taskID + '/subtask',
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
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
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
        baseURL +
        MY_TASK_UPDATE_SUB_TASK +
        '/' +
        taskID +
        '/subtask/' +
        subTaskID,
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
//oooooo
async function getAllTaskInDefaultBoardData(
  projectID,
  startIndex,
  endIndex,
  allTasks,
) {
  let listStartIndex = startIndex;
  let listEndIndex = endIndex;
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
  let userID = null;
  userID = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    type: 'project',
  };

  return request(
    {
      url:
        baseURL +
        GET_MY_TASKS_BY_PROJECT +
        projectID +
        '/tasks?userId=' +
        userID +
        '&startIndex=' +
        listStartIndex +
        '&endIndex=' +
        listEndIndex +
        '&allTasks=' +
        allTasks,
      method: 'GET',
    },
    true,
    headers,
  );
}

async function getAllSprintInProject(projectID) {
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
  let userID = null;
  userID = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    userId: userID,
  };

  return request(
    {
      url: baseURL + GET_SPRINTS_BY_PROJECT + '/' + projectID,
      method: 'GET',
    },
    true,
    headers,
  );
}

async function addSprintData(projectID, sprintName, sprintDescription) {
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
  let userID = null;
  userID = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  return request(
    {
      url: baseURL + ADD_EDIT_SPRINT_BY_PROJECT,
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
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
  let userID = null;
  userID = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    userId: userID,
  };

  return request(
    {
      url:
        baseURL + ADD_EDIT_SPRINT_BY_PROJECT + '/' + projectID + '/' + sprintId,
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
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
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
        baseURL +
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

async function addMainTaskToProjectData(
  taskName,
  selectedProjectID,
  taskAssignee,
  taskDueDate,
) {
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
  let userID = null;
  userID = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  return request(
    {
      url:
        baseURL + ADD_MAIN_TASK_TO_PROJECT + '/' + selectedProjectID + '/tasks',
      method: 'POST',
      data: {
        taskName: taskName,
        projectId: selectedProjectID,
        taskInitiator: userID,
        taskAssignee: taskAssignee == '' ? userID : taskAssignee,
        taskDueDate: taskDueDate,
        //taskType: "project",
        issueType: 'general',
      },
    },
    true,
    headers,
  );
}

async function addSubTaskToProjectData(
  taskName,
  selectedProjectID,
  taskID,
  taskAssignee,
  taskDueDate,
) {
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
  let userID = null;
  userID = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  return request(
    {
      url:
        baseURL + ADD_MAIN_TASK_TO_PROJECT + '/' + selectedProjectID + '/tasks',
      method: 'POST',
      data: {
        taskName: taskName,
        projectId: selectedProjectID,
        taskInitiator: userID,
        taskAssignee: taskAssignee == '' ? userID : taskAssignee,
        taskDueDate: taskDueDate,
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
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
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
      url:
        baseURL +
        FILTER_TASK_IN_PROJECT +
        '/' +
        selectedProjectID +
        '/tasks/filter',
      method: 'GET',
    },
    true,
    headers,
  );
}

async function filterTaskByUser(selectedProjectID, assignee) {
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
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
      url:
        baseURL +
        FILTER_TASK_IN_PROJECT +
        '/' +
        selectedProjectID +
        '/tasks/filter',
      method: 'GET',
    },
    true,
    headers,
  );
}

async function filterTaskByTaskTypeData(selectedProjectID, issueType) {
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
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
      url:
        baseURL +
        FILTER_TASK_IN_PROJECT +
        '/' +
        selectedProjectID +
        '/tasks/filter',
      method: 'GET',
    },
    true,
    headers,
  );
}

async function addSubTaskGroupTaskData(
  taskName,
  taskGroupId,
  parentTaskId,
  taskAssignee,
  taskDueDate,
) {
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
  let taskInitiator = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  return request(
    {
      url: baseURL + ADD_TASK_TO_GROUP_TASK_DATA + '/' + taskGroupId + '/task',
      method: 'POST',
      data: {
        taskName: taskName,
        taskGroupId: taskGroupId,
        taskInitiator: taskInitiator,
        parentTaskId: parentTaskId,
        taskAssignee: taskAssignee == '' ? taskInitiator : taskAssignee,
        taskDueDate: taskDueDate,
      },
    },
    true,
    headers,
  );
}

async function updateMyDetails(firstName, lastName, email, password) {
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
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
      url: baseURL + UPDATE_USER + '/' + userID,
      method: 'PUT',
      data: data,
    },
    true,
    headers,
  );
}

async function uplaodProfilePhoto(fileUri, filename, fileType) {
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'content-type': 'multipart/form-data',
    user: userIDHeder,
  };

  const file1 = {
    uri: fileUri,
    name: filename,
    type: fileType,
  };
  const formData = new FormData();
  formData.append('files', file1);
  formData.append('type', 'profileImage');
  return request(
    {
      url: baseURL + UPLOAD_USER_PROFILE,
      method: 'POST',
      data: formData,
    },
    true,
    headers,
  );
}

async function updateParentToChild(projectId, taskId, newParent) {
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
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
        baseURL +
        UPDATE_PARENT_TO_CHILD +
        '/' +
        projectId +
        '/tasks/' +
        taskId +
        '/parent/transition',
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
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    user: userIDHeder,
  };

  return request(
    {
      url: baseURL + GET_TASK_LOG + '/' + taskId,
      method: 'GET',
    },
    true,
    headers,
  );
}

async function updateTaskIssueTypeData(projectID, taskID, selectedIssueTypeId) {
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    user: userIDHeder,
  };

  return request(
    {
      url: baseURL + UPDATE_PROJECT_TASK + '/' + projectID + '/tasks/' + taskID,
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
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
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
        baseURL +
        GET_CHILD_TASK_OF_PARENT +
        '/' +
        selectedProjectID +
        '/tasks/' +
        taskId +
        '/children',
      method: 'GET',
    },
    true,
    headers,
  );
}

async function getFilesInGroupTaskData(selectedGroupTaskID, selectedTaskID) {
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
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
        baseURL +
        GET_GROUP_TASK_DATA +
        '/' +
        selectedGroupTaskID +
        '/tasks/' +
        selectedTaskID +
        '/files',
      method: 'GET',
    },
    true,
    headers,
  );
}

async function deleteFileInGroupTaskData(
  selectedGroupTaskID,
  selectedTaskID,
  taskFileId,
) {
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
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
        baseURL +
        GET_GROUP_TASK_DATA +
        '/' +
        selectedGroupTaskID +
        '/tasks/' +
        selectedTaskID +
        '/upload/' +
        taskFileId,
      method: 'DELETE',
    },
    true,
    headers,
  );
}

async function addFileToGroupTask(file, selectedGroupTaskID, selectedTaskID) {
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    user: userIDHeder,
  };

  const file1 = {
    uri: file[0].uri,
    name: file[0].name,
    type: file[0].type,
  };
  const formData = new FormData();
  formData.append('type', 'taskFile');
  formData.append('files', file1);

  return request(
    {
      url:
        baseURL +
        GET_GROUP_TASK_DATA +
        '/' +
        selectedGroupTaskID +
        '/tasks/' +
        selectedTaskID +
        '/upload',
      method: 'POST',
      data: formData,
    },
    true,
    headers,
  );
}

async function getChildTasksOfTaskGroupData(selectedGroupTaskID, taskId) {
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
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
        baseURL +
        GET_CHILD_TASK_OF_TASK_GROUP +
        '/' +
        selectedGroupTaskID +
        '/tasks/' +
        taskId +
        '/children',
      method: 'GET',
    },
    true,
    headers,
  );
}

async function updateParentToChildInGroup(
  selectedGroupTaskID,
  taskId,
  newParent,
) {
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
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
        baseURL +
        UPDATE_PARENT_TO_CHILD_IN_GROUP +
        '/' +
        selectedGroupTaskID +
        '/tasks/' +
        taskId +
        '/parent/transition',
      method: 'PUT',
      data: {
        newParent: newParent,
      },
    },
    true,
    headers,
  );
}

async function getWorkloadWithCompletionUser() {
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    user: userIDHeder,
    from: 'all',
    to: 'all',
  };

  return request(
    {
      url:
        baseURL +
        GET_ALL_USERS_WORKLOAD_WITH_COMPLETION +
        '/workload?assignee=' +
        userIDHeder,
      method: 'GET',
    },
    true,
    headers,
  );
}

async function getMobileVersionStatusData(platform, version) {
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  return request(
    {
      url: baseURL + GET_MOBILE_VERSION_STATUS + '/' + platform + '/' + version,
      method: 'GET',
    },
    false,
    headers,
  );
}

async function getOrganizationData(workSpace, version) {
  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  return request(
    {
      url:
        GET_ORGANIZATION_WORK_SPACE +
        'workspace=' +
        workSpace +
        '&current_version=' +
        version,
      method: 'GET',
    },
    false,
    headers,
  );
}

async function getUserSkillMapData(userID) {
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    userID: userIDHeder,
  };

  return request(
    {
      url: baseURL + GET_USER_SKILL_MAP + userID + '/skillmap/profile',
      method: 'GET',
    },
    true,
    headers,
  );
}

async function setOneSignalUserID(oneSignalUserID) {
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    userId: userIDHeder,
  };

  return request(
    {
      url: baseURL + SET_ONE_SIGNAL_USER_ID,
      method: 'POST',
      data: {
        subscriberId: userIDHeder,
        subscriptionId: oneSignalUserID,
        provider: 'OneSignal',
        platform: 'Mobile',
        notificationStatus: true,
      },
    },
    true,
    headers,
  );
}

async function setOneSignalNotificationStatusData(
  oneSignalUserID,
  notificationStatus,
) {
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    userId: userIDHeder,
  };

  return request(
    {
      url: baseURL + SET_ONE_SIGNAL_USER_UNSUBSCRIBE,
      method: 'PUT',
      data: {
        subscriberId: userIDHeder,
        subscriptionId: oneSignalUserID,
        provider: 'OneSignal',
        platform: 'Mobile',
        notificationStatus: notificationStatus,
      },
    },
    true,
    headers,
  );
}
async function getCommentsData(taskId, startIndex, endIndex, allComments) {
  let commentstartIndex = startIndex;
  let commentendIndex = endIndex;
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    userID: userIDHeder,
  };

  return request(
    {
      url:
        baseURL +
        GET_COMMENTS +
        '/' +
        taskId +
        '/comment?startIndex=' +
        commentstartIndex +
        '&endIndex=' +
        commentendIndex +
        '&allComments=' +
        allComments,
      method: 'GET',
    },
    true,
    headers,
  );
}

async function addCommentData(taskId, content) {
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    userId: userIDHeder,
  };

  return request(
    {
      url: baseURL + ADD_COMMENT,
      method: 'POST',
      data: {
        entityId: taskId,
        content: content,
        commenter: userIDHeder,
        parentId: '',
      },
    },
    true,
    headers,
  );
}

async function updateCommentData(commentId, content) {
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    userId: userIDHeder,
  };

  return request(
    {
      url: baseURL + UPDATE_COMMENT + '/' + commentId,
      method: 'PUT',
      data: {
        content: content,
        commenter: userIDHeder,
      },
    },
    true,
    headers,
  );
}

async function deleteCommentData(commentId) {
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    userId: userIDHeder,
  };

  return request(
    {
      url: baseURL + DELETE_COMMENT + '/' + commentId,
      method: 'DELETE',
    },
    true,
    headers,
  );
}

async function addUpdateCommentReactionData(commentId, reactionId) {
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    userId: userIDHeder,
  };

  return request(
    {
      url:
        baseURL + ADD_UPDATE_COMMENT_REACTION + '/' + commentId + '/reaction',
      method: 'POST',
      data: {
        reactionId: reactionId,
      },
    },
    true,
    headers,
  );
}

async function deleteCommentReactionData(commentId, reactionId) {
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    userId: userIDHeder,
  };

  return request(
    {
      url: baseURL + DELETE_COMMENT_REACTION + '/' + commentId + '/reaction',
      method: 'DELETE',
      data: {
        reactionId: reactionId,
      },
    },
    true,
    headers,
  );
}

async function getCommentsCountData(taskId) {
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    userID: userIDHeder,
  };

  return request(
    {
      url: baseURL + GET_COMMENTS_COUNT + '/' + taskId + '/comment/count',
      method: 'GET',
    },
    true,
    headers,
  );
}

async function uploadFileToComment(file, taskId) {
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    user: userIDHeder,
  };

  const fileData = {
    uri: file[0].uri,
    name: file[0].name,
    type: file[0].type,
  };
  const formData = new FormData();
  formData.append('type', 'comment');
  formData.append('files', fileData);

  return request(
    {
      url: baseURL + UPLOAD_FILE_TO_COMMENT + '/' + taskId + '/comment/file',
      method: 'POST',
      data: formData,
    },
    true,
    headers,
  );
}

async function addCommentMentionNotificationData(
  commentId,
  taskId,
  recipients,
) {
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    userId: userIDHeder,
  };

  return request(
    {
      url: baseURL + ADD_COMMENT_MENTION_NOTIFICATION,
      method: 'POST',
      data: {
        commentId: commentId,
        entityId: taskId,
        recipients: recipients,
      },
    },
    true,
    headers,
  );
}

async function updateProjectWeightTypeData(projectId, weightType) {
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    userId: userIDHeder,
  };

  return request(
    {
      url: baseURL + UPDATE_PROJECT_WEIGHT_TYPE + '/' + projectId + '/weight',
      method: 'PUT',
      data: {
        weightType: weightType,
      },
    },
    true,
    headers,
  );
}

async function updateTaskWeightData(
  projectID,
  taskID,
  estimatedWeight,
  actualWeight,
) {
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    user: userIDHeder,
  };

  return request(
    {
      url: baseURL + UPDATE_PROJECT_TASK + '/' + projectID + '/tasks/' + taskID,
      method: 'PUT',
      data: {
        estimatedWeight: estimatedWeight,
        actualWeight: actualWeight,
        taskType: 'project',
      },
    },
    true,
    headers,
  );
}

async function getAllMainFoldersFilesData(projectID) {
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
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
        baseURL +
        GET_ALL_MAIN_FOLDERS_FILES_IN_PROJECT +
        '/' +
        projectID +
        '/folder',
      method: 'GET',
    },
    true,
    headers,
  );
}

async function getAllSubFoldersFilesData(projectID, folderId) {
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
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
        baseURL +
        GET_ALL_SUB_FOLDERS_FILES_IN_PROJECT +
        '/' +
        projectID +
        '/folder/' +
        folderId,
      method: 'GET',
    },
    true,
    headers,
  );
}

async function addProjectFolderData(projectID, folderName, folderId) {
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    user: userIDHeder,
  };

  return request(
    {
      url: baseURL + ADD_PROJECT_FOLDER + '/' + projectID + '/' + 'folder',
      method: 'POST',
      data: {
        folderName: folderName,
        parentFolder: folderId,
      },
    },
    true,
    headers,
  );
}

async function addFileToFolderData(projectID, folderId) {
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    userId: userIDHeder,
  };

  return request(
    {
      url: baseURL + ADD_FILE_TO_PROJECT_FOLDER + '/' + projectID,
      method: 'POST',
      data: {
        folderId: folderId,
      },
    },
    true,
    headers,
  );
}

async function updateFolderData(projectID, folderId, folderName) {
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
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
        baseURL +
        UPDATE_PROJECT_FOLDER +
        '/' +
        projectID +
        '/folder/' +
        folderId,
      method: 'PUT',
      data: {
        folderName: folderName,
      },
    },
    true,
    headers,
  );
}

async function deleteFolderData(projectID, folderId) {
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
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
        baseURL +
        DELETE_PROJECT_FOLDER +
        '/' +
        projectID +
        '/folder/' +
        folderId,
      method: 'DELETE',
    },
    true,
    headers,
  );
}

async function moveFilesBetweenFoldersData(
  projectID,
  fileId,
  previousParentFolder,
  newParentFolder,
) {
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
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
        baseURL + MOVE_FILES_BETWEEN_FOLDERS + '/' + projectID + '/folder/copy',
      method: 'POST',
      data: {
        fileId: fileId,
        previousParentFolder: previousParentFolder,
        newParentFolder: newParentFolder,
      },
    },
    true,
    headers,
  );
}

async function blockUnblockUserData(projectID, blockedStatus, blockedUserId) {
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
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
        baseURL +
        BLOCK_USER +
        '/' +
        projectID +
        '/users/' +
        userIDHeder +
        '/block',
      method: 'POST',
      data: {
        blockedStatus: blockedStatus,
        blockedUserId: blockedUserId,
        executorId: userIDHeder,
      },
    },
    true,
    headers,
  );
}

async function pinProjectData(projectID, isPin) {
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    user: userIDHeder,
  };

  return request(
    {
      url: baseURL + PIN_PROJECT,
      method: 'POST',
      data: {
        user: userIDHeder,
        project: projectID,
        isPin: isPin,
      },
    },
    true,
    headers,
  );
}

async function initiatMeetingData(
  projectId,
  meetingTopic,
  meetingVenue,
  meetingExpectedTime,
  meetingActualTime,
  expectedDuration,
) {
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    user: userIDHeder,
  };

  return request(
    {
      url: baseURL + INITIATE_MEETING,
      method: 'POST',
      data: {
        projectId: projectId,
        meetingTopic: meetingTopic,
        meetingVenue: meetingVenue,
        meetingExpectedTime: meetingExpectedTime,
        meetingActualTime: meetingActualTime,
        expectedDuration: expectedDuration,
        meetingAttended: [],
        meetingChaired: [],
        meetingAbsent: [],
        meetingCopiesTo: [],
        meetingPrepared: [],
      },
    },
    true,
    headers,
  );
}

async function addDiscussionPointData(
  meetingId,
  projectId,
  description,
  discussionPoint,
  remarks,
  actionBy,
  actionByGuest,
  dueDate,
) {
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    user: userIDHeder,
  };

  return request(
    {
      url: baseURL + ADD_DISCUSSION_POINT,
      method: 'POST',
      data: {
        meetingId: meetingId,
        projectId: projectId,
        description: description,
        discussionPoint: discussionPoint,
        remarks: remarks,
        actionBy: actionBy,
        actionByGuest: actionByGuest,
        addedBy: userIDHeder,
        dueDate: dueDate,
      },
    },
    true,
    headers,
  );
}

async function updateMeetingData(
  meetingDetails,
  actualDuration,
  meetingChaired,
  meetingAttended,
  meetingAbsent,
  meetingCopiesTo,
  meetingPrepared,
  isUpdated,
) {
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
  let userIDHeder = null;
  userIDHeder = await AsyncStorage.getItem('userID');

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    user: userIDHeder,
  };

  return request(
    {
      url: baseURL + UPDATE_MEETING + '/' + meetingDetails.meetingId,
      method: 'PUT',
      data: {
        projectId: meetingDetails.projectID,
        meetingTopic: meetingDetails.meetingTopic,
        meetingVenue: meetingDetails.meetingVenue,
        meetingExpectedTime: meetingDetails.meetingExpectedTime,
        meetingActualTime: meetingDetails.meetingActualTime,
        expectedDuration: meetingDetails.expectedDuration,
        actualDuration: actualDuration,
        meetingChaired: {isUpdated: isUpdated, attendees: meetingChaired},
        meetingAttended: {isUpdated: isUpdated, attendees: meetingAttended},
        meetingAbsent: {isUpdated: isUpdated, attendees: meetingAbsent},
        meetingCopiesTo: {isUpdated: isUpdated, attendees: meetingCopiesTo},
        meetingPrepared: {isUpdated: isUpdated, attendees: meetingPrepared},
      },
    },
    true,
    headers,
  );
}

async function getMeetingsData(
  projectId,
  startIndex,
  endIndex,
  filter,
  filterKey,
  filterDate,
) {
  let baseURL = null;
  baseURL = await AsyncStorage.getItem('baseURL');
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
        baseURL +
        GET_MEETINGS +
        'projectId=' +
        projectId +
        '&startIndex=' +
        startIndex +
        '&endIndex=' +
        endIndex +
        '&filter=' +
        filter +
        '&filterKey=' +
        filterKey +
        '&filterDate=' +
        filterDate,
      method: 'GET',
    },
    true,
    headers,
  );
}
//"{{pm-service}}/meeting?projectId={{projectId}}&startIndex=0&endIndex=10&filter=true&filterKey=sc&filterDate=2020-10-17"

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
  getMobileVersionStatusData,
  getOrganizationData,
  getUserSkillMapData,
  setOneSignalUserID,
  setOneSignalNotificationStatusData,
  getCommentsData,
  addCommentData,
  updateCommentData,
  deleteCommentData,
  addUpdateCommentReactionData,
  deleteCommentReactionData,
  getCommentsCountData,
  uploadFileToComment,
  addCommentMentionNotificationData,
  updateProjectWeightTypeData,
  updateTaskWeightData,
  getAllMainFoldersFilesData,
  getAllSubFoldersFilesData,
  addProjectFolderData,
  addFileToFolderData,
  updateFolderData,
  deleteFolderData,
  moveFilesBetweenFoldersData,
  blockUnblockUserData,
  pinProjectData,
  initiatMeetingData,
  addDiscussionPointData,
  updateMeetingData,
  getMeetingsData
};

export default APIServices;
