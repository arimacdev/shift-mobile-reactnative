import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';

import Header from '../components/Header';
import TasksScreen from '../screens/App/Tasks/TasksScreen';


export const TasksStackNavigator = createStackNavigator({
    TasksScreen: {
        screen: TasksScreen,
        navigationOptions: ({ navigation }) => ({
            header: <Header
                title='Tasks'
                onPress={() => navigation.navigate('Projects')}
            />,
        }),
    }
},
    {
        initialRouteName: 'TasksScreen',
    },
);

