import {SET_ON_SIGNAL_NOTIFICATION_DATA} from '../types';

const INITIAL_STATE = {
  oneSignalNotificationData: [],
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_ON_SIGNAL_NOTIFICATION_DATA:
      return {...state, oneSignalNotificationData: action.payload};
    default:
      return state;
  }
};
