import React, { Component } from 'react';
import {
  Text
} from 'react-native';

import StyleManager from '../styles/StyleManager';

export default class HeaderTitle extends Component {
  render() {
    let style = StyleManager.getStyle('HeaderTitle');
    
    return (
      <Text style={style}>
        {this.props.children}
      </Text>
    );
  }
}