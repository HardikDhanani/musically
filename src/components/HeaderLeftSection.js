import React, { Component } from 'react';
import {
  View
} from 'react-native';

import StyleManager from '../styles/StyleManager';

export default class HeaderLeftSection extends Component {
  render() {
    let style = StyleManager.getStyle('HeaderLeftSection');

    return (
      <View style={style}>
        {this.props.children}
      </View>
    );
  }
}