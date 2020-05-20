import {
    DELETE_SINGLE_TASK_IN_GROUP_TASKS,
    DELETE_SINGLE_TASK_IN_GROUP_TASKS_SUCCESS,
    DELETE_SINGLE_TASK_IN_GROUP_TASKS_FAILED,
    DELETE_SINGLE_TASK_IN_GROUP_TASKS_FAILED_MASSAGE,

    ADD_FILE_TO_MY_TASK,
    ADD_FILE_TO_MY_TASK_SUCCESS,
    ADD_FILE_TO_MY_TASK_FAILED,
    ADD_FILE_TO_MY_TASK_FAILED_MASSAGE,

    DELETE_SINGLE_TASK_IN_MY_TASKS,
    DELETE_SINGLE_TASK_IN_MY_TASKS_SUCCESS,
    DELETE_SINGLE_TASK_IN_MY_TASKS_FAILED,
    DELETE_SINGLE_TASK_IN_MY_TASKS_FAILED_MASSAGE,

    MY_TASK_SUB_TASK_SUMBIT_SUCCESS,

    GET_ALL_TASK_BY_GROUP,
    GET_ALL_TASK_BY_GROUP_SUCCESS,
    GET_ALL_TASK_BY_GROUP_FAILED,

    DELETE_SINGLE_SUB_TASK_IN_GROUP_TASKS,
    DELETE_SINGLE_SUB_TASK_IN_GROUP_TASKS_SUCCESS,
    DELETE_SINGLE_SUB_TASK_IN_GROUP_TASKS_FAILED,
    DELETE_SINGLE_SUB_TASK_IN_GROUP_TASKS_FAILED_MASSAGE

} from '../types';
import APIServices from '../../services/APIServices';

export const deleteTaskInGroupTasks =  (selectedTaskGroupId, taskID) => {
    return (dispatch) => {
        dispatch({ type: DELETE_SINGLE_TASK_IN_GROUP_TASKS });
        APIServices.deleteSingleInGroupTaskData(selectedTaskGroupId, taskID).then(response => {
            if(response.message == 'success'){
                dispatch({ 
                    type: DELETE_SINGLE_TASK_IN_GROUP_TASKS_SUCCESS,
                    payload: response});  
            }else{
                dispatch({ type: DELETE_SINGLE_TASK_IN_GROUP_TASKS_FAILED});  
            }    
        }).catch(error => {  
            if(error.status == 401){
                let errorMsg = error.data.message;
                dispatch({ 
                    type: DELETE_SINGLE_TASK_IN_GROUP_TASKS_FAILED_MASSAGE,
                    payload: errorMsg});   
            } else if (error.status == 403) {
                let errorMsg = error.data.message;
                dispatch({ 
                    type: DELETE_SINGLE_TASK_IN_GROUP_TASKS_FAILED_MASSAGE,
                    payload: errorMsg});   
            }
            else{
                dispatch({ type: DELETE_SINGLE_TASK_IN_GROUP_TASKS_FAILED});  
            } 
        });
    };
};

export const addFileToMyTask =  (file, taskId) => {
    return (dispatch) => {
        dispatch({ type: ADD_FILE_TO_MY_TASK });
        APIServices.addFileToMyTaskData(file, taskId).then(response => {
            if(response.message == 'success'){
                dispatch({ 
                    type: ADD_FILE_TO_MY_TASK_SUCCESS,
                    payload: response});  
            }else{
                dispatch({ type: ADD_FILE_TO_MY_TASK_FAILED});  
            }    
        }).catch(error => {  
            if(error.status == 403){
                let errorMsg = error.data.message;
                dispatch({ 
                    type: ADD_FILE_TO_MY_TASK_FAILED_MASSAGE,
                    payload: errorMsg});   
            }else if(error.status == 400){
                let errorMsg = error.data.message;
                dispatch({ 
                    type: ADD_FILE_TO_MY_TASK_FAILED_MASSAGE,
                    payload: errorMsg});   
            }else{
                dispatch({ type: ADD_FILE_TO_MY_TASK_FAILED});  
            } 
        });
    };
};

export const deleteTaskInMyTasks =  (taskID) => {
    return (dispatch) => {
        dispatch({ type: DELETE_SINGLE_TASK_IN_MY_TASKS });
        APIServices.deleteSingleInMyTaskData(taskID).then(response => {
            if(response.message == 'success'){
                dispatch({ 
                    type: DELETE_SINGLE_TASK_IN_MY_TASKS_SUCCESS,
                    payload: response});  
            }else{
                dispatch({ type: DELETE_SINGLE_TASK_IN_MY_TASKS_FAILED});  
            }    
        }).catch(error => {  
            if(error.status == 401){
                let errorMsg = error.data.message;
                dispatch({ 
                    type: DELETE_SINGLE_TASK_IN_MY_TASKS_FAILED_MASSAGE,
                    payload: errorMsg});   
            } else if (error.status == 403) {
                let errorMsg = error.data.message;
                dispatch({ 
                    type: DELETE_SINGLE_TASK_IN_MY_TASKS_FAILED_MASSAGE,
                    payload: errorMsg});   
            }
            else{
                dispatch({ type: DELETE_SINGLE_TASK_IN_MY_TASKS_FAILED});  
            } 
        });
    };
};

export const addEditSubTaskSuccess = value => {
    return {
        type: MY_TASK_SUB_TASK_SUMBIT_SUCCESS,
        payload: value
    };
};

export const getAllTaskByGroup =  (selectedTaskGroupId) => {
    return (dispatch) => {
        dispatch({ type: GET_ALL_TASK_BY_GROUP });
        APIServices.getAllTaskByGroup(selectedTaskGroupId).then(response => {
            if(response.message == 'success'){
                dispatch({ 
                    type: GET_ALL_TASK_BY_GROUP_SUCCESS,
                    payload: response});  
            }else{
                dispatch({ type: GET_ALL_TASK_BY_GROUP_FAILED});  
            }    
        }).catch(error => {   
            dispatch({ type: GET_ALL_TASK_BY_GROUP_FAILED});  
        });
    };
};

export const deleteSubTaskInGroupTasks =  (selectedTaskGroupId, taskID) => {
    return (dispatch) => {
        dispatch({ type: DELETE_SINGLE_SUB_TASK_IN_GROUP_TASKS });
        APIServices.deleteSingleInGroupTaskData(selectedTaskGroupId, taskID).then(response => {
            if(response.message == 'success'){
                dispatch({ 
                    type: DELETE_SINGLE_SUB_TASK_IN_GROUP_TASKS_SUCCESS,
                    payload: response});  
            }else{
                dispatch({ type: DELETE_SINGLE_SUB_TASK_IN_GROUP_TASKS_FAILED});  
            }    
        }).catch(error => {  
            if(error.status == 401){
                let errorMsg = error.data.message;
                dispatch({ 
                    type: DELETE_SINGLE_SUB_TASK_IN_GROUP_TASKS_FAILED_MASSAGE,
                    payload: errorMsg});   
            } else if (error.status == 403) {
                let errorMsg = error.data.message;
                dispatch({ 
                    type: DELETE_SINGLE_SUB_TASK_IN_GROUP_TASKS_FAILED_MASSAGE,
                    payload: errorMsg});   
            }
            else{
                dispatch({ type: DELETE_SINGLE_SUB_TASK_IN_GROUP_TASKS_FAILED});  
            } 
        });
    };
};