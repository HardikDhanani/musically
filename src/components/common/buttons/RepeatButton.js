import React, { PureComponent } from 'react';

import {
  TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default class RepeatButton extends PureComponent {
  render() {
    return (
      <TouchableOpacity style={{ marginLeft: 5, marginRight: 5 }} onPress={this.props.onPress} ref={this.props.onRef}>
        <Icon name="repeat" {...this.props.style} size={this.props.size} />
      </TouchableOpacity>
    );
  }
}