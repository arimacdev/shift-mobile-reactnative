import React from 'react';
import {createStackNavigator} from 'react-navigation-stack';

import Header from '../components/Header';
import TasksScreen from '../screens/App/Tasks/TasksScreen';
import TasksDetailsScreen from '../screens/App/Tasks/TasksDetailsScreen';

export const TasksStackNavigator = createStackNavigator(
  {
    TasksScreen: {
      screen: TasksScreen,
      navigationOptions: ({navigation}) => ({
        header: (
          <Header
            title={
              navigation.state.params
                ? navigation.state.params.projDetails.projName
                : ''
            }
            onPress={() => navigation.navigate('Projects')}
          />
        ),
      }),
    },
    TasksDetailsScreen: {
      screen: TasksDetailsScreen,
      navigationOptions: ({navigation}) => ({
        header: (
          <Header
            title={
              navigation.state.params
                ? navigation.state.params.projDetails.projName
                : ''
            }
            onPress={() => navigation.navigate('Projects')}
          />
        ),
      }),
    },
  },
  {
    initialRouteName: 'TasksScreen',
  },
);
