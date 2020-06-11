import React from 'react';
import {createStackNavigator} from 'react-navigation-stack';

import Header from '../components/Header';
import UsersScreen from '../screens/App/Users/UsersScreen';
import ViewUserScreen from '../screens/App/Users/ViewUserScreen';
import AddUserScreen from '../screens/App/Users/AddUserScreen';
import EditUserScreen from '../screens/App/Users/EditUserScreen';
import SearchUserScreen from '../screens/App/Users/SearchUserScreen';

export const UsersStackNavigator = createStackNavigator(
  {
    UsersScreen: {
      screen: UsersScreen,
      navigationOptions: ({navigation}) => ({
        header: (
          <Header
            isHome
            isUser
            isSearch={true}
            searchNavigation={'userScreen'}
            isAddNew={true}
            addNewNavigation={'userScreen'}
            navigation={navigation}
            title="User"
            screen={'userList'}
            onPress={() => navigation.openDrawer()}
          />
        ),
      }),
    },
    ViewUserScreen: {
      screen: ViewUserScreen,
      navigationOptions: ({navigation}) => ({
        header: <Header title="View user" onPress={() => navigation.pop()} />,
      }),
    },
    AddUserScreen: {
      screen: AddUserScreen,
      navigationOptions: ({navigation}) => ({
        header: (
          <Header title="Create new user" onPress={() => navigation.pop()} />
        ),
      }),
    },
    EditUserScreen: {
      screen: EditUserScreen,
      navigationOptions: ({navigation}) => ({
        header: <Header title="Edit user" onPress={() => navigation.pop()} />,
      }),
    },
    SearchUserScreen: {
      screen: SearchUserScreen,
      navigationOptions: ({navigation}) => ({
        header: (
          <Header
            title="Search User"
            navigation={navigation}
            onPress={() => navigation.pop()}
          />
        ),
      }),
    },
  },
  {
    initialRouteName: 'UsersScreen',
  },
);
