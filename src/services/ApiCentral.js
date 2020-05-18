import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import jwtDecode from 'jwt-decode';
import { BASE_URL, GET_NEW_TOKENS } from '../api/API';
import NavigationService from '../services/NavigationService';
import { authorize } from 'react-native-app-auth';
import moment from 'moment';


const request = async function (options, isHeader,headers) {
    let authHeader = null;

    if (isHeader) {
         let currentTime = moment().format();
         const expiresIn = await AsyncStorage.getItem('accessTokenExpirationDate');
         const refreshToken = await AsyncStorage.getItem('refreshToken');
         console.log(`Refresh Token : ${refreshToken}`); 
        //if(!(moment(expiresIn).isAfter(currentTime))){
        if(false){    
            let config= {
                issuer : 'https://pmtool.devops.arimac.xyz/auth',
                serviceConfiguration  : {
                    authorizationEndpoint : 'https://pmtool.devops.arimac.xyz/auth/realms/pm-tool/protocol/openid-connect/auth',
                    tokenEndpoint  : 'https://pmtool.devops.arimac.xyz/auth/realms/pm-tool/protocol/openid-connect/token',
                },
                clientId : 'pmtool-frontend',
                redirectUrl  : 'io.identityserver.demo:/oauthredirect',
                scopes : ['openid', 'roles', 'profile'],
                dangerouslyAllowInsecureHttpRequests: true
            }
            console.log(config);
            const result = await refresh(config, {
                refreshToken: refreshToken,
              });
            AsyncStorage.setItem('accessToken', result.accessToken);
            AsyncStorage.setItem('refreshToken', result.refreshToken);
            AsyncStorage.setItem('accessTokenExpirationDate', result.accessTokenExpirationDate);
        }else{
            authHeader = `Bearer ${await AsyncStorage.getItem('accessToken')}`;
            headers.Authorization = authHeader;
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
