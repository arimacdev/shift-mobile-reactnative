export const PROTOCOL = 'https://';

// export const WORKSPACE = `${PROTOCOL}project.arimaclanka.com/api/bff/`;
export const WORKSPACE = `${PROTOCOL}pmtool.devops.arimac.xyz/api/bff/`;

export const GET_ORGANIZATION_WORK_SPACE = `${WORKSPACE}organization?`;

export const CHAT_SERVICE = `chat`;

export const GET_ALL_PROJECTS_BY_USER = `projects?`;
export const GET_ALL_TASKS_BY_PROJECT = `projects/`;
export const GET_MY_TASKS_BY_PROJECT = `projects/`;
export const GET_ALL_USERS = `users`;
export const GET_ALL_USER = `users`;
export const CREATE_USER = `users`;
export const UPDATE_USER = `users`;
export const ADD_PROJECT = `projects`;
export const GET_PROJECT = `projects`;
export const UPDATE_PROJECT = `projects`;
export const DELETE_PROJECT = `projects`;
export const GET_PROJECT_DETAILS_TASK = `projects`;
export const GET_PROJECT_PEOPLE = `projects`;
export const ADD_PEOPLE_TO_PROJECT = `projects`;
export const ADD_TASK_TO_PROJECT = `projects`;
export const ADD_FILE_TO_TASK = `projects`;

export const GET_ALL_USERS_BY_PROJECT_ID = `users/project`;
export const GET_TASK_IN_PROJECT = `projects`;
export const UPDATE_PROJECT_TASK = `projects`;
export const DELETE_TASK = `projects`;
export const GET_ALL_SUB_TASKS = `projects`;
export const DELETE_SUB_TASK = `projects`;
export const ADD_SUB_TASK = `projects`;
export const UPDATE_SUB_TASK = `projects`;
export const GET_FILES_IN_TASK = `projects`;
export const DELETE_FILE_IN_TASK = `projects`;
export const UPDATE_PEOPLE_PROJECT = `projects`;

export const ADD_SLACK_ID = `users`;

export const GET_WORKLOAD_WITH_COMPLETION = `projects/tasks/users`;

export const GET_GROUP_TASK_DATA = `taskgroup`;
export const ADD_GROUP_TASK_DATA = `taskgroup`;
export const ADD_ALL_TASK_BY_GROUP_DATA = `projects`;
export const ADD_TASK_TO_GROUP_TASK_DATA = `taskgroup`;
export const DELETE_GROUP_TASK_DATA = `taskgroup`;
export const UPDATE_GROUP_TASK_DATA = `taskgroup`;
export const GET_SINGLE_GROUP_TASK_DATA = `taskgroup`;
export const GET_PEOPLE_IN_TASK = `taskgroup`;
export const ADD_ALL_TASK_BY_ME_DATA = `non-project/tasks/personal/user`;
export const ADD_TASK_TO_MY_TASK_DATA = `non-project/tasks/personal`;

export const ADD_FILE_TO_PROJECT = `projects`;
export const GET_PROJECT_FILES = `projects`;
export const DELETE_PROJECT_FILES = `projects`;

export const ADD_PEOPLE_TO_TASK_GROUP = `taskgroup/add`;
export const GET_GROUP_SINGLE_TASK_DATA = `taskgroup`;
export const UPDATE_GROUP_TASK_SINGLE_TASK = `taskgroup`;
export const GET_MY_SINGLE_TASK_DATA = `non-project/tasks/personal`;
export const UPDATE_MY_SINGLE_TASK_DATA = `non-project/tasks/personal`;
export const GET_ALL_PERSONAL_TASK_FILES = `non-project/tasks/personal`;
export const DELETE_PERSONAL_TASK_FILE = `non-project/tasks/personal`;
export const ADD_FILE_TO_MY_TASK = `personal/tasks`;
export const DELETE_MY_TASK = `non-project/tasks/personal`;
export const GET_ALL_SUB_TASKS_IN_MY_TASK = `non-project/tasks/personal`;
export const DELETE_SUB_TASKS_IN_MY_TASK = `non-project/tasks/personal`;
export const MY_TASK_ADD_SUB_TASK = `non-project/tasks/personal`;
export const MY_TASK_UPDATE_SUB_TASK = `non-project/tasks/personal`;
export const GET_SPRINTS_BY_PROJECT = `sprints`;
export const ADD_EDIT_SPRINT_BY_PROJECT = `sprints`;
export const UPDATE_SPRINT = `projects`;

export const ADD_MAIN_TASK_TO_PROJECT = `projects`;
export const ADD_SUB_TASK_TO_PROJECT = `projects`;
export const FILTER_TASK_IN_PROJECT = `projects`;

export const VIEW_ALL_TASK_BY_GROUP_DATA = `taskgroup`;
export const UPLOAD_USER_PROFILE = `user/profile/upload`;

export const UPDATE_PARENT_TO_CHILD = `projects`;
export const GET_TASK_LOG = `log`;

export const GET_CHILD_TASK_OF_PARENT = `projects`;
export const DELETE_TASK_IN_GROUP = `taskgroup`;

export const GET_CHILD_TASK_OF_TASK_GROUP = `taskgroup`;
export const UPDATE_PARENT_TO_CHILD_IN_GROUP = `taskgroup`;
export const GET_ALL_USERS_WORKLOAD_WITH_COMPLETION = `projects/tasks/users`;

export const GET_MOBILE_VERSION_STATUS = `health`;
export const GET_USER_SKILL_MAP = `category/user/`;

export const SET_ONE_SIGNAL_USER_ID = `notification/register`;
export const SET_ONE_SIGNAL_USER_UNSUBSCRIBE = `notification/status`;

export const GET_COMMENTS = `task`;
export const ADD_COMMENT = `task/comment`;
export const UPDATE_COMMENT = `task/comment`;
export const DELETE_COMMENT = `task/comment`;
export const ADD_UPDATE_COMMENT_REACTION = `task/comment`;
export const DELETE_COMMENT_REACTION = `task/comment`;
export const GET_COMMENTS_COUNT = `task`;
export const UPLOAD_FILE_TO_COMMENT = `task`;
export const ADD_COMMENT_MENTION_NOTIFICATION = `notification/mention`;

export const UPDATE_PROJECT_WEIGHT_TYPE = `projects`;

export const GET_ALL_MAIN_FOLDERS_FILES_IN_PROJECT = `projects`;
export const GET_ALL_SUB_FOLDERS_FILES_IN_PROJECT = `projects`;
export const ADD_PROJECT_FOLDER = `projects`;
export const ADD_FILE_TO_PROJECT_FOLDER = `projects`;
export const UPDATE_PROJECT_FOLDER = `projects`;
export const DELETE_PROJECT_FOLDER = `projects`;
export const MOVE_FILES_BETWEEN_FOLDERS = `projects`;

export const BLOCK_USER = `projects`;

export const PIN_PROJECT = `projects/pin`;

export const INITIATE_MEETING = `meeting`;
export const ADD_DISCUSSION_POINT = `meeting/discussion`;
export const UPDATE_MEETING = `meeting`;
export const GET_MEETINGS = `meeting?`;
export const DELETE_MEETING = `meeting`
