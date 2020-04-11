import {
    GET_ALL_USERS,
    GET_ALL_USERS_SUCCESS,
    GET_ALL_USERS_FAILED,

    ADD_USER,
    ADD_USER_SUCCESS,
    ADD_USER_FAILED,
    ADD_USER_FAILED_MESSAGE
} from '../types';

const INITIAL_STATE = {
    usersLoading :  false,
    users : [],

    addUserLoading: false,
    addUserError : false,
    addUserErrorMessage : '',
    addUserSuccess : false,
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
        // add user    
        case ADD_USER:
            return { ...state, addUserLoading: true,addUserSuccess: false,addUserError:false,addUserErrorMessage:''};
        case ADD_USER_SUCCESS:
           return { ...state, addUserLoading: false,addUserSuccess: true,addUserError:false,addUserErrorMessage:''};
        case ADD_USER_FAILED:
           return { ...state, addUserLoading: false,addUserSuccess: false,addUserError:true,addUserErrorMessage:''};
        case ADD_USER_FAILED_MESSAGE:
           return { ...state, addUserLoading: false,addUserSuccess: false,addUserError:true,addUserErrorMessage:action.payload}                
        default:
            return state;
    }
};
