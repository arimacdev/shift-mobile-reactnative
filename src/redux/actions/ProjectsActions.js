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
    ADD_PEOPLE_TO_PROJECT_FAILED_MASSAGE

} from '../types';
import APIServices from '../../services/APIServices';

export const getAllProjectsByUser =  (userID) => {
    return (dispatch) => {
        dispatch({ type: GET_ALL_PROJECTS_BY_USER });
        APIServices.getAllProjectsByUserData(userID).then(response => {
            if(response.message == 'success'){
                dispatch({ 
                    type: GET_ALL_PROJECTS_BY_USER_SUCCESS,
                    payload: response});  
            }else{
                dispatch({ type: GET_ALL_PROJECTS_BY_USER_FAILED});  
            }    
        }).catch(error => {   
            dispatch({ type: GET_ALL_PROJECTS_BY_USER_FAILED});  
        });
    };
};

export const getAllTaskInProjects =  (userID,projectID) => {
    return (dispatch) => {
        dispatch({ type: GET_ALL_TASK_BY_PROJECT });
        APIServices.getAllTaskInProjectsData(userID,projectID).then(response => {
            if(response.message == 'success'){
                dispatch({ 
                    type: GET_ALL_TASK_BY_PROJECT_SUCCESS,
                    payload: response});  
            }else{
                dispatch({ type: GET_ALL_TASK_BY_PROJECT_FAILED});  
            }    
        }).catch(error => {   
            dispatch({ type: GET_ALL_TASK_BY_PROJECT_FAILED});  
        });
    };
};

export const getMyTaskInProjects =  (userID,projectID) => {
    return (dispatch) => {
        dispatch({ type: GET_MY_TASK_BY_PROJECT });
        APIServices.getMyTaskInProjectsData(userID,projectID).then(response => {
            if(response.message == 'success'){
                dispatch({ 
                    type: GET_MY_TASK_BY_PROJECT_SUCCESS,
                    payload: response});  
            }else{
                dispatch({ type: GET_MY_TASK_BY_PROJECT_FAILED});  
            }    
        }).catch(error => {   
            dispatch({ type: GET_MY_TASK_BY_PROJECT_FAILED});  
        });
    };
};

export const addproject =  (projectName,projectClient,IsoStartDate,IsoSEndDate,projectOwner) => {
    return (dispatch) => {
        dispatch({ type: ADD_PROJECT });
        APIServices.addprojectData(projectName,projectClient,IsoStartDate,IsoSEndDate,projectOwner).then(response => {
            if(response.message == 'success'){
                dispatch({ 
                    type: ADD_PROJECT_SUCCESS,
                    payload: response});  
            }else{
                dispatch({ type: ADD_PROJECT_FAILED});  
            }    
        }).catch(error => {   
            dispatch({ type: ADD_PROJECT_FAILED});  
        });
    };
};

export const updateproject =  (projectID,userID,projectName,projectClient,IsoStartDate,IsoSEndDate,projectStatus) => {
    return (dispatch) => {
        dispatch({ type: EDIT_PROJECT });
        APIServices.updateProjectData(projectID,userID,projectName,projectClient,
            IsoStartDate,IsoSEndDate,projectStatus).then(response => {
            if(response.message == 'success'){
                dispatch({ 
                    type: EDIT_PROJECT_SUCCESS,
                    payload: response});  
            }else{
                dispatch({ type: EDIT_PROJECT_FAILED});  
            }    
        }).catch(error => {  
            if(error.status == 403){
                let errorMsg = error.data.message;
                dispatch({ 
                    type: EDIT_PROJECT_FAILED_MASSAGE,
                    payload: errorMsg});   
            }else{
                dispatch({ type: EDIT_PROJECT_FAILED});  
            } 
        });
    };
};

export const deleteProject =  (projectID) => {
    return (dispatch) => {
        dispatch({ type: DELETE_PROJECT });
        APIServices.deleteProjectData(projectID).then(response => {
            if(response.message == 'success'){
                dispatch({ 
                    type: DELETE_PROJECT_SUCCESS,
                    payload: response});  
            }else{
                dispatch({ type: DELETE_PROJECT_FAILED});  
            }    
        }).catch(error => {  
            if(error.status == 401){
                let errorMsg = error.data.message;
                dispatch({ 
                    type: DELETE_PROJECT_FAILED_MASSAGE,
                    payload: errorMsg});   
            }else{
                dispatch({ type: DELETE_PROJECT_FAILED});  
            } 
        });
    };
};

export const addUserToProject =  (assignerId,userID,role,assigneeProjectRole,projectID) => {
    return (dispatch) => {
        dispatch({ type: ADD_PEOPLE_TO_PROJECT });
        APIServices.addUserToProjectData(assignerId,userID,role,assigneeProjectRole,projectID).then(response => {
            if(response.message == 'success'){
                dispatch({ 
                    type: ADD_PEOPLE_TO_PROJECT_SUCCESS,
                    payload: response});  
            }else{
                dispatch({ type: ADD_PEOPLE_TO_PROJECT_FAILED});  
            }    
        }).catch(error => {  
            if(error.status == 403){
                let errorMsg = error.data.message;
                dispatch({ 
                    type: ADD_PEOPLE_TO_PROJECT_FAILED_MASSAGE,
                    payload: errorMsg});   
            }else if(error.status == 400){
                let errorMsg = error.data.message;
                dispatch({ 
                    type: ADD_PEOPLE_TO_PROJECT_FAILED_MASSAGE,
                    payload: errorMsg});   
            }else{
                dispatch({ type: ADD_PEOPLE_TO_PROJECT_FAILED});  
            } 
        });
    };
};
