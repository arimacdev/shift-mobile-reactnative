import React, {Component} from 'react';

import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import ReduxThunk from 'redux-thunk';
import reducers from '../src/redux/reducers';
import NavigationService from './services/NavigationService';
import {MainSwitchNavigator} from './navigators/MainSwitchNavigator';
import {OfflineNotice} from './components/OfflineNotice';
import OneSignal from 'react-native-onesignal';
import strings from './config/strings';
import AsyncStorage from '@react-native-community/async-storage';
import ErrorModal from './components/ErrorModal';

console.disableYellowBox = true;

export default class App extends Component {
  constructor(properties) {
    super(properties);
    this.state = {};
    this.store = createStore(reducers, {}, applyMiddleware(ReduxThunk));
    //Remove this method to stop OneSignal Debugging
    // OneSignal.setLogLevel(6, 0);

    OneSignal.init(strings.oneSignal.oneSignalAppId, {
      kOSSettingsKeyAutoPrompt: false,
      kOSSettingsKeyInAppLaunchURL: false,
      kOSSettingsKeyInFocusDisplayOption: 2,
    });

    OneSignal.inFocusDisplaying(2); // Controls what should happen if a notification is received while the app is open. 2 means that the notification will go directly to the device's notification center.

    // The promptForPushNotifications function code will show the iOS push notification prompt. We recommend removing the following code and instead using an In-App Message to prompt for notification permission (See step below)
    OneSignal.promptForPushNotificationsWithUserResponse(
      this.myiOSPromptCallback,
    );

    OneSignal.addEventListener('received', this.onReceived);
    OneSignal.addEventListener('opened', this.onOpened);
    OneSignal.addEventListener('ids', this.onIds);
  }

  componentWillMount() {}

  componentWillUnmount() {
    OneSignal.removeEventListener('received', this.onReceived);
    OneSignal.removeEventListener('opened', this.onOpened);
    OneSignal.removeEventListener('ids', this.onIds);
  }

  onReceived(notification) {
    console.log('Notification received: ', notification);
  }

  async onOpened(openResult) {
    console.log('Message: ', openResult.notification.payload.body);
    console.log('Data: ', openResult.notification.payload.additionalData);
    console.log('isActive: ', openResult.notification.isAppInFocus);
    console.log('openResult: ', openResult);

    try {
      let baseURL = await AsyncStorage.getItem('baseURL');
      if (baseURL == null) {
        NavigationService.navigate('Auth');
      } else {
        let additionalData = openResult.notification.payload.additionalData;
        if (additionalData !== null) {
          NavigationService.navigate(additionalData.screen, {
            taskId: additionalData.taskId,
            id: additionalData.id,
            name: additionalData.name,
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  onIds(device) {
    console.log('Device info: ', device);
    AsyncStorage.setItem('userIdOneSignal', device.userId);
  }

  myiOSPromptCallback(permission) {
    // do something with permission value
  }

  render() {
    return (
      <Provider store={createStore(reducers, {}, applyMiddleware(ReduxThunk))}>
        {
          <MainSwitchNavigator
            ref={navigatorRef => {
              NavigationService.setTopLevelNavigator(navigatorRef);
            }}
          />
        }
        <OfflineNotice />
        <ErrorModal />
      </Provider>
    );
  }
}
