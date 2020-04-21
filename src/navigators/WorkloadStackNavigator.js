import React from 'react';
import {createStackNavigator} from 'react-navigation-stack';

import Header from '../components/Header';
import WorkloadScreen from '../screens/App/WorkLoad/WorkloadScreen';

export const WorkloadStackNavigator = createStackNavigator(
  {
    WorkloadScreen: {
      screen: WorkloadScreen,
      navigationOptions: ({navigation}) => ({
        header: (
          <Header
            isHome
            navigation={navigation}
            title="Workload"
            onPress={() => navigation.openDrawer()}
          />
        ),
      }),
    },
  },
  {
    initialRouteName: 'WorkloadScreen',
  },
);
