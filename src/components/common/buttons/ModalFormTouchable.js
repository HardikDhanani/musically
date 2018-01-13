import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';

import {
  View
} from 'react-native';
import Touchable from './Touchable';
import Text from '../Text';

const styles = EStyleSheet.create({
  container: {
    flexDirection: 'column',
    width: '$modalFormWidth',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8
  },
  text: {
    color: '$textMainColor',
    fontSize: '$bigTextFontSize',
  }
});

class ModalFormTouchable extends PureComponent {
  render() {
    return (
      <Touchable onPress={this.props.onPress}>
        <View style={styles.container}>
          <Text style={[styles.text, { fontWeight: this.props.bold ? 'bold' : 'normal' }]}>
            {this.props.text}
          </Text>
        </View>
      </Touchable>
    );
  }
}

ModalFormTouchable.propTypes = {
  bold: PropTypes.bool,
  onPress: PropTypes.func
};

export default ModalFormTouchable;