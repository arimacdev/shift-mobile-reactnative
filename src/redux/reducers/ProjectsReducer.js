import {
    GET_ALL_PROJECTS_BY_USER,
    GET_ALL_PROJECTS_BY_USER_SUCCESS,
    GET_ALL_PROJECTS_BY_USER_FAILED,

    GET_ALL_TASK_BY_PROJECT,
    GET_ALL_TASK_BY_PROJECT_SUCCESS,
    GET_ALL_TASK_BY_PROJECT_FAILED,

    GET_MY_TASK_BY_PROJECT,
    GET_MY_TASK_BY_PROJECT_SUCCESS,
    GET_MY_TASK_BY_PROJECT_FAILED,

    ADD_PROJECT,
    ADD_PROJECT_SUCCESS,
    ADD_PROJECT_FAILED,

    EDIT_PROJECT,
    EDIT_PROJECT_SUCCESS,
    EDIT_PROJECT_FAILED,
    EDIT_PROJECT_FAILED_MASSAGE,

    DELETE_PROJECT,
    DELETE_PROJECT_SUCCESS,
    DELETE_PROJECT_FAILED,
    DELETE_PROJECT_FAILED_MASSAGE,

    ADD_PEOPLE_TO_PROJECT,
    ADD_PEOPLE_TO_PROJECT_SUCCESS,
    ADD_PEOPLE_TO_PROJECT_FAILED,
    ADD_PEOPLE_TO_PROJECT_FAILED_MASSAGE,

    ADD_TASK_TO_PROJECT,
    ADD_TASK_TO_PROJECT_SUCCESS,
    ADD_TASK_TO_PROJECT_FAILED,
    ADD_TASK_TO_PROJECT_FAILED_MASSAGE,

    DELETE_TASK,
    DELETE_TASK_SUCCESS,
    DELETE_TASK_FAILED,
    DELETE_TASK_FAILED_MASSAGE,

    ADD_FILE_TO_TASK,
    ADD_FILE_TO_TASK_SUCCESS,
    ADD_FILE_TO_TASK_FAILED,
    ADD_FILE_TO_TASK_FAILED_MASSAGE,

    MODEL_VISIBLE_CHANGE,
    PROJECT_TASK_SUB_TASK_SUMBIT_SUCCESS,

    DELETE_SUB_TASK,
    DELETE_SUB_TASK_SUCCESS,
    DELETE_SUB_TASK_FAILED,
    DELETE_SUB_TASK_FAILED_MASSAGE

} from '../types';

