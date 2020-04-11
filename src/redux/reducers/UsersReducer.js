import {
    GET_ALL_USERS,
    GET_ALL_USERS_SUCCESS,
    GET_ALL_USERS_FAILED,
} from '../types';

const INITIAL_STATE = {
    usersLoading :  false,
    users : [],
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        // all users
        case GET_ALL_USERS:
            return { ...state, usersLoading: true};
        case GET_ALL_USERS_SUCCESS:
            return { ...state, usersLoading: false,users:action.payload.data };
        case GET_ALL_USERS_FAILED:
            return { ...state, usersLoading: false };                
        default:
            return state;
    }
};
