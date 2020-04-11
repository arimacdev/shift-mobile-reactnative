import React from 'react';
import {createStackNavigator} from 'react-navigation-stack';

import Header from '../components/Header';
import UsersScreen from '../screens/App/Users/UsersScreen';
import ViewUserScreen from '../screens/App/Users/ViewUserScreen';
import AddUserScreen from '../screens/App/Users/AddUserScreen';

export const UsersStackNavigator = createStackNavigator(
  {
    UsersScreen: {
      screen: UsersScreen,
      navigationOptions: ({navigation}) => ({
        header: <Header
              addButton={true}
              title='User'
              screen={'userList'}
              onPress={() => navigation.navigate('Projects')}
          />,
      }),
    },
    ViewUserScreen: {
      screen: ViewUserScreen,
      navigationOptions: ({ navigation }) => ({
          header: <Header
              title='View User'
              onPress={() => navigation.pop()}
          />,
      }),
    },
    AddUserScreen: {
      screen: AddUserScreen,
      navigationOptions: ({ navigation }) => ({
          header: <Header
              title='Creat new user'
              onPress={() => navigation.pop()}
          />,
      }),
    },
  },
  {
    initialRouteName: 'UsersScreen',
  },
);
