import React from 'react';
import {createStackNavigator} from 'react-navigation-stack';

import Header from '../components/Header';
import UsersScreen from '../screens/App/Users/UsersScreen';

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
  },
  {
    initialRouteName: 'UsersScreen',
  },
);
