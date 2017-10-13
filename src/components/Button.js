import React, { PureComponent } from 'react';
import { TouchableOpacity, Text } from 'react-native';

import StyleManager from '../styles/StyleManager';

export default class Button extends PureComponent {
  render() {
    let buttonStyle = StyleManager.getStyle('HeaderButton');
    let textButtonStyle = StyleManager.getStyle('HeaderButtonText');

    return (
      <TouchableOpacity ref={this.props.onRef} style={buttonStyle} onPress={this.props.onPress}>
        {this.props.children}
        {this.props.icon ? <Text style={textButtonStyle}>{this.props.text}</Text> : null}
        {this.props.text ? <Text style={textButtonStyle}>{this.props.text}</Text> : null}
      </TouchableOpacity>
    );
  }
}