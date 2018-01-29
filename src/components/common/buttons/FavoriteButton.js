import React, { PureComponent } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {
  TouchableOpacity
} from 'react-native';
import IconButton from './IconButton';

class FavoriteButton extends PureComponent {
  render() {
    let buttonStyle = {
      marginHorizontal: 0,
      justifyContent: 'center',
      alignItems: 'center'
    }

    return (
      <TouchableOpacity hitS11={{ top: 0, bottom: 0, left: 10, right: 10 }} style={buttonStyle} onPress={this.props.onPress} ref={this.props.onRef} activeOpacity={0.7}>
        <Icon style={{ top: (this.props.iconSize / 2) }} name={'favorite'} {...this.props.style} color={this.props.borderColor} size={this.props.iconSize} />
        <Icon style={{ top: -(this.props.iconSize / 2) }} name={'favorite'} {...this.props.style} size={this.props.iconSize - 1} />
      </TouchableOpacity>
    );
  }
}

export default FavoriteButton;