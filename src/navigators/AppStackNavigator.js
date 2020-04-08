import { createStackNavigator } from 'react-navigation-stack';
import { DrawerNavigator } from './DrawerNavigator';
import React from 'react';

export const AppStackNavigator = createStackNavigator(
    {
        DrawerNavigator: {
            screen: DrawerNavigator,
            headerMode: 'none',
            header: null,
            navigationOptions: {
                header: null
            }
        },
    },
    {
        initialRouteName: 'DrawerNavigator'
    }
);
