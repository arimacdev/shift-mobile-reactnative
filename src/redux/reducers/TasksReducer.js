import {
    DELETE_SINGLE_TASK_IN_GROUP_TASKS,
    DELETE_SINGLE_TASK_IN_GROUP_TASKS_SUCCESS,
    DELETE_SINGLE_TASK_IN_GROUP_TASKS_FAILED,
    DELETE_SINGLE_TASK_IN_GROUP_TASKS_FAILED_MASSAGE,
} from '../types';

const INITIAL_STATE = {
    

    deleteSingleTaskInGroupLoading: false,
    deleteSingleTaskInGroupSuccess: false,
    deleteSingleTaskInGroupError: false,
    deleteSingleTaskInGroupErrorMessage: '',
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {

        // delete task
        case DELETE_SINGLE_TASK_IN_GROUP_TASKS:
            return {
                ...state,
                deleteSingleTaskInGroupLoading: true,
                deleteSingleTaskInGroupSuccess: false,
                deleteSingleTaskInGroupError: false,
                deleteSingleTaskInGroupErrorMessage: ''
            };
        case DELETE_SINGLE_TASK_IN_GROUP_TASKS_SUCCESS:
            return {
                ...state,
                deleteSingleTaskInGroupLoading: false,
                deleteSingleTaskInGroupSuccess: true,
                deleteSingleTaskInGroupError: false,
                deleteSingleTaskInGroupErrorMessage: ''
            };
        case DELETE_SINGLE_TASK_IN_GROUP_TASKS_FAILED:
            return {
                ...state,
                deleteSingleTaskInGroupLoading: false,
                deleteSingleTaskInGroupSuccess: false,
                deleteSingleTaskInGroupError: true,
                deleteSingleTaskInGroupErrorMessage: ''
            };
        case DELETE_SINGLE_TASK_IN_GROUP_TASKS_FAILED_MASSAGE:
            return {
                ...state,
                deleteSingleTaskInGroupLoading: false,
                deleteSingleTaskInGroupSuccess: false,
                deleteSingleTaskInGroupError: true,
                deleteSingleTaskInGroupErrorMessage: action.payload
            };      
        default:
            return state;
    }
};
