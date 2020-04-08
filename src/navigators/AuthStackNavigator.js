import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import LoginScreen from '../screens/Auth/LoginScreen';


export const AuthStackNavigator = createStackNavigator(
    {
        LoginScreen: {
            screen: LoginScreen,
            headerMode: 'Login',
            header: null,
            navigationOptions: {
                header: null,
                gesturesEnabled: false
            }
        },
    },
    {
        initialRouteName: 'LoginScreen'
    }
);
