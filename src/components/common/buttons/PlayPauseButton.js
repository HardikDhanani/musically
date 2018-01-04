import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';
import LinearGradient from 'react-native-linear-gradient';

import {
  TouchableOpacity,
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const styles = EStyleSheet.create({
  container: {
    backgroundColor: '$appMainColor',
    width: '$footerHeight * 0.7',
    height: '$footerHeight * 0.70',
    borderRadius: '$footerHeight * 0.7',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5
  },
  button: {
    color: '$appMainTextColor',
    fontSize: 40
  },
  gradientStart: {
    color: '$headerStartGradientBackgroundColor'
  },
  gradientEnd: {
    color: '$headerEndGradientBackgroundColor'
  }
});

class PlayPauseButton extends PureComponent {
  render() {
    return (
      <TouchableOpacity style={styles.container} onPress={this.props.onPress} activeOpacity={0.7}>
        <Icon name={this.props.iconName} color={styles._button.color} size={styles._button.fontSize} />
      </TouchableOpacity>
    );
  }
}

PlayPauseButton.propTypes = {
  iconName: PropTypes.string.isRequired,
  onPress: PropTypes.func
};

export default PlayPauseButton;