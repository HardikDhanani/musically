import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';

import {
  TouchableNativeFeedback,
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Text from './common/Text';

const styles = EStyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingLeft: 20
  },
  icon: {
    marginRight: 30,
    height: 30,
    width: 30,
    color: '$appMainTextColor'
  },
  text: {
    fontSize: 22,
    color: '$appMainTextColor'
  }
});

class ControlPanelButton extends PureComponent {
  render() {
    return (
      <TouchableNativeFeedback onPress={this.props.onPress}>
        <View style={styles.button} >
          <Icon size={30} style={styles.icon} name={this.props.icon} />
          <Text style={styles.text}>{this.props.text}</Text>
        </View>
      </TouchableNativeFeedback>
    );
  }
}

ControlPanelButton.propTypes = {
  icon: PropTypes.string,
  text: PropTypes.string,
  onPress: PropTypes.func
};

export default ControlPanelButton;