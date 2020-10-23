import React from 'react';
import {Dimensions} from 'react-native';
import {createDrawerNavigator} from 'react-navigation-drawer';
import EStyleSheet from 'react-native-extended-stylesheet';

import {ProjectsStackNavigator} from '../navigators/ProjectsStackNavigator';
import {UsersStackNavigator} from '../navigators/UsersStackNavigator';
import {TasksStackNavigator} from '../navigators/TasksStackNavigator';

import colors from '../config/colors';
import CustomDrawerContentComponent from '../components/CustomDrawerMenu';
import {WorkloadStackNavigator} from './WorkloadStackNavigator';

const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({$rem: entireScreenWidth / 380});

export const DrawerNavigator = createDrawerNavigator(
  {
    Projects: {
      screen: ProjectsStackNavigator,
      headerMode: 'none',
      header: null,
      navigationOptions: {
        drawerLabel: () => null,
        drawerIcon: () => null,
      },
    },
    Users: {
      screen: UsersStackNavigator,
      header: null,
      navigationOptions: ({navigation}) => ({
        header: null,
        drawerLabel: () => null,
        drawerIcon: () => null,
      }),
    },
    DrawerTask: {
      screen: TasksStackNavigator,
      header: null,
      navigationOptions: ({navigation}) => ({
        header: null,
        drawerLabel: () => null,
        drawerIcon: () => null,
      }),
    },
    Workload: {
      screen: WorkloadStackNavigator,
      header: null,
      navigationOptions: ({navigation}) => ({
        header: null,
        drawerLabel: () => null,
        drawerIcon: () => null,
      }),
    },
  },
  {
    initialRouteName: 'Projects',
    drawerType: 'front',
    drawerBackgroundColor: colors.drawerColor,
    backBehavior: 'none',
    contentComponent: CustomDrawerContentComponent,
    contentOptions: {
      activeTintColor: colors.drawerActiveItems,
      inactiveTintColor: colors.drawerInactiveItems,
      itemsContainerStyle: {
        marginVertical: 0,
        fontFamily: 'CircularStd-Black',
        fontSize: 19,
      },
      iconContainerStyle: {
        opacity: 1,
      },
    },
  },
);
