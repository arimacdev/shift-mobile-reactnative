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
  ADD_PROJECT_FAILED_MASSAGE,
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
  ADD_FILE_TO_TASK,
  ADD_FILE_TO_TASK_SUCCESS,
  ADD_FILE_TO_TASK_FAILED,
  ADD_FILE_TO_TASK_FAILED_MASSAGE,
  DELETE_TASK,
  DELETE_TASK_SUCCESS,
  DELETE_TASK_FAILED,
  DELETE_TASK_FAILED_MASSAGE,
  MODEL_VISIBLE_CHANGE,
  PROJECT_TASK_SUB_TASK_SUMBIT_SUCCESS,
  DELETE_SUB_TASK,
  DELETE_SUB_TASK_SUCCESS,
  DELETE_SUB_TASK_FAILED,
  DELETE_SUB_TASK_FAILED_MASSAGE,
  VIEW_SECOND_DETAILS_SCREEN,
} from '../types';
import APIServices from '../../services/APIServices';

export const getAllProjectsByUser = userID => {
  return dispatch => {
    dispatch({type: GET_ALL_PROJECTS_BY_USER});
    APIServices.getAllProjectsByUserData(userID)
      .then(response => {
        if (response.message == 'success') {
          dispatch({
            type: GET_ALL_PROJECTS_BY_USER_SUCCESS,
            payload: response,
          });
        } else {
          dispatch({type: GET_ALL_PROJECTS_BY_USER_FAILED});
        }
      })
      .catch(error => {
        dispatch({type: GET_ALL_PROJECTS_BY_USER_FAILED});
      });
  };
};

export const getAllTaskInProjects = (
  userID,
  projectID,
  startIndex,
  endIndex,
  allTasks,
) => {
  return dispatch => {
    dispatch({type: GET_ALL_TASK_BY_PROJECT});
    APIServices.getAllTaskInProjectsData(
      userID,
      projectID,
      startIndex,
      endIndex,
      allTasks,
    )
      .then(response => {
        if (response.message == 'success') {
          dispatch({
            type: GET_ALL_TASK_BY_PROJECT_SUCCESS,
            payload: response,
          });
        } else {
          dispatch({type: GET_ALL_TASK_BY_PROJECT_FAILED});
        }
      })
      .catch(error => {
        dispatch({type: GET_ALL_TASK_BY_PROJECT_FAILED});
      });
  };
};

export const getMyTaskInProjects = (
  userID,
  projectID,
  myListStartIndex,
  myListEndIndex,
) => {
  return dispatch => {
    dispatch({type: GET_MY_TASK_BY_PROJECT});
    APIServices.getMyTaskInProjectsData(
      userID,
      projectID,
      myListStartIndex,
      myListEndIndex,
    )
      .then(response => {
        if (response.message == 'success') {
          dispatch({
            type: GET_MY_TASK_BY_PROJECT_SUCCESS,
            payload: response,
          });
        } else {
          dispatch({type: GET_MY_TASK_BY_PROJECT_FAILED});
        }
      })
      .catch(error => {
        dispatch({type: GET_MY_TASK_BY_PROJECT_FAILED});
      });
  };
};

export const addproject = (
  projectName,
  projectClient,
  IsoStartDate,
  IsoSEndDate,
  projectOwner,
  projectAlias,
  weightType,
) => {
  return dispatch => {
    dispatch({type: ADD_PROJECT});
    APIServices.addprojectData(
      projectName,
      projectClient,
      IsoStartDate,
      IsoSEndDate,
      projectOwner,
      projectAlias,
      weightType,
    )
      .then(response => {
        if (response.message == 'success') {
          dispatch({
            type: ADD_PROJECT_SUCCESS,
            payload: response,
          });
        } else {
          dispatch({type: ADD_PROJECT_FAILED});
        }
      })
      .catch(error => {
        if (error.status == 422) {
          let errorMsg = error.data.message;
          dispatch({
            type: ADD_PROJECT_FAILED_MASSAGE,
            payload: errorMsg,
          });
        } else {
          dispatch({type: ADD_PROJECT_FAILED});
        }
      });
  };
};

