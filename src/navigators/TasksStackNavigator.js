import React from 'react';
import {createStackNavigator} from 'react-navigation-stack';

import Header from '../components/Header';
import DrawerTasksScreen from '../screens/App/TaskDrawer/DrawerTasksScreen';
import TasksTabScreen from '../screens/App/TaskDrawer/TasksTabScreen';
import SearchGruopTaskScreen from '../screens/App/TaskDrawer/SearchGruopTaskScreen';

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
    SearchGruopTaskScreen: {
      screen: SearchGruopTaskScreen,
      navigationOptions: ({navigation}) => ({
        header: (
          <Header
            title={'Search'}
            onPress={() => navigation.navigate('DrawerTasksScreen')}
          />
        ),
      }),
    },
  },
  {
    initialRouteName: 'DrawerTasksScreen',
  },
);
