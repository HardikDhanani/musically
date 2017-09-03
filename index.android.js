import React, { Component } from 'react';
import { AppRegistry } from 'react-native'
import App from './App';

class Musically extends Component {
  render() {
    return (
      <App />
    );
  }
}

AppRegistry.registerComponent('musically', () => Musically);
