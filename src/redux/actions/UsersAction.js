import {
    GET_ALL_USERS,
    GET_ALL_USERS_SUCCESS,
    GET_ALL_USERS_FAILED,

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
