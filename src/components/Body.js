import React, { PureComponent } from 'react';

import { View } from 'react-native';
import StyleManager from '../styles/StyleManager';

export default class Body extends PureComponent {
  constructor(props) {
    super(props);

    this._style = StyleManager.getStyle(this.props.hasPaginationHeader ? 'HomeBody' : 'Body');
  }

  render() {
    return (
      <View style={this._style}>
        {this.props.children}
      </View>
    );
  }
}