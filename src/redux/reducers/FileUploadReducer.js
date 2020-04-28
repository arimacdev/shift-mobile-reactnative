import {
  SET_UPLOAD_PROGRESS,
  SUCCESS_UPLOAD_FILE,
  FAILURE_UPLOAD_FILE,
} from '../types';

const INITIAL_STATE = {
  fileProgress: {
    1: {
      uri: '',
      file:[],
      progress: 0,
      cancelSource: '',
      status: 0,
    },
  },
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_UPLOAD_PROGRESS:
      return {
        ...state,
        fileProgress: {
          ...state.fileProgress,
          [action.payload.uri]: {
            ...state.fileProgress[action.payload.uri],
            progress: action.payload.progress,
          },
        },
      };

    case SUCCESS_UPLOAD_FILE:
      return {
        ...state,
        fileProgress: {
          ...state.fileProgress,
          [action.payload]: {
            ...state.fileProgress[action.payload],
            status: 1,
          },
        },
      };

    case FAILURE_UPLOAD_FILE:
      return {
        ...state,
        fileProgress: {
          ...state.fileProgress,
          [action.payload]: {
            ...state.fileProgress[action.payload],
            status: 0,
            progress: 0,
          },
        },
      };
    default:
      return state;
  }
};
