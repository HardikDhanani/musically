import React, { PureComponent } from 'react';
import { TouchableOpacity, Text } from 'react-native';

import Styles from '../styles/Styles';

export default class Button extends PureComponent {
  render() {
    let style = Styles.getButtonStyle();
    return (
      <TouchableOpacity ref={this.props.onRef} style={[style.button, this.props.style]} onPress={this.props.onPress}>
        {this.props.children}
        {this.props.icon ? <Text style={[style.text, this.props.textStyle]}>{this.props.text}</Text> : null}
        {this.props.text ? <Text style={[style.text, this.props.textStyle]}>{this.props.text}</Text> : null}
      </TouchableOpacity>
    );
  }
}