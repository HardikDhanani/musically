import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import {
  TouchableNativeFeedback
} from 'react-native';

class Touchable extends PureComponent {
  render() {
    return (
      <TouchableNativeFeedback
        onLongPress={this.props.onLongPress}
        onLongIn={this.props.onLongIn}
        onLongOut={this.props.onLongOut}
        delayPressIn={1500}
        onPress={() => this._delayOnPress(this.props.onPress)}>
        {this.props.children}
      </TouchableNativeFeedback>
    );
  }

  _delayOnPress(callback) {
    if (callback) {
      setTimeout(callback, 250);
    }
  }
}

Touchable.propTypes = {
  onPress: PropTypes.func,
  onLongPress: PropTypes.func,
  onLongIn: PropTypes.func,
  onLongOut: PropTypes.func
};

export default Touchable;