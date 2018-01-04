import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';

import {
  TouchableWithoutFeedback
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const styles = EStyleSheet.create({
  checkBox: {
    backgroundColor: 'transparent',
    fontSize: '$headerIconSize'
  }
});

class CheckBox extends PureComponent {
  render() {
    return (
      <TouchableWithoutFeedback onPress={this.props.onChange} hitSlop={{ top: 0, bottom: 0, left: 10, right: 10 }} style={{ marginLeft: 5, marginRight: 5 }}>
        <Icon name={'check-box'} style={[styles.checkBox, this.props.style]} size={styles._checkBox.fontSize} />
      </TouchableWithoutFeedback>
    );
  }
}

CheckBox.propTypes = {
  onChange: PropTypes.func
};

export default CheckBox;