export const updateproject = (
  projectID,
  userID,
  projectName,
  projectClient,
  IsoStartDate,
  IsoSEndDate,
  projectStatus,
  projectAlias,
) => {
  return dispatch => {
    dispatch({type: EDIT_PROJECT});
    APIServices.updateProjectData(
      projectID,
      userID,
      projectName,
      projectClient,
      IsoStartDate,
      IsoSEndDate,
      projectStatus,
      projectAlias,
    )
      .then(response => {
        if (response.message == 'success') {
          dispatch({
            type: EDIT_PROJECT_SUCCESS,
            payload: response,
          });
        } else {
          dispatch({type: EDIT_PROJECT_FAILED});
        }
      })
      .catch(error => {
        let errorMsg = error.data.message;
        dispatch({
          type: EDIT_PROJECT_FAILED_MASSAGE,
          payload: errorMsg,
        });
        // if (error.status == 403 || error.status == 422) {

        // } else {
        //   dispatch({type: EDIT_PROJECT_FAILED});
        // }
      });
  };
};

export const deleteProject = projectID => {
  return dispatch => {
    dispatch({type: DELETE_PROJECT});
    APIServices.deleteProjectData(projectID)
      .then(response => {
        if (response.message == 'success') {
          dispatch({
            type: DELETE_PROJECT_SUCCESS,
            payload: response,
          });
        } else {
          dispatch({type: DELETE_PROJECT_FAILED});
        }
      })
      .catch(error => {
        if (error.status == 401) {
          let errorMsg = error.data.message;
          dispatch({
            type: DELETE_PROJECT_FAILED_MASSAGE,
            payload: errorMsg,
          });
        } else {
          dispatch({type: DELETE_PROJECT_FAILED});
        }
      });
  };
};

export const addUserToProject = (
  assignerId,
  userID,
  role,
  assigneeProjectRole,
  projectID,
) => {
  return dispatch => {
    dispatch({type: ADD_PEOPLE_TO_PROJECT});
    APIServices.addUserToProjectData(
      assignerId,
      userID,
      role,
      assigneeProjectRole,
      projectID,
    )
      .then(response => {
        if (response.message == 'success') {
          dispatch({
            type: ADD_PEOPLE_TO_PROJECT_SUCCESS,
            payload: response,
          });
        } else {
          dispatch({type: ADD_PEOPLE_TO_PROJECT_FAILED});
        }
      })
      .catch(error => {
        if (error.status == 403) {
          let errorMsg = error.data.message;
          dispatch({
            type: ADD_PEOPLE_TO_PROJECT_FAILED_MASSAGE,
            payload: errorMsg,
          });
        } else if (error.status == 400) {
          let errorMsg = error.data.message;
          dispatch({
            type: ADD_PEOPLE_TO_PROJECT_FAILED_MASSAGE,
            payload: errorMsg,
          });
        } else if (error.status == 401) {
          let errorMsg = error.data.message;
          dispatch({
            type: ADD_PEOPLE_TO_PROJECT_FAILED_MASSAGE,
            payload: errorMsg,
          });
        } else if (error.status == 500) {
          let errorMsg = error.data.message;
          dispatch({
            type: ADD_PEOPLE_TO_PROJECT_FAILED_MASSAGE,
            payload: 'User alrady exist in this project',
          });
        } else {
          dispatch({type: ADD_PEOPLE_TO_PROJECT_FAILED});
        }
      });
  };
};

export const addTaskToProject = (
  taskName,
  initiator,
  assigneeId,
  selectedStatus,
  dueDate,
  selectedDateReminder,
  notes,
  selectedProjectID,
  issueType,
  parentTaskId,
  sprintId,
) => {
  console.log(selectedProjectID, 'selectedProjectIDselectedProjectID');
  return dispatch => {
    dispatch({type: ADD_TASK_TO_PROJECT});
    APIServices.addTaskToProjectData(
      taskName,
      initiator,
      assigneeId,
      selectedStatus,
      dueDate,
      selectedDateReminder,
      notes,
      selectedProjectID,
      issueType,
      parentTaskId,
      sprintId,
    )
      .then(response => {
        if (response.message == 'success') {
          dispatch({
            type: ADD_TASK_TO_PROJECT_SUCCESS,
            payload: response,
          });
        } else {
          dispatch({type: ADD_TASK_TO_PROJECT_FAILED});
        }
      })
      .catch(error => {
        if (error.status == 403) {
          let errorMsg = error.data.message;
          dispatch({
            type: ADD_TASK_TO_PROJECT_FAILED_MASSAGE,
            payload: errorMsg,
          });
        } else if (error.status == 400) {
          let errorMsg = error.data.message;
          dispatch({
            type: ADD_TASK_TO_PROJECT_FAILED_MASSAGE,
            payload: errorMsg,
          });
        } else {
          dispatch({type: ADD_TASK_TO_PROJECT_FAILED});
        }
      });
  };
};

