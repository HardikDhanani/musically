import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';

import {
  TouchableNativeFeedback,
  View
} from 'react-native';

const styles = EStyleSheet.create({
  outer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  inner: {
    width: 10,
    height: 10,
    borderRadius: 5
  },
  selected: {
    borderColor: '$elementActive'
  },
  unselected: {
    borderColor: '$elementInactive'
  },
  innerSelected: {
    backgroundColor: '$elementActive'
  },
  innerUnselected: {
    backgroundColor: '$elementInactive'
  }
});

class RadioButton extends PureComponent {
  render() {
    let outerColor = this.props.selected ? styles.selected : styles.unselected;
    let innerColor = this.props.selected ? styles.innerSelected : styles.innerUnselected;
    return (
      <View style={[styles.outer, outerColor]}>
        <View style={[styles.inner, innerColor]} />
      </View>
    );
  }
}

RadioButton.propTypes = {
  selected: PropTypes.bool
}

export default RadioButton;