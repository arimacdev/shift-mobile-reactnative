import React from 'react';
import {createStackNavigator} from 'react-navigation-stack';

import Header from '../components/Header';
import ProjectsScreen from '../screens/App/Projects/ProjectsScreen';
import CreateNewProject from '../screens/App/Projects/CreateNewProject';
import icons from '../assest/icons/icons';

import {TouchableOpacity, Image} from 'react-native';

export const ProjectsStackNavigator = createStackNavigator(
  {
    ProjectsScreen: {
      screen: ProjectsScreen,
      navigationOptions: ({navigation}) => ({
        header: (
          <Header
            isHome
            navigation={navigation}
            title="Projects"
            onPress={() => navigation.openDrawer()}
          />
        ),
      }),
    },
    CreateNewProject: {
      screen: CreateNewProject,
      navigationOptions: ({navigation}) => ({
        header: (
          <Header
            title={'Create new project'}
            onPress={() => navigation.navigate('ProjectsScreen')}
          />
        ),
      }),
    },
  },
  {
    initialRouteName: 'ProjectsScreen',
  },
);
