import React, { PureComponent } from 'react';
import {
  View,
  Platform
} from 'react-native';

import StyleManager from '../styles/StyleManager';

export default class Header extends PureComponent {
  constructor(props) {
    super(props);

    this._style = StyleManager.getStyle('Header');
  }

  render() {
    return (
      <View style={this._style}>
        {this.props.children}
      </View>
    );
  }

  static get currentHeight() {
    return Platform.OS === "ios" ? 64 : 56;
  }
}