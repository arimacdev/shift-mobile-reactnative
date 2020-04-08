import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';

import Header from '../components/Header';
import ProjectsScreen from '../screens/App/Projects/ProjectsScreen';


export const ProjectsStackNavigator = createStackNavigator({
    ProjectsScreen: {
        screen: ProjectsScreen,
        navigationOptions: ({ navigation }) => ({
            header: <Header
                isHome
                title='Projects'
                onPress={() =>  navigation.openDrawer()}
            />,
        }),
    }
},
    {
        initialRouteName: 'ProjectsScreen',
    },
);

