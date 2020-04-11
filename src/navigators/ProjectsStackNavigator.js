import React from 'react';
import {createStackNavigator} from 'react-navigation-stack';

import Header from '../components/Header';
import ProjectsScreen from '../screens/App/Projects/ProjectsScreen';
import CreateNewProjectScreen from '../screens/App/Projects/CreateNewProjectScreen';
import ProjectsSearchScreen from '../screens/App/Projects/ProjectsSearchScreen';
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
    CreateNewProjectScreen: {
      screen: CreateNewProjectScreen,
      navigationOptions: ({navigation}) => ({
        header: (
          <Header
            title={'Create new project'}
            onPress={() => navigation.navigate('ProjectsScreen')}
          />
        ),
      }),
    },
    ProjectsSearchScreen: {
      screen: ProjectsSearchScreen,
      navigationOptions: ({navigation}) => ({
        header: (
          <Header
            search={true}
            title={'Search'}
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
