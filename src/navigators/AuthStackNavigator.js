import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import Home from '../screens/Auth/Home';


export const AuthStackNavigator = createStackNavigator(
    {
        Home: {
            screen: Home,
            headerMode: 'Home',
            header: null,
            navigationOptions: {
                header: null,
                gesturesEnabled: false
            }
        },
    },
    {
        initialRouteName: 'Home'
    }
);
