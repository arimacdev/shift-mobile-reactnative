import {
    GET_ALL_PROJECTS_BY_USER,
    GET_ALL_PROJECTS_BY_USER_SUCCESS,
    GET_ALL_PROJECTS_BY_USER_FAILED,
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