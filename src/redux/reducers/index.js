import {combineReducers} from 'redux';
import AuthReducer from './AuthReducer';
import ProjectsReducer from './ProjectsReducer';
import UsersReducer from './UsersReducer';
import fileUploadReducer from './FileUploadReducer';
import TasksReducer from './TasksReducer';
import OneSignalReducer from './OneSignalReducer';
import ShowMessageReducer from './ShowMessageReducer';
import {DESTROY_SESSION} from '../types';

const appReducer = combineReducers({
  auth: AuthReducer,
  project: ProjectsReducer,
  users: UsersReducer,
  fileUpload: fileUploadReducer,
  tasks: TasksReducer,
  oneSignal: OneSignalReducer,
  showMessage: ShowMessageReducer,
});

const rootReducer = (state, action) => {
  // Clear all data in redux store to initial.
  if (action.type === DESTROY_SESSION) state = undefined;

  return appReducer(state, action);
};
export default rootReducer;
