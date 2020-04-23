import React from 'react';
import {createStackNavigator} from 'react-navigation-stack';

import Header from '../components/Header';
import WorkloadScreen from '../screens/App/WorkLoad/WorkloadScreen';
import WorkloadTabScreen from '../screens/App/WorkLoad/WorkloadTabScreen';
import WorkloadSearchScreen from '../screens/App/WorkLoad/WorkloadSearchScreen';

export const WorkloadStackNavigator = createStackNavigator(
  {
    WorkloadScreen: {
      screen: WorkloadScreen,
      navigationOptions: ({navigation}) => ({
        header: (
          <Header
            isHome
            isWorkload={true}
            isSearch={true}
            searchNavigation={'workLoadScreen'}
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
            title={
              navigation.state.params
                ? navigation.state.params.workloadTaskDetails.firstName +
                  ' ' +
                  navigation.state.params.workloadTaskDetails.lastName
                : ''
            }
            onPress={() => navigation.goBack()}
          />
        ),
      }),
    },
    WorkloadSearchScreen: {
      screen: WorkloadSearchScreen,
      navigationOptions: ({navigation}) => ({
        header: (
          <Header
            navigation={navigation}
            title={'Workload Search'}
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
