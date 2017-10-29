import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';

import {
  TouchableOpacity,
  Text
} from 'react-native';

const styles = EStyleSheet.create({
  button: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 30,
    color: '$headerColor'
  }
});

class Button extends PureComponent {
  render() {
    return (
      <TouchableOpacity ref={this.props.onRef} style={styles.button} onPress={this.props.onPress}>
        {this.props.children}
        {this.props.icon ? <Text style={styles.buttonText}>{this.props.text}</Text> : null}
        {this.props.text ? <Text style={styles.buttonText}>{this.props.text}</Text> : null}
      </TouchableOpacity>
    );
  }
}

Button.propTypes = {
  icon: PropTypes.string,
  text: PropTypes.string,
  onRef: PropTypes.func,
  onPress: PropTypes.func
};

export default Button;