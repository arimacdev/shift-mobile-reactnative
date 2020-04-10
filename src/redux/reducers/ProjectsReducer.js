import {
    GET_ALL_PROJECTS_BY_USER,
    GET_ALL_PROJECTS_BY_USER_SUCCESS,
    GET_ALL_PROJECTS_BY_USER_FAILED,

    GET_ALL_TASK_BY_PROJECT,
    GET_ALL_TASK_BY_PROJECT_SUCCESS,
    GET_ALL_TASK_BY_PROJECT_FAILED,

    GET_MY_TASK_BY_PROJECT,
    GET_MY_TASK_BY_PROJECT_SUCCESS,
    GET_MY_TASK_BY_PROJECT_FAILED
} from '../types';

const INITIAL_STATE = {
    projectsLoading :  false,
    projects : [],

    allTaskByProjectLoading : false,
    allTaskByProject : [],

    myTaskByProjectLoading : false,
    myTaskByProject : []
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case GET_ALL_PROJECTS_BY_USER:
            return { ...state, projectsLoading: true};
        case GET_ALL_PROJECTS_BY_USER_SUCCESS:
            return { ...state, projectsLoading: false,projects:action.payload.data };
        case GET_ALL_PROJECTS_BY_USER_FAILED:
            return { ...state, projectsLoading: false };
        // all tasks by project
         case GET_ALL_TASK_BY_PROJECT:
            return { ...state, allTaskByProjectLoading: true};
        case GET_ALL_TASK_BY_PROJECT_SUCCESS:
            return { ...state, allTaskByProjectLoading: false,allTaskByProject:action.payload.data };
        case GET_ALL_TASK_BY_PROJECT_FAILED:
            return { ...state, allTaskByProjectLoading: false };
        // my tasks by project
        case GET_MY_TASK_BY_PROJECT:
            return { ...state, myTaskByProjectLoading: true};
        case GET_MY_TASK_BY_PROJECT_SUCCESS:
            return { ...state, myTaskByProjectLoading: false,myTaskByProject:action.payload.data };
        case GET_MY_TASK_BY_PROJECT_FAILED:
            return { ...state, myTaskByProjectLoading: false };                 
        default:
            return state;
    }
};
