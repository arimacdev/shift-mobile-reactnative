import React from 'react';
import {createStackNavigator} from 'react-navigation-stack';

import Header from '../components/Header';
import WorkloadScreen from '../screens/App/WorkLoad/WorkloadScreen';
import WorkloadTabScreen from '../screens/App/WorkLoad/WorkloadTabScreen';
import WorkloadSearchScreen from '../screens/App/WorkLoad/WorkloadSearchScreen';
import WorkloadTasksDetailsScreen from '../screens/App/WorkLoad/WorkloadTasksDetailsScreen';

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
        header: null,
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
    WorkloadTasksDetailsScreen: {
      screen: WorkloadTasksDetailsScreen,
      navigationOptions: ({navigation}) => ({
        header: (
          <Header
            navigation={navigation}
            title={
              navigation.state.params
                ? navigation.state.params.workloadTasksDetails.taskName
                : ''
            }
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
