import { combineReducers } from 'redux';
import AuthReducer from './AuthReducer';
import ProjectsReducer from './ProjectsReducer';

export default combineReducers({
    auth : AuthReducer,
    project : ProjectsReducer,
});
