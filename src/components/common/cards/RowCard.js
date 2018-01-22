import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';

import {
  View,
  TouchableNativeFeedback
} from 'react-native';

const styles = EStyleSheet.create({
  container: {
    flexDirection: 'row',
    height: '$headerHeight * 1.5',
    width: '$appWidth - 20',
    backgroundColor: 'white',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginHorizontal: 10,
    marginVertical: 7,
    borderRadius: 6,
    elevation: 5
  }
});

class RowCard extends PureComponent {
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

RowCard.propTypes = {
  onPress: PropTypes.func
};

export default RowCard;