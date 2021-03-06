import React, { PureComponent } from 'react';

import {
  TouchableNativeFeedback
} from 'react-native';

class Touchable extends PureComponent {
  render() {
    return (
      <TouchableNativeFeedback
        {...this.props}
        delayPressIn={2000}
        onPress={() => this._delayOnPress(this.props.onPress)}>
        {this.props.children}
      </TouchableNativeFeedback>
    );
  }

  _delayOnPress(onPress) {
    if (onPress) {
      setTimeout(onPress, 250);
    }
  }
}

export default Touchable;