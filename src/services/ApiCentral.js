import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import jwtDecode from 'jwt-decode';
import { BASE_URL, GET_NEW_TOKENS } from '../api/API';
import NavigationService from '../services/NavigationService';

const request = async function (options, isHeader,type,isUserID,customeHeaderImageUpload) {
    let authHeader = null;
    let typeHeader = null;
    let userIDHeder = null;
    let headers = {};

    if (isHeader) {
        authHeader = `Bearer ${await AsyncStorage.getItem('accessToken')}`;
    }
    if (type) {
        typeHeader = 'project'
    }
    if (isUserID) {
        userIDHeder =  await AsyncStorage.getItem('userID');
    }

    if(customeHeaderImageUpload){
        headers =  {
            Authorization: authHeader,
            'Content-Type': 'multipart/form-data',
            user : userIDHeder,
        }
    }else{
        headers =  {
            Authorization: authHeader,
            Accept: 'application/json',
            'Content-Type': 'application/json',
            type : typeHeader,
            user : userIDHeder,
        }
    }


    const client = axios.create({
        baseURL: BASE_URL,
        headers: headers,
        timeout: 90000,
    });

    const onSuccess = function (response) {
        console.log('Request Successful!', response);
        console.log('Request Successful time --------------------',new Date())
        return response.data;
    };

    const onError = function (error) {
        console.log('Request Failed:', error.config);
        if (error.response) {
            console.log('Status:', error.response.status);
            console.log('Data:', error.response.data);
            console.log('Headers:', error.response.headers);
        } else {
            console.log('Error Message:', error.message);
        }
        return Promise.reject(error.response || error.message);
    };

    return client(options)
        .then(onSuccess)
        .catch(onError);
};

export default request;
