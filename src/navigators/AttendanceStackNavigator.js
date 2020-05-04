import React from 'react';
import {createStackNavigator} from 'react-navigation-stack';

import Header from '../components/Header';
import AttendanceScreen from '../screens/App/Attendance/AttendanceScreen';

export const AttendanceStackNavigator = createStackNavigator(
  {
    AttendanceScreen: {
      screen: AttendanceScreen,
      navigationOptions: ({navigation}) => ({
        header: (
          <Header
            isHome
            searchNavigation={'AttendanceScreen'}
            navigation={navigation}
            title="Workload"
            onPress={() => navigation.openDrawer()}
          />
        ),
      }),
    },
    
  {
    initialRouteName: 'AttendanceScreen',
  },
);
