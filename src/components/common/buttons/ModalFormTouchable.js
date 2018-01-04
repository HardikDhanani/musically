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
    width: '$modalFormWidth',
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'flex-start'
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