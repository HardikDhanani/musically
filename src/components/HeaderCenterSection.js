import React, { Component } from 'react';
import {
  View
} from 'react-native';

import StyleManager from '../styles/StyleManager';

export default class HeaderCenterSection extends Component {
  render() {
    let style = StyleManager.getStyle('HeaderCenterSection');

    return (
      <View style={style}>
        {this.props.children}
      </View>
    );
  }
}