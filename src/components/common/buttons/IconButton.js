import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import {
  TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

class IconButton extends PureComponent {
  render() {
    return (
      <TouchableOpacity hitSlop={{top: 0, bottom: 0, left: 10, right: 10}} style={{ marginLeft: 5, marginRight: 5 }} onPress={this.props.onPress} ref={this.props.onRef}>
        <Icon name={this.props.iconName} {...this.props.style} size={this.props.iconSize} />
      </TouchableOpacity>
    );
  }
}

IconButton.propTypes = {
  iconName: PropTypes.string.isRequired,
  iconSize: PropTypes.number,
  onPress: PropTypes.func,
  onRef: PropTypes.func
};

export default IconButton;