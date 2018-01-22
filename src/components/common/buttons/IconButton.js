import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {
  TouchableOpacity
} from 'react-native';

class IconButton extends PureComponent {
  render() {
    let buttonStyle = {
      marginHorizontal: 0,
      justifyContent: 'center',
      alignItems: 'center'
    }

    return (
      <TouchableOpacity hitSlop={{ top: 0, bottom: 0, left: 10, right: 10 }} style={buttonStyle} onPress={this.props.onPress} ref={this.props.onRef}>
        <Icon name={this.props.iconName} {...this.props.style} size={this.props.iconSize} />
      </TouchableOpacity>
    );
  }
}

IconButton.propTypes = {
  iconName: PropTypes.string.isRequired,
  iconSize: PropTypes.number.isRequired,
  onPress: PropTypes.func,
  onRef: PropTypes.func
};

export default IconButton;