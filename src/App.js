

import React, {Component} from 'react';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import reducers from '../src/redux/reducers';
import NavigationService from './services/NavigationService';
import { MainSwitchNavigator } from './navigators/MainSwitchNavigator';

console.disableYellowBox = true;


export default class App extends Component {

  constructor(properties) {
    super(properties);
    this.state = {
    };
    this.store = createStore(reducers, {}, applyMiddleware(ReduxThunk));
  
  }
 
  componentWillMount(){
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
      </Provider>
    );
  }
}

