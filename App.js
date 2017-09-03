import React, { Component } from 'react';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import reducer from './src/redux/reducers/index';
import Root from './src/containers/Root';

const store = createStore(
  reducer,
  applyMiddleware(
    thunk
  )
)

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Root />
      </Provider>
    );
  }
}
