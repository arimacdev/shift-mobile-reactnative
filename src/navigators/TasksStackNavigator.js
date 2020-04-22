import React from 'react';
import {createStackNavigator} from 'react-navigation-stack';

import Header from '../components/Header';
import DrawerTasksScreen from '../screens/App/TaskDrawer/DrawerTasksScreen';
import TasksTabScreen from '../screens/App/TaskDrawer/TasksTabScreen';

export const TasksStackNavigator = createStackNavigator(
  {
    DrawerTasksScreen: {
      screen: DrawerTasksScreen,
      navigationOptions: ({navigation}) => ({
        header: (
          <Header
            isHome
            isSearch = {true}
            searchNavigation = {'tasksScreen'}
            navigation={navigation}
            title="Tasks"
            onPress={() => navigation.openDrawer()}
          />
        ),
      }),
    },
    TasksTabScreen: {
      screen: TasksTabScreen,
      navigationOptions: ({navigation}) => ({
        header: (
          <Header
            title={
              navigation.state.params
                ? navigation.state.params.taskDetails.taskGroupName
                : ''
            }
            onPress={() => navigation.pop()}
          />
        ),
      }),
    },
  },
  {
    initialRouteName: 'DrawerTasksScreen',
  },
);
