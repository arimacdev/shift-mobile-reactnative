import React from 'react';
import {createStackNavigator} from 'react-navigation-stack';

import Header from '../components/Header';
import WorkloadScreen from '../screens/App/WorkLoad/WorkloadScreen';
import WorkloadTabScreen from '../screens/App/WorkLoad/WorkloadTabScreen';

export const WorkloadStackNavigator = createStackNavigator(
  {
    WorkloadScreen: {
      screen: WorkloadScreen,
      navigationOptions: ({navigation}) => ({
        header: (
          <Header
            isHome
            isWorkload={true}
            navigation={navigation}
            title="Workload"
            onPress={() => navigation.openDrawer()}
          />
        ),
      }),
    },
    WorkloadTabScreen: {
      screen: WorkloadTabScreen,
      navigationOptions: ({navigation}) => ({
        header: (
          <Header
            navigation={navigation}
            title="Workload"
            onPress={() => navigation.goBack()}
          />
        ),
      }),
    },
  },
  {
    initialRouteName: 'WorkloadScreen',
  },
);
