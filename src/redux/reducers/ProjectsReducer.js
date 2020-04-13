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

} from '../types';

const INITIAL_STATE = {
    projectsLoading :  false,
    projects : [],

    allTaskByProjectLoading : false,
    allTaskByProject : [],

    myTaskByProjectLoading : false,
    myTaskByProject : [],

    addProjectLoading: false,
    addProjectError : false,
    addProjectrSuccess : false,

    updateProjectLoading: false,
    updateProjectSuccess : false,
    updateProjectError : false,
    updateProjectErrorMessage : '',
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
        // add project
        case ADD_PROJECT:
            return { ...state, addProjectLoading: true,addProjectrSuccess: false,addProjectError:false};
        case ADD_PROJECT_SUCCESS:
           let newProject = action.payload.data;
           //const existingProjects = [...(state.projects)];
           //existingProjects.push(...(newProject));
           return { ...state, 
                addProjectLoading : false,
                addProjectrSuccess : true,
                addProjectError : false,
                //projects :  [...(state.projects)];,
            };
        case ADD_PROJECT_FAILED:
           return { ...state, addProjectLoading: false,addProjectrSuccess: false,addProjectError:true};
        // update project
        case EDIT_PROJECT:
            return { ...state, 
                updateProjectLoading: true,
                updateProjectSuccess: false,
                updateProjectError: false,
                updateProjectErrorMessage : ''
            };
        case EDIT_PROJECT_SUCCESS:
            return { ...state, 
                updateProjectLoading: false,
                updateProjectSuccess: true,
                updateProjectError: false,
                updateProjectErrorMessage : ''
            };
        case EDIT_PROJECT_FAILED:
            return { ...state, 
                updateProjectLoading: false,
                updateProjectSuccess: false,
                updateProjectError: true,
                updateProjectErrorMessage : ''
            };
        case EDIT_PROJECT_FAILED_MASSAGE:
            return { ...state, 
                updateProjectLoading: false,
                updateProjectSuccess: false,
                updateProjectError: true,
                updateProjectErrorMessage : action.payload
            };                          
        default:
            return state;
    }
};
