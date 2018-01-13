import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';

import {
  View
} from 'react-native';
import Touchable from '../common/buttons/Touchable';

const styles = EStyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(215,215,215,1)',
    paddingVertical: 18
  }
});

class Option extends PureComponent {
  render() {
    return (
      <Touchable onPress={this.props.onPress}>
        <View style={[styles.container, this.props.style]}>
          {this.props.children}
        </View>
      </Touchable>
    );
  }
}

Option.propTypes = {
  onPress: PropTypes.func
}

export default Option;