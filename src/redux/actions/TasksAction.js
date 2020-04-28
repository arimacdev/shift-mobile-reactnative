import {
    DELETE_SINGLE_TASK_IN_GROUP_TASKS,
    DELETE_SINGLE_TASK_IN_GROUP_TASKS_SUCCESS,
    DELETE_SINGLE_TASK_IN_GROUP_TASKS_FAILED,
    DELETE_SINGLE_TASK_IN_GROUP_TASKS_FAILED_MASSAGE,

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