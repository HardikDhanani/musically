import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';

import {
  TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const styles = EStyleSheet.create({
  buttonContainer: {
    position: 'absolute',
    height: '$headerHeight',
    width: '$headerHeight',
    borderRadius: 100,
    backgroundColor: '$elementActive',
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    color: '$headerColor',
    backgroundColor: 'transparent',
    fontSize: 40
  }
});

class MixButton extends PureComponent {
  render() {
    return (
      <TouchableOpacity style={[styles.buttonContainer, this.props.style]} onPress={this.props.onPress}>
        <Icon name="shuffle" color={styles._button.color} backgroundColor={styles._button.backgroundColor} size={styles._button.fontSize} />
      </TouchableOpacity>
    );
  }
}

MixButton.propTypes = {
  onPress: PropTypes.func
};

export default MixButton;