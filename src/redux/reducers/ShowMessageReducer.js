import {SHOW_MESSAGE_POPUAP} from '../types';

const INITIAL_STATE = {
  showMessageConfig:{
    showAlert:false,
    title:'',
    msg:''
  }
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SHOW_MESSAGE_POPUAP:
      return {...state, showMessageConfig: action.payload};
    default:
      return state;
  }
};
