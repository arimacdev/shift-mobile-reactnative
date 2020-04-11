import React from 'react';
import {createStackNavigator} from 'react-navigation-stack';

import Header from '../components/Header';
import UsersScreen from '../screens/App/Users/UsersScreen';
import ViewUserScreen from '../screens/App/Users/ViewUserScreen';

export const UsersStackNavigator = createStackNavigator(
  {
    UsersScreen: {
      screen: UsersScreen,
      navigationOptions: ({navigation}) => ({
        header: (
          <Header
             onPress={() => navigation.navigate('Projects')}
          />
        ),
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
  }
  },
  {
    initialRouteName: 'UsersScreen',
  },
);
