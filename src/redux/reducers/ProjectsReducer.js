import {
    GET_ALL_PROJECTS_BY_USER,
    GET_ALL_PROJECTS_BY_USER_SUCCESS,
    GET_ALL_PROJECTS_BY_USER_FAILED,
} from '../types';

const INITIAL_STATE = {
    projectsLoading :  false,
    projects : []
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case GET_ALL_PROJECTS_BY_USER:
            return { ...state, projectsLoading: true};
        case GET_ALL_PROJECTS_BY_USER_SUCCESS:
            return { ...state, projectsLoading: false,projects:action.payload.data };
        case GET_ALL_PROJECTS_BY_USER_FAILED:
            return { ...state, projectsLoading: false };         
        default:
            return state;
    }
};
