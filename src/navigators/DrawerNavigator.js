import React from 'react';
import { View, Dimensions,Image } from 'react-native';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { Icon } from 'native-base';
import EStyleSheet from 'react-native-extended-stylesheet';

import { ProjectsStackNavigator } from '../navigators/ProjectsStackNavigator';
import { UsersStackNavigator } from '../navigators/UsersStackNavigator';
import { TasksStackNavigator } from '../navigators/TasksStackNavigator';

import colors from '../config/colors';
import Header from '../components/Header';
import CustomDrawerContentComponent from '../components/CustomDrawerMenu';
import { WorkloadStackNavigator } from './WorkloadStackNavigator';
import icons from '../assest/icons/icons';


const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({ $rem: entireScreenWidth / 380 });


export const DrawerNavigator = createDrawerNavigator(
    {

        Projects: {
            screen: ProjectsStackNavigator,
            headerMode: 'none',
            header: null,
            navigationOptions: {
                drawerLabel: 'Projects ',
                drawerIcon: ({ tintColor }) => (
                    <Image
                        source={require('../asserts/img/drawer_projects.png')}
                        style={{ width:  EStyleSheet.value('25rem'),height:EStyleSheet.value('25rem')}}
                    />
                ),
            }
        },
        Users: {
            screen: UsersStackNavigator,
            header: null,
            navigationOptions: ({ navigation }) => ({
                header: null,
                drawerLabel:  () => null,
                drawerIcon:  () => null
            }),
        },
        DrawerTask: {
            screen: TasksStackNavigator,
            header: null,
            navigationOptions: ({ navigation }) => ({
                header: null,
                drawerLabel:  () => null,
                drawerIcon:  () => null
            }),
        },
        Workload: {
            screen: WorkloadStackNavigator,
            header: null,
            navigationOptions: ({ navigation }) => ({
                header: null,
                drawerLabel:  () => null,
                drawerIcon:  () => null
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
                fontSize: 19
            },
            iconContainerStyle: {
                opacity: 1
            }
        }
    }
);

