import {SHOW_MESSAGE_POPUAP} from '../types';

export const showMessagePopup = config => {
  return {
    type: SHOW_MESSAGE_POPUAP,
    payload: config,
  };
};
