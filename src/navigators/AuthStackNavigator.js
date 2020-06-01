import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import Home from '../screens/Auth/Home';
import ConfigurationScreen from '../screens/Auth/ConfigurationScreen';
import LoginScreen from '../screens/Auth/LoginScreen';


export const AuthStackNavigator = createStackNavigator(
    {
        ConfigurationScreen: {
            screen: ConfigurationScreen,
            headerMode: 'Home',
            header: null,
            navigationOptions: {
                header: null,
                gesturesEnabled: false
            }
        },
        LoginScreen:{
            screen: LoginScreen,
            headerMode: 'Home',
            header: null,
            navigationOptions: {
                header: null,
                gesturesEnabled: false
            }
        }
    },
    {
        initialRouteName: 'ConfigurationScreen'
    }
);
