import {combineReducers} from 'redux';
import AuthReducer from './AuthReducer';
import ProjectsReducer from './ProjectsReducer';
import UsersReducer from './UsersReducer';
import fileUploadReducer from './FileUploadReducer';
import TasksReducer from './TasksReducer';
import OneSignalReducer from './OneSignalReducer';
import ShowMessageReducer from './ShowMessageReducer';

export default combineReducers({
  auth: AuthReducer,
  project: ProjectsReducer,
  users: UsersReducer,
  fileUpload: fileUploadReducer,
  tasks: TasksReducer,
  oneSignal: OneSignalReducer,
  showMessage: ShowMessageReducer,
});
