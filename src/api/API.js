export const PROTOCOL = 'https://';
export const HOST = 'pmtool.devops.arimac.xyz/api/pm-service/';

export const GET_ALL_PROJECTS_BY_USER = `${PROTOCOL}${HOST}projects?`;
export const GET_ALL_TASKS_BY_PROJECT = `${PROTOCOL}${HOST}projects/`;
export const GET_MY_TASKS_BY_PROJECT = `${PROTOCOL}${HOST}projects/`;
export const GET_ALL_USERS = `${PROTOCOL}${HOST}users`;
export const GET_ALL_USER = `${PROTOCOL}${HOST}users`;
export const CREATE_USER = `${PROTOCOL}${HOST}users`;
export const UPDATE_USER = `${PROTOCOL}${HOST}users`;
export const ADD_PROJECT = `${PROTOCOL}${HOST}projects`;
export const GET_PROJECT = `${PROTOCOL}${HOST}projects`;
export const UPDATE_PROJECT = `${PROTOCOL}${HOST}projects`;
export const DELETE_PROJECT = `${PROTOCOL}${HOST}projects`;
export const GET_PROJECT_DETAILS_TASK = `${PROTOCOL}${HOST}projects`;
export const GET_PROJECT_PEOPLE = `${PROTOCOL}${HOST}projects`;
export const ADD_PEOPLE_TO_PROJECT = `${PROTOCOL}${HOST}projects`;
export const ADD_TASK_TO_PROJECT = `${PROTOCOL}${HOST}projects`;
export const ADD_FILE_TO_TASK = `${PROTOCOL}${HOST}projects`;

export const GET_ALL_USERS_BY_PROJECT_ID = `${PROTOCOL}${HOST}users/project`;
export const GET_TASK_IN_PROJECT = `${PROTOCOL}${HOST}projects`;
export const UPDATE_PROJECT_TASK = `${PROTOCOL}${HOST}projects`;
export const DELETE_TASK = `${PROTOCOL}${HOST}projects`;
export const GET_ALL_SUB_TASKS = `${PROTOCOL}${HOST}projects`;
export const DELETE_SUB_TASK = `${PROTOCOL}${HOST}projects`;
export const ADD_SUB_TASK = `${PROTOCOL}${HOST}projects`;
export const UPDATE_SUB_TASK = `${PROTOCOL}${HOST}projects`;
export const GET_FILES_IN_TASK = `${PROTOCOL}${HOST}projects`;
export const DELETE_FILE_IN_TASK = `${PROTOCOL}${HOST}projects`;
export const UPDATE_PEOPLE_PROJECT = `${PROTOCOL}${HOST}projects`;


export const ADD_SLACK_ID = `${PROTOCOL}${HOST}users`;

export const GET_WORKLOAD_WITH_COMPLETION = `${PROTOCOL}${HOST}projects/tasks/users`

export const GET_GROUP_TASK_DATA = `${PROTOCOL}${HOST}taskgroup`;
export const ADD_GROUP_TASK_DATA = `${PROTOCOL}${HOST}taskgroup`;
export const ADD_ALL_TASK_BY_GROUP_DATA = `${PROTOCOL}${HOST}projects`;
export const ADD_TASK_TO_GROUP_TASK_DATA = `${PROTOCOL}${HOST}taskgroup`;
export const DELETE_GROUP_TASK_DATA = `${PROTOCOL}${HOST}taskgroup`;
export const UPDATE_GROUP_TASK_DATA = `${PROTOCOL}${HOST}taskgroup`;
export const GET_SINGLE_GROUP_TASK_DATA = `${PROTOCOL}${HOST}taskgroup`;
export const GET_PEOPLE_IN_TASK = `${PROTOCOL}${HOST}taskgroup`; 
export const ADD_ALL_TASK_BY_ME_DATA = `${PROTOCOL}${HOST}non-project/tasks/personal/user`;
export const ADD_TASK_TO_MY_TASK_DATA = `${PROTOCOL}${HOST}non-project/tasks/personal`;

export const ADD_FILE_TO_PROJECT = `${PROTOCOL}${HOST}projects`;
export const GET_PROJECT_FILES = `${PROTOCOL}${HOST}projects`;
export const DELETE_PROJECT_FILES = `${PROTOCOL}${HOST}projects`;

export const ADD_PEOPLE_TO_TASK_GROUP = `${PROTOCOL}${HOST}taskgroup/add`;
export const GET_GROUP_SINGLE_TASK_DATA  = `${PROTOCOL}${HOST}projects`;
export const UPDATE_GROUP_TASK_SINGLE_TASK = `${PROTOCOL}${HOST}projects`;
export const GET_MY_SINGLE_TASK_DATA  = `${PROTOCOL}${HOST}non-project/tasks/personal`;
export const UPDATE_MY_SINGLE_TASK_DATA  = `${PROTOCOL}${HOST}non-project/tasks/personal`;
export const GET_ALL_PERSONAL_TASK_FILES  = `${PROTOCOL}${HOST}non-project/tasks/personal`;
export const DELETE_PERSONAL_TASK_FILE  = `${PROTOCOL}${HOST}non-project/tasks/personal`;
export const ADD_FILE_TO_MY_TASK = `${PROTOCOL}${HOST}personal/tasks`;
export const DELETE_MY_TASK = `${PROTOCOL}${HOST}non-project/tasks/personal`;
export const GET_ALL_SUB_TASKS_IN_MY_TASK = `${PROTOCOL}${HOST}non-project/tasks/personal`
export const DELETE_SUB_TASKS_IN_MY_TASK = `${PROTOCOL}${HOST}non-project/tasks/personal`
export const MY_TASK_ADD_SUB_TASK = `${PROTOCOL}${HOST}non-project/tasks/personal`;
export const MY_TASK_UPDATE_SUB_TASK = `${PROTOCOL}${HOST}non-project/tasks/personal`;
export const GET_SPRINTS_BY_PROJECT = `${PROTOCOL}${HOST}sprints`;
export const ADD_EDIT_SPRINT_BY_PROJECT = `${PROTOCOL}${HOST}sprints`;
export const UPDATE_SPRINT = `${PROTOCOL}${HOST}projects`;

export const ADD_MAIN_TASK_TO_PROJECT = `${PROTOCOL}${HOST}projects`;
export const ADD_SUB_TASK_TO_PROJECT = `${PROTOCOL}${HOST}projects`;
export const FILTER_TASK_IN_PROJECT = `${PROTOCOL}${HOST}projects`;

export const VIEW_ALL_TASK_BY_GROUP_DATA = `${PROTOCOL}${HOST}taskgroup`;


