export const addFileToTask = (file, taskId, selectedProjectID) => {
  // console.log(file[0].uri, taskId, selectedProjectID,'file, taskId, selectedProjectID')
  return dispatch => {
    dispatch({type: ADD_FILE_TO_TASK});
    APIServices.addFileToTask(file, taskId, selectedProjectID)
      .then(response => {
        if (response.message == 'success') {
          dispatch({
            type: ADD_FILE_TO_TASK_SUCCESS,
            payload: response,
          });
        } else {
          dispatch({type: ADD_FILE_TO_TASK_FAILED});
        }
      })
      .catch(error => {
        if (error.status == 403) {
          let errorMsg = error.data.message;
          dispatch({
            type: ADD_FILE_TO_TASK_FAILED_MASSAGE,
            payload: errorMsg,
          });
        } else if (error.status == 400) {
          let errorMsg = error.data.message;
          dispatch({
            type: ADD_FILE_TO_TASK_FAILED_MASSAGE,
            payload: errorMsg,
          });
        } else {
          dispatch({type: ADD_FILE_TO_TASK_FAILED});
        }
      });
  };
};

export const deleteTask = (selectedProjectID, taskId, taskName, initiator) => {
  return dispatch => {
    dispatch({type: DELETE_TASK});
    APIServices.deleteSingleTask(selectedProjectID, taskId, taskName, initiator)
      .then(response => {
        if (response.message == 'success') {
          dispatch({
            type: DELETE_TASK_SUCCESS,
            payload: response,
          });
        } else {
          dispatch({type: DELETE_TASK_FAILED});
        }
      })
      .catch(error => {
        if (error.status == 401) {
          let errorMsg = error.data.message;
          dispatch({
            type: DELETE_TASK_FAILED_MASSAGE,
            payload: errorMsg,
          });
        } else if (error.status == 403) {
          let errorMsg = error.data.message;
          dispatch({
            type: DELETE_TASK_FAILED_MASSAGE,
            payload: errorMsg,
          });
        } else {
          dispatch({type: DELETE_TASK_FAILED});
        }
      });
  };
};

export const addPeopleModal = value => {
  return {
    type: MODEL_VISIBLE_CHANGE,
    payload: value,
  };
};

export const addEditSubTaskSuccessInProject = value => {
  return {
    type: PROJECT_TASK_SUB_TASK_SUMBIT_SUCCESS,
    payload: value,
  };
};

export const deleteSubTask = (
  selectedProjectID,
  taskId,
  taskName,
  initiator,
) => {
  return dispatch => {
    dispatch({type: DELETE_SUB_TASK});
    APIServices.deleteSingleTask(selectedProjectID, taskId, taskName, initiator)
      .then(response => {
        if (response.message == 'success') {
          dispatch({
            type: DELETE_SUB_TASK_SUCCESS,
            payload: response,
          });
        } else {
          dispatch({type: DELETE_SUB_TASK_FAILED});
        }
      })
      .catch(error => {
        if (error.status == 401) {
          let errorMsg = error.data.message;
          dispatch({
            type: DELETE_SUB_TASK_FAILED_MASSAGE,
            payload: errorMsg,
          });
        } else if (error.status == 403) {
          let errorMsg = error.data.message;
          dispatch({
            type: DELETE_SUB_TASK_FAILED_MASSAGE,
            payload: errorMsg,
          });
        } else {
          dispatch({type: DELETE_SUB_TASK_FAILED});
        }
      });
  };
};

export const secondDetailViewOpen = value => {
  return {
    type: VIEW_SECOND_DETAILS_SCREEN,
    payload: value,
  };
};
