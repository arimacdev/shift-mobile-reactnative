import { combineReducers } from 'redux';
import AuthReducer from './AuthReducer';
import ProjectsReducer from './ProjectsReducer';
import UsersReducer from './UsersReducer';
import fileUploadReducer from './FileUploadReducer';
import TasksReducer from './TasksReducer';

export default combineReducers({
    auth : AuthReducer,
    project : ProjectsReducer,
    users : UsersReducer,
    fileUpload: fileUploadReducer,
    tasks : TasksReducer,
});
