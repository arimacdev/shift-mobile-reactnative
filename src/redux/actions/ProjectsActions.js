import {
    GET_ALL_PROJECTS_BY_USER,
    GET_ALL_PROJECTS_BY_USER_SUCCESS,
    GET_ALL_PROJECTS_BY_USER_FAILED,
    GET_ALL_TASK_BY_PROJECT,
    GET_ALL_TASK_BY_PROJECT_SUCCESS,
    GET_ALL_TASK_BY_PROJECT_FAILED
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