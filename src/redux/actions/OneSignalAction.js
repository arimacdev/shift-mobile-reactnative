import {SET_ON_SIGNAL_NOTIFICATION_DATA} from '../types';

export const setOneSignalNotificationData = value => {
  return {
    type: SET_ON_SIGNAL_NOTIFICATION_DATA,
    payload: value,
  };
};
