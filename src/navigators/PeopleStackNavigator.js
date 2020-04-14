import React from 'react';
import {createStackNavigator} from 'react-navigation-stack';
import Header from '../components/Header';
import AddPeopleScreen from '../screens/App/People/AddPeopleScreen';

export const PeopleStackNavigator = createStackNavigator(
  {
    AddPeopleScreen: {
        screen: AddPeopleScreen,
        navigationOptions: ({ navigation }) => ({
            header: <Header
                title='Add People'
                onPress={() => navigation.pop()}
            />,
        }),
      },
  },
  {
    initialRouteName: 'AddPeopleScreen',
  },
);
