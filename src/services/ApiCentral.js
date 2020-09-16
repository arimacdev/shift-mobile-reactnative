import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import jwtDecode from 'jwt-decode';
import {BASE_URL} from '../api/API';
import NavigationService from '../services/NavigationService';
import {refresh} from 'react-native-app-auth';

const request = async function(options, isHeader, headers) {
  let authHeader = null;

  if (isHeader) {
    const accessTokenExpirationDate = parseInt(
      await AsyncStorage.getItem('accessTokenExpirationDate'),
    );
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    const issuer = await AsyncStorage.getItem('issuer');
    const authorizationEndpoint = await AsyncStorage.getItem(
      'authorizationEndpoint',
    );
    const tokenEndpoint = await AsyncStorage.getItem('tokenEndpoint');
    if (Date.now() / 1000 >= accessTokenExpirationDate) {
      const config = {
        issuer: issuer,
        serviceConfiguration: {
          authorizationEndpoint: authorizationEndpoint,
          tokenEndpoint: tokenEndpoint,
        },
        clientId: 'pmtool-frontend',
        redirectUrl: 'com.arimacpmtool:/oauthredirect',
        scopes: ['openid', 'roles', 'profile'],
        dangerouslyAllowInsecureHttpRequests: true,
      };
      try {
        const result = await refresh(config, {
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
      } catch (error) {
        AsyncStorage.clear();
        NavigationService.navigate('Splash');
      }
      authHeader = `Bearer ${await AsyncStorage.getItem('accessToken')}`;
      headers.Authorization = authHeader;
    } else {
      authHeader = `Bearer ${await AsyncStorage.getItem('accessToken')}`;
      headers.Authorization = authHeader;
    }
  }

  const client = axios.create({
    baseURL: BASE_URL,
    headers: headers,
    timeout: 90000,
  });

  const onSuccess = function(response) {
    console.log('Request Successful!', response);
    console.log('Request Successful time --------------------', new Date());
    return response.data;
  };

  const onError = function(error) {
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
