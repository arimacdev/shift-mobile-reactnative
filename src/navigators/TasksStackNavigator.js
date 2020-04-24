import React from 'react';
import {createStackNavigator} from 'react-navigation-stack';

import Header from '../components/Header';
import DrawerTasksScreen from '../screens/App/TaskDrawer/DrawerTasksScreen';
import TasksTabScreen from '../screens/App/TaskDrawer/TasksTabScreen';
import SearchGruopTaskScreen from '../screens/App/TaskDrawer/SearchGruopTaskScreen';
import MyTasksTabScreen from '../screens/App/TaskDrawer/MyTask/MyTasksTabScreen';
import GroupTasksDetailsScreen from '../screens/App/TaskDrawer/GroupTasksDetailsScreen';

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
    MyTasksTabScreen: {
      screen: MyTasksTabScreen,
      navigationOptions: ({navigation}) => ({
        header: (
          <Header
            title={ 'My personal Tasks'
            }
            onPress={() => navigation.pop()}
          />
        ),
      }),
    },
    GroupTasksDetailsScreen: {
      screen: GroupTasksDetailsScreen,
      navigationOptions: ({navigation}) => ({
        header: null,
      }),
    },
  },
  {
    initialRouteName: 'DrawerTasksScreen',
  },
);
