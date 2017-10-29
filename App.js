import React, { Component } from 'react';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import ThemeManager from './src/services/ThemeManager';

import reducer from './src/redux/reducers/index';
import Root from './src/containers/Root';

const store = createStore(
  reducer,
  applyMiddleware(
    thunk
  )
)

export default class App extends Component {
  constructor(props) {
    super(props);

    ThemeManager.init();
  }
  
  render() {
    return (
      <Provider store={store}>
        <Root />
      </Provider>
    );
  }
}
