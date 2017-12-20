import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';

import {
  TouchableNativeFeedback,
  View
} from 'react-native';

const styles = EStyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
});

class Option extends PureComponent {
  render() {
    return (
      <TouchableNativeFeedback onPress={this.props.onPress}>
        <View style={[styles.container, this.props.style]}>
          {this.props.children}
        </View>
      </TouchableNativeFeedback>
    );
  }
}

Option.propTypes = {
  onPress: PropTypes.func
}

export default Option;