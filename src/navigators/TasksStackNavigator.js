import React from 'react';
import {createStackNavigator} from 'react-navigation-stack';

import Header from '../components/Header';
import DrawerTasksScreen from '../screens/App/TaskDrawer/DrawerTasksScreen';
import TasksTabScreen from '../screens/App/TaskDrawer/TasksTabScreen';
import SearchGruopTaskScreen from '../screens/App/TaskDrawer/SearchGruopTaskScreen';
import MyTasksTabScreen from '../screens/App/TaskDrawer/MyTask/MyTasksTabScreen';
import GroupTasksDetailsScreen from '../screens/App/TaskDrawer/GroupTasksDetailsScreen';
import AddPeopleGroupTaskScreen from '../screens/App/TaskDrawer/AddPeopleScreen';
import GroupTaskNotesScreen from '../screens/App/TaskDrawer/GroupTaskNotesScreen';
import AssigneeScreenGroupTask from '../screens/App/TaskDrawer/AssigneeScreenGroupTask';
import MyTasksDetailsScreen from '../screens/App/TaskDrawer/MyTask/MyTasksDetailsScreen';
import MyTaskNotesScreen from '../screens/App/TaskDrawer/MyTask/MyTaskNotesScreen';
import MyTasksFilesScreen from '../screens/App/TaskDrawer/MyTask/MyTasksFilesScreen';
import MyTaskSubTaskScreen from '../screens/App/TaskDrawer/MyTask/MyTaskSubTaskScreen';
import MyTaskAddEditSubTaskScreen from '../screens/App/TaskDrawer/MyTask/MyTaskAddEditSubTaskScreen';
// import GroupSubTasksDetailsScreen from '../screens/App/TaskDrawer/GroupSubTasksDetailsScreen';

export const TasksStackNavigator = createStackNavigator(
  {
    DrawerTasksScreen: {
      screen: DrawerTasksScreen,
      navigationOptions: ({navigation}) => ({
        header: (
          <Header
            isHome
            isSearch={true}
            searchNavigation={'tasksScreen'}
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
            title={'My personal tasks'}
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
    GroupSubTasksDetailsScreen: {
      screen: GroupTasksDetailsScreen,
      navigationOptions: ({navigation}) => ({
        header: null,
      }),
    },
    AddPeopleGroupTaskScreen: {
      screen: AddPeopleGroupTaskScreen,
      navigationOptions: ({navigation}) => ({
        header: (
          <Header title={'Add People'} onPress={() => navigation.pop()} />
        ),
      }),
    },
    GroupTaskNotesScreen: {
      screen: GroupTaskNotesScreen,
      navigationOptions: ({navigation}) => ({
        header: (
          <Header
            navigation={navigation}
            title={'Notes'}
            onPress={() => navigation.goBack()}
          />
        ),
      }),
    },
    AssigneeScreenGroupTask: {
      screen: AssigneeScreenGroupTask,
      navigationOptions: ({navigation}) => ({
        header: (
          <Header
            search={true}
            title={'Edit Assignee'}
            onPress={() => navigation.goBack()}
          />
        ),
      }),
    },
    MyTasksDetailsScreen: {
      screen: MyTasksDetailsScreen,
      navigationOptions: ({navigation}) => ({
        header: null,
      }),
    },
    MyTaskNotesScreen: {
      screen: MyTaskNotesScreen,
      navigationOptions: ({navigation}) => ({
        header: (
          <Header
            navigation={navigation}
            title={'Notes'}
            onPress={() => navigation.goBack()}
          />
        ),
      }),
    },
    MyTasksFilesScreen: {
      screen: MyTasksFilesScreen,
      navigationOptions: ({navigation}) => ({
        header: (
          <Header
            navigation={navigation}
            title={'Files'}
            onPress={() => navigation.goBack()}
          />
        ),
      }),
    },
    MyTaskSubTaskScreen: {
      screen: MyTaskSubTaskScreen,
      navigationOptions: ({navigation}) => ({
        header: (
          <Header
            navigation={navigation}
            title={'Sub tasks'}
            onPress={() => navigation.goBack()}
          />
        ),
      }),
    },
    MyTaskAddEditSubTaskScreen: {
      screen: MyTaskAddEditSubTaskScreen,
      navigationOptions: ({navigation}) => ({
        header: (
          <Header
            navigation={navigation}
            title={'Sub Task'}
            onPress={() => navigation.goBack()}
          />
        ),
      }),
    },
    // GroupSubTasksDetailsScreen: {
    //   screen: GroupSubTasksDetailsScreen,
    //   navigationOptions: ({navigation}) => ({
    //     header: null,
    //   }),
    // },
  },
  {
    initialRouteName: 'DrawerTasksScreen',
  },
);
