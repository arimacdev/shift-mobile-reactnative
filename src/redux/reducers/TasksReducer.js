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
  DELETE_SINGLE_SUB_TASK_IN_GROUP_TASKS_FAILED_MASSAGE,
} from '../types';

const INITIAL_STATE = {
  deleteSingleTaskInGroupLoading: false,
  deleteSingleTaskInGroupSuccess: false,
  deleteSingleTaskInGroupError: false,
  deleteSingleTaskInGroupErrorMessage: '',

  addFileTaskLoading: false,
  addFileTaskSuccess: false,
  addFileTaskError: false,
  addFileTaskErrorMessage: '',

  deleteSingleTaskInMyLoading: false,
  deleteSingleTaskInMySuccess: false,
  deleteSingleTaskInMyError: false,
  deleteSingleTaskInMyErrorMessage: '',

  myTaskAddEditSubTask: false,

  allTaskByGroupLoading: false,
  allTaskByGroup: [],

  deleteSingleSubTaskInGroupLoading: false,
  deleteSingleSubTaskInGroupSuccess: false,
  deleteSingleSubTaskInGroupError: false,
  deleteSingleSubTaskInGroupErrorMessage: '',
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    // delete task Group
    case DELETE_SINGLE_TASK_IN_GROUP_TASKS:
      return {
        ...state,
        deleteSingleTaskInGroupLoading: true,
        deleteSingleTaskInGroupSuccess: false,
        deleteSingleTaskInGroupError: false,
        deleteSingleTaskInGroupErrorMessage: '',
      };
    case DELETE_SINGLE_TASK_IN_GROUP_TASKS_SUCCESS:
      return {
        ...state,
        deleteSingleTaskInGroupLoading: false,
        deleteSingleTaskInGroupSuccess: true,
        deleteSingleTaskInGroupError: false,
        deleteSingleTaskInGroupErrorMessage: '',
      };
    case DELETE_SINGLE_TASK_IN_GROUP_TASKS_FAILED:
      return {
        ...state,
        deleteSingleTaskInGroupLoading: false,
        deleteSingleTaskInGroupSuccess: false,
        deleteSingleTaskInGroupError: true,
        deleteSingleTaskInGroupErrorMessage: '',
      };
    case DELETE_SINGLE_TASK_IN_GROUP_TASKS_FAILED_MASSAGE:
      return {
        ...state,
        deleteSingleTaskInGroupLoading: false,
        deleteSingleTaskInGroupSuccess: false,
        deleteSingleTaskInGroupError: true,
        deleteSingleTaskInGroupErrorMessage: action.payload,
      };
    // Add file to task
    case ADD_FILE_TO_MY_TASK:
      return {
        ...state,
        addFileTaskLoading: true,
        addFileTaskSuccess: false,
      };
    case ADD_FILE_TO_MY_TASK_SUCCESS:
      return {
        ...state,
        addFileTaskLoading: false,
        addFileTaskSuccess: true,
      };
    case ADD_FILE_TO_MY_TASK:
      return {
        ...state,
        addFileTaskLoading: false,
        addFileTaskSuccess: false,
      };
    case ADD_FILE_TO_MY_TASK_FAILED_MASSAGE:
      return {
        ...state,
        addFileTaskLoading: false,
        addFileTaskSuccess: false,
      };
    //delete my task
    case DELETE_SINGLE_TASK_IN_MY_TASKS:
      return {
        ...state,
        deleteSingleTaskInMyLoading: true,
        deleteSingleTaskInMySuccess: false,
        deleteSingleTaskInMyError: false,
        deleteSingleTaskInMyErrorMessage: '',
      };
    case DELETE_SINGLE_TASK_IN_MY_TASKS_SUCCESS:
      return {
        ...state,
        deleteSingleTaskInMyLoading: false,
        deleteSingleTaskInMySuccess: true,
        deleteSingleTaskInMyError: false,
        deleteSingleTaskInMyErrorMessage: '',
      };
    case DELETE_SINGLE_TASK_IN_MY_TASKS_FAILED:
      return {
        ...state,
        deleteSingleTaskInMyLoading: false,
        deleteSingleTaskInMySuccess: false,
        deleteSingleTaskInMyError: true,
        deleteSingleTaskInMyErrorMessage: '',
      };
    case DELETE_SINGLE_TASK_IN_MY_TASKS_FAILED_MASSAGE:
      return {
        ...state,
        deleteSingleTaskInMyLoading: false,
        deleteSingleTaskInMySuccess: false,
        deleteSingleTaskInMyError: true,
        deleteSingleTaskInMyErrorMessage: action.payload,
      };
    case MY_TASK_SUB_TASK_SUMBIT_SUCCESS:
      return {
        ...state,
        myTaskAddEditSubTask: action.payload,
      };
    case GET_ALL_TASK_BY_GROUP:
      return {...state, allTaskByGroupLoading: true};
    case GET_ALL_TASK_BY_GROUP_SUCCESS:
      return {
        ...state,
        allTaskByGroupLoading: false,
        allTaskByGroup: action.payload.data,
      };
    case GET_ALL_TASK_BY_GROUP_FAILED:
      return {...state, allTaskByGroupLoading: false};
    //delete sub task
    case DELETE_SINGLE_SUB_TASK_IN_GROUP_TASKS:
      return {
        ...state,
        deleteSingleSubTaskInGroupLoading: true,
        deleteSingleSubTaskInGroupSuccess: false,
        deleteSingleSubTaskInGroupError: false,
        deleteSingleSubTaskInGroupErrorMessage: '',
      };
    case DELETE_SINGLE_SUB_TASK_IN_GROUP_TASKS_SUCCESS:
      return {
        ...state,
        deleteSingleSubTaskInGroupLoading: false,
        deleteSingleSubTaskInGroupSuccess: true,
        deleteSingleSubTaskInGroupError: false,
        deleteSingleSubTaskInGroupErrorMessage: '',
      };
    case DELETE_SINGLE_SUB_TASK_IN_GROUP_TASKS_FAILED:
      return {
        ...state,
        deleteSingleSubTaskInGroupLoading: false,
        deleteSingleSubTaskInGroupSuccess: false,
        deleteSingleSubTaskInGroupError: true,
        deleteSingleSubTaskInGroupErrorMessage: '',
      };
    case DELETE_SINGLE_SUB_TASK_IN_GROUP_TASKS_FAILED_MASSAGE:
      return {
        ...state,
        deleteSingleSubTaskInGroupLoading: false,
        deleteSingleSubTaskInGroupSuccess: false,
        deleteSingleSubTaskInGroupError: true,
        deleteSingleSubTaskInGroupErrorMessage: action.payload,
      };
    default:
      return state;
  }
};
