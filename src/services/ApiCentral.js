import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import jwtDecode from 'jwt-decode';
import { BASE_URL, GET_NEW_TOKENS } from '../api/API';
import NavigationService from '../services/NavigationService';
import { authorize,refresh } from 'react-native-app-auth';
import moment from 'moment';

const request = async function (options, isHeader,headers) {
    let authHeader = null;

    if (isHeader) {
         let currentTime = moment().format();
         const accessTokenExpirationDate = parseInt(await AsyncStorage.getItem('accessTokenExpirationDate'));
         const refreshToken = await AsyncStorage.getItem('refreshToken');
         if ((Date.now() / 1000) >= accessTokenExpirationDate) {
            let config = {
                issuer : 'https://pmtool.devops.arimac.xyz/auth',
                serviceConfiguration  : {
                    authorizationEndpoint : 'https://pmtool.devops.arimac.xyz/auth/realms/pm-tool/protocol/openid-connect/auth',
                    tokenEndpoint  : 'https://pmtool.devops.arimac.xyz/auth/realms/pm-tool/protocol/openid-connect/token',
                },
                clientId : 'pmtool-frontend',
                redirectUrl  : 'io.identityserver.demo:/oauthredirect',
                scopes : ['openid', 'roles', 'profile'],
                dangerouslyAllowInsecureHttpRequests: true
            };
            const configLive = {
                issuer: 'https://project.arimaclanka.com/auth/realms/pm-tool',
                serviceConfiguration: {
                  authorizationEndpoint:
                    'https://project.arimaclanka.com/auth/realms/pm-tool/protocol/openid-connect/auth',
                  tokenEndpoint:
                    'https://project.arimaclanka.com/auth/realms/pm-tool/protocol/openid-connect/token',
                },
                clientId: 'pmtool-frontend',
                redirectUrl: 'com.arimacpmtool:/oauthredirect',
                scopes: ['openid', 'roles', 'profile'],
                dangerouslyAllowInsecureHttpRequests: true,
            };
            try {
                const result = await refresh(configLive, {
                    refreshToken: refreshToken,
                  });
                AsyncStorage.setItem('accessToken', result.accessToken);
                AsyncStorage.setItem('refreshToken', result.refreshToken);
                let decoded = jwtDecode(result.accessToken);
                let accessTokenExpirationDate = decoded.exp.toString();
                AsyncStorage.setItem(
                  'accessTokenExpirationDate',
                  accessTokenExpirationDate,
                );
            }catch (error) {
                AsyncStorage.clear();
                NavigationService.navigate('Splash'); 
            }
            authHeader = `Bearer ${await AsyncStorage.getItem('accessToken')}`;
            headers.Authorization = authHeader; 
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
