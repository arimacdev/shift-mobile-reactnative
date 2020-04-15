import React from 'react';
import {createStackNavigator} from 'react-navigation-stack';

import Header from '../components/Header';
import ProjectsScreen from '../screens/App/Projects/ProjectsScreen';
import CreateNewProjectScreen from '../screens/App/Projects/CreateNewProjectScreen';
import ProjectsSearchScreen from '../screens/App/Projects/ProjectsSearchScreen';
import EditProjectScreen from '../screens/App/Projects/EditProjectScreen';
import AddPeopleScreen from '../screens/App/People/AddPeopleScreen';
import EditPeople from '../screens/App/People/EditPeople';
import icons from '../assest/icons/icons';

import {TouchableOpacity, Image} from 'react-native';
import TasksScreen from '../screens/App/Tasks/TasksScreen';
import TasksDetailsScreen from '../screens/App/Tasks/TasksDetailsScreen';
import AssigneeScreen from '../screens/App/Tasks/AssigneeScreen';
import SubTaskScreen from '../screens/App/Tasks/SubTaskScreen';
import FilesScreen from '../screens/App/Tasks/FilesScreen';
import ChatScreen from '../screens/App/Tasks/ChatScreen';

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
    TasksScreen: {
      screen: TasksScreen,
      navigationOptions: ({navigation}) => ({
        header: (
          <Header
            title={
              navigation.state.params
                ? navigation.state.params.projDetails.projectName
                : ''
            }
            onPress={() => navigation.pop()}
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
    EditProjectScreen: {
      screen: EditProjectScreen,
      navigationOptions: ({navigation}) => ({
        header: (
          <Header
            title={'Edit Project'}
            onPress={() => navigation.pop()}
          />
        ),
      }),
    },
    AddPeopleScreen: {
      screen: AddPeopleScreen,
      navigationOptions: ({navigation}) => ({
        header: (
          <Header
            title={'Add People'}
            onPress={() => navigation.pop()}
          />
        ),
      }),
    },
    EditPeople: {
      screen: EditPeople,
      navigationOptions: ({navigation}) => ({
        header: (
          <Header
            title={'Edit People'}
            onPress={() => navigation.goBack()}
          />
        ),
      }),
    },
    AssigneeScreen: {
      screen: AssigneeScreen,
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
    TasksDetailsScreen: {
      screen: TasksDetailsScreen,
      navigationOptions: ({navigation}) => ({
        header: (
          <Header
            isTasks={false}
            navigation={navigation}
            title={'Task Details'
              // navigation.state.params
              //   ? navigation.state.params.taskDetails.taskName
              //   : ''
            }
            onPress={() => navigation.goBack()}
          />
        ),
      }),
    },
    SubTaskScreen: {
      screen: SubTaskScreen,
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
    FilesScreen: {
      screen: FilesScreen,
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
    ChatScreen: {
      screen: ChatScreen,
      navigationOptions: ({navigation}) => ({
        header: (
          <Header
            navigation={navigation}
            title={'Chat'}
            onPress={() => navigation.goBack()}
          />
        ),
      }),
    },
  },
  {
    initialRouteName: 'ProjectsScreen',
  },
);
