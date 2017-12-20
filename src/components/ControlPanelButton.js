import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';

import {
  TouchableNativeFeedback,
  Text,
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

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
    width: 30
  },
  text: {
    fontSize: '$titleFontSize'
  },
  active: {
    color: '$elementActive'
  },
  inactive: {
    color: '$elementInactive'
  }
});

class ControlPanelButton extends PureComponent {
  render() {
    return (
      <TouchableNativeFeedback onPress={this.props.onPress}>
        <View style={styles.button} >
          <Icon size={25} style={[styles.icon, this.props.isActive ? styles.active : styles.inactive]} name={this.props.icon} />
          <Text style={[styles.text, this.props.isActive ? styles.active : styles.inactive]}>{this.props.text}</Text>
        </View>
      </TouchableNativeFeedback>
    );
  }
}

ControlPanelButton.propTypes = {
  isActive: PropTypes.bool,
  icon: PropTypes.string,
  text: PropTypes.string,
  onPress: PropTypes.func,
  keyExtractor: PropTypes.func
};

export default ControlPanelButton;