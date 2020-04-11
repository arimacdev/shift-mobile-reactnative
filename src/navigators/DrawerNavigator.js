import React from 'react';
import { View, Dimensions } from 'react-native';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { Icon } from 'native-base';
import EStyleSheet from 'react-native-extended-stylesheet';

import { ProjectsStackNavigator } from '../navigators/ProjectsStackNavigator';
import { UsersStackNavigator } from '../navigators/UsersStackNavigator';
import { TasksStackNavigator } from '../navigators/TasksStackNavigator';

import colors from '../config/colors';
import Header from '../components/Header';
import CustomDrawerContentComponent from '../components/CustomDrawerMenu';


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
                    <Icon name={'folder'} type={'Feather'} style={{ fontSize: EStyleSheet.value('22rem'), color: '#FFFFFF' }} />
                ),
            }
        },
        Users: {
            screen: UsersStackNavigator,
            header: null,
            navigationOptions: ({ navigation }) => ({
                header: null,
                drawerLabel: 'Users ',
                drawerIcon: ({ tintColor }) => (
                    <Icon name={'monitor'} type={'Feather'} style={{ fontSize: EStyleSheet.value('22rem'), color: '#FFFFFF' }} />
                ),
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
            },
            iconContainerStyle: {
                opacity: 1
            }
        }
    }
);

