import {
    GET_ALL_USERS,
    GET_ALL_USERS_SUCCESS,
    GET_ALL_USERS_FAILED,

    ADD_USER,
    ADD_USER_SUCCESS,
    ADD_USER_FAILED,
    ADD_USER_FAILED_MESSAGE,

    EDIT_USER,
    EDIT_USER_SUCCESS,
    EDIT_USER_FAILED,
    EDIT_USER_FAILED_MESSAGE,

    USER_DATA_SUCCESS,
    USER_TYPE_DATA_SUCCESS

} from '../types';
import APIServices from '../../services/APIServices';

export const getAllUsers =  () => {
    return (dispatch) => {
        dispatch({ type: GET_ALL_USERS });
        APIServices.getAllUsersData().then(response => {
            if(response.message == 'success'){
                dispatch({ 
                    type: GET_ALL_USERS_SUCCESS,
                    payload: response});  
            }else{
                dispatch({ type: GET_ALL_USERS_FAILED});  
            }    
        }).catch(error => {   
            dispatch({ type: GET_ALL_USERS_FAILED});  
        });
    };
};

export const addUser =  (firstName,lastName,userName,email,password,confirmPassword) => {
    return (dispatch) => {
        dispatch({ type: ADD_USER });
        APIServices.addUserData(firstName,lastName,userName,email,password,confirmPassword).then(response => {
            if(response.message == 'success'){
                dispatch({ 
                    type: ADD_USER_SUCCESS
                });  
            }else{
                dispatch({ type: ADD_USER_FAILED});  
            }    
        }).catch(error => {
            if(error.status == 500){
                let errorMsg = JSON.parse(error.data.message).errorMessage
                dispatch({ 
                    type: ADD_USER_FAILED_MESSAGE,
                    payload : errorMsg
                });
            }else{
                dispatch({ type: ADD_USER_FAILED});  
            }
           
        });
    };
};

export const editUser =  (firstName,lastName,userName,email,password,confirmPassword,userID) => {
    return (dispatch) => {
        dispatch({ type: EDIT_USER });
        APIServices.editUserData(firstName,lastName,userName,email,password,confirmPassword,userID).then(response => {
            if(response.message == 'success'){
                dispatch({ 
                    type: EDIT_USER_SUCCESS
                });  
            }else{
                dispatch({ type: EDIT_USER_FAILED});  
            }    
        }).catch(error => {
            if(error.status == 500){
                let errorMsg = JSON.parse(error.data.message).errorMessage
                dispatch({ 
                    type: EDIT_USER_FAILED_MESSAGE,
                    payload : errorMsg
                });
            }else{
                dispatch({ type: EDIT_USER_FAILED});  
            }
           
        });
    };
};

export const UserInfoSuccess = (data) => {
    return {
        type: USER_DATA_SUCCESS,
        payload : data,
    };
};

export const UserType = (data) => {
    return {
        type: USER_TYPE_DATA_SUCCESS,
        payload : data,
    };
};
