import React, { Component } from 'react';
import {
  View
} from 'react-native';

import StyleManager from '../styles/StyleManager';

export default class HeaderRightSection extends Component {
  render() {
    let style = StyleManager.getStyle('HeaderRightSection');

    return (
      <View style={style}>
        {this.props.children}
      </View>
    );
  }
}