const INITIAL_STATE = {
    projectsLoading: false,
    projects: [],

    allTaskByProjectLoading: false,
    allTaskByProject: [],

    myTaskByProjectLoading: false,
    myTaskByProject: [],

    addProjectLoading: false,
    addProjectError: false,
    addProjectrSuccess: false,

    updateProjectLoading: false,
    updateProjectSuccess: false,
    updateProjectError: false,
    updateProjectErrorMessage: '',

    deleteProjectLoading: false,
    deleteProjectSuccess: false,
    deleteProjectError: false,
    deleteProjectErrorMessage: '',

    addPeopleProjectLoading: false,
    addPeopleProjectSuccess: false,
    addPeopleProjectError: false,
    addPeopleProjectErrorMessage: '',

    addTaskToProjectLoading: false,
    addTaskToProjectSuccess: false,
    addTaskToProjectError: false,
    addTaskToProjectErrorMessage: '',
    taskId: null,

    deleteTaskLoading: false,
    deleteTaskSuccess: false,
    deleteTaskError: false,
    deleteTaskErrorMessage: '',

    addFileTaskLoading: false,
    addFileTaskSuccess: false,
    addFileTaskError: false,
    addFileeTaskErrorMessage: '',

    addPeopleModelVisible : false,
    myTaskAddEditSubTask : false,

    deleteSubTaskLoading: false,
    deleteSubTaskSuccess: false,
    deleteSubTaskError: false,
    deleteSubTaskErrorMessage: '',
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case GET_ALL_PROJECTS_BY_USER:
            return { ...state, projectsLoading: true };
        case GET_ALL_PROJECTS_BY_USER_SUCCESS:
            return { ...state, projectsLoading: false, projects: action.payload.data };
        case GET_ALL_PROJECTS_BY_USER_FAILED:
            return { ...state, projectsLoading: false };
        // all tasks by project
        case GET_ALL_TASK_BY_PROJECT:
            return { ...state, allTaskByProjectLoading: true };
        case GET_ALL_TASK_BY_PROJECT_SUCCESS:
            return { ...state, allTaskByProjectLoading: false, allTaskByProject: action.payload.data };
        case GET_ALL_TASK_BY_PROJECT_FAILED:
            return { ...state, allTaskByProjectLoading: false };
        // my tasks by project
        case GET_MY_TASK_BY_PROJECT:
            return { ...state, myTaskByProjectLoading: true };
        case GET_MY_TASK_BY_PROJECT_SUCCESS:
            return { ...state, myTaskByProjectLoading: false, myTaskByProject: action.payload.data };
        case GET_MY_TASK_BY_PROJECT_FAILED:
            return { ...state, myTaskByProjectLoading: false };
        // add project
        case ADD_PROJECT:
            return { ...state, addProjectLoading: true, addProjectrSuccess: false, addProjectError: false };
        case ADD_PROJECT_SUCCESS:
            let newProject = action.payload.data;
            //const existingProjects = [...(state.projects)];
            //existingProjects.push(...(newProject));
            return {
                ...state,
                addProjectLoading: false,
                addProjectrSuccess: true,
                addProjectError: false,
                //projects :  [...(state.projects)];,
            };
        case ADD_PROJECT_FAILED:
            return { ...state, addProjectLoading: false, addProjectrSuccess: false, addProjectError: true };
        // update project
        case EDIT_PROJECT:
            return {
                ...state,
                updateProjectLoading: true,
                updateProjectSuccess: false,
                updateProjectError: false,
                updateProjectErrorMessage: ''
            };
        case EDIT_PROJECT_SUCCESS:
            return {
                ...state,
                updateProjectLoading: false,
                updateProjectSuccess: true,
                updateProjectError: false,
                updateProjectErrorMessage: ''
            };
        case EDIT_PROJECT_FAILED:
            return {
                ...state,
                updateProjectLoading: false,
                updateProjectSuccess: false,
                updateProjectError: true,
                updateProjectErrorMessage: ''
            };
        case EDIT_PROJECT_FAILED_MASSAGE:
            return {
                ...state,
                updateProjectLoading: false,
                updateProjectSuccess: false,
                updateProjectError: true,
                updateProjectErrorMessage: action.payload
            };
        // delete project
        case DELETE_PROJECT:
            return {
                ...state,
                deleteProjectLoading: true,
                deleteProjectSuccess: false,
                deleteProjectError: false,
                deleteProjectErrorMessage: ''
            };
        case DELETE_PROJECT_SUCCESS:
            return {
                ...state,
                deleteProjectLoading: false,
                deleteProjectSuccess: true,
                deleteProjectError: false,
                deleteProjectErrorMessage: ''
            };
        case DELETE_PROJECT_FAILED:
            return {
                ...state,
                deleteProjectLoading: false,
                deleteProjectSuccess: false,
                deleteProjectError: true,
                deleteProjectErrorMessage: ''
            };
        case DELETE_PROJECT_FAILED_MASSAGE:
            return {
                ...state,
                deleteProjectLoading: false,
                deleteProjectSuccess: false,
                deleteProjectError: true,
                deleteProjectErrorMessage: action.payload
            };
        // add people to project    
        case ADD_PEOPLE_TO_PROJECT:
            return {
                ...state,
                addPeopleProjectLoading: true,
                addPeopleProjectSuccess: false,
                addPeopleProjectError: false,
                addPeopleProjectErrorMessage: ''
            };
        case ADD_PEOPLE_TO_PROJECT_SUCCESS:
            return {
                ...state,
                addPeopleProjectLoading: false,
                addPeopleProjectSuccess: true,
                addPeopleProjectError: false,
                addPeopleProjectErrorMessage: ''
            };
        case ADD_PEOPLE_TO_PROJECT_FAILED:
            return {
                ...state,
                addPeopleProjectLoading: false,
                addPeopleProjectSuccess: false,
                addPeopleProjectError: true,
                addPeopleProjectErrorMessage: ''
            };
        case ADD_PEOPLE_TO_PROJECT_FAILED_MASSAGE:
            return {
                ...state,
                addPeopleProjectLoading: false,
                addPeopleProjectSuccess: false,
                addPeopleProjectError: true,
                addPeopleProjectErrorMessage: action.payload
            };
        // add task to project    
        case ADD_TASK_TO_PROJECT:
            return {
                ...state,
                addTaskToProjectLoading: true,
                addTaskToProjectSuccess: false,
                addTaskToProjectError: false,
                addTaskToProjectErrorMessage: '',
                taskId: null
            };
        case ADD_TASK_TO_PROJECT_SUCCESS:
            return {
                ...state,
                addTaskToProjectLoading: false,
                addTaskToProjectSuccess: true,
                addTaskToProjectError: false,
                addTaskToProjectErrorMessage: '',
                taskId: action.payload
            };
        case ADD_TASK_TO_PROJECT_FAILED:
            return {
                ...state,
                addTaskToProjectLoading: false,
                addTaskToProjectSuccess: false,
                addTaskToProjectError: true,
                addTaskToProjectErrorMessage: '',
                taskId: null
            };
        case ADD_TASK_TO_PROJECT_FAILED_MASSAGE:
            return {
                ...state,
                addTaskToProjectLoading: false,
                addTaskToProjectSuccess: false,
                addTaskToProjectError: true,
                addTaskToProjectErrorMessage: action.payload,
                taskId: null
            };
             // delete task
        case DELETE_TASK:
            return {
                ...state,
                deleteTaskLoading: true,
                deleteTaskSuccess: false,
                deleteTaskError: false,
                deleteTaskErrorMessage: ''
            };
        case DELETE_TASK_SUCCESS:
            return {
                ...state,
                deleteTaskLoading: false,
                deleteTaskSuccess: true,
                deleteTaskError: false,
                deleteTaskErrorMessage: ''
            };
        case DELETE_TASK_FAILED:
            return {
                ...state,
                deleteTaskLoading: false,
                deleteTaskSuccess: false,
                deleteTaskError: true,
                deleteTaskErrorMessage: ''
            };
        case DELETE_TASK_FAILED_MASSAGE:
            return {
                ...state,
                deleteTaskLoading: false,
                deleteTaskSuccess: false,
                deleteTaskError: true,
                deleteTaskErrorMessage: action.payload
            };
        // Add file to task
        case ADD_FILE_TO_TASK:
            return {
                ...state,
                addFileTaskLoading: true,
                addFileTaskSuccess: false,
            };
        case ADD_FILE_TO_TASK_SUCCESS:
            return {
                ...state,
                addFileTaskLoading: false,
                addFileTaskSuccess : true,
            };
        case ADD_FILE_TO_TASK_FAILED_MASSAGE:
            return {
                ...state,
                addFileTaskLoading: false,
                addFileTaskSuccess: false,
            };
        case ADD_FILE_TO_TASK_FAILED:
            return {
                ...state,
                addFileTaskLoading: false,
                addFileTaskSuccess: false,
            };
        case MODEL_VISIBLE_CHANGE:
            return { ...state, addPeopleModelVisible: action.payload  };
        case PROJECT_TASK_SUB_TASK_SUMBIT_SUCCESS :
            return {
                ...state,
                myTaskAddEditSubTask: action.payload
            };
        case DELETE_SUB_TASK:
            return {
                ...state,
                deleteSubTaskLoading: true,
                deleteSubTaskSuccess: false,
                deleteSubTaskError: false,
                deleteSubTaskErrorMessage: ''
            };
        case DELETE_SUB_TASK_SUCCESS:
            return {
                ...state,
                deleteSubTaskLoading: false,
                deleteSubTaskSuccess: true,
                deleteSubTaskError: false,
                deleteSubTaskErrorMessage: ''
            };
        case DELETE_SUB_TASK_FAILED:
            return {
                ...state,
                deleteSubTaskLoading: false,
                deleteSubTaskSuccess: false,
                deleteSubTaskError: true,
                deleteSubTaskErrorMessage: ''
            };
        case DELETE_SUB_TASK_FAILED_MASSAGE:
            return {
                ...state,
                deleteSubTaskLoading: false,
                deleteSubTaskSuccess: false,
                deleteSubTaskError: true,
                deleteSubTaskErrorMessage: action.payload
            };                 
        default:
            return state;
    }
};
