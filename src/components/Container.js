import React, { Component } from 'react';
import {
  View
} from 'react-native';

import StyleManager from '../styles/StyleManager';

export default class Container extends Component {
  constructor(props) {
    super(props);

    this._style = StyleManager.getStyle('Container');
  }

  render() {
    return (
      <View style={this._style}>
        {this.props.children}
      </View>
    );
  }
}