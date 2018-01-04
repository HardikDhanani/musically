import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';

import {
  View,
  Modal
} from 'react-native';
import Text from '../Text';

const styles = EStyleSheet.create({
  container: {
    right: 0,
    left: 0,
    top: 0,
    bottom: 0,
    position: 'absolute',
    width: '$appWidth',
    height: '$appHeight',
    backgroundColor: '$modalFormBackgroundColor',
    justifyContent: 'center',
    alignItems: 'center'
  },
  contentContainer: {
    width: '$modalFormWidth',
    backgroundColor: '$modalFormContentBackgroundColor',
    elevation: 5,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  title: {
    marginHorizontal: 15,
    marginVertical: 15,
    color: '$textMainColor',
    fontSize: '$bigTextFontSize',
    fontWeight: 'bold'
  }
});

class ModalForm extends PureComponent {
  render() {
    let backgroundColor = this.props.backgroundTransparent ? 'transparent' : styles._container.backgroundColor

    return (
      <Modal
        animationType={'fade'}
        transparent={true}
        visible={true}
        onRequestClose={() => {
          if (this.props.onCancelPress) {
            this.props.onCancelPress();
          }
        }}>
        <View style={[styles.container, { backgroundColor }]}>
          <View style={[styles.contentContainer, this.props.style]}>
            {
              this.props.title ?
                <Text style={styles.title}>{this.props.title}</Text> :
                null
            }
            {this.props.children}
          </View>
        </View>
      </Modal>
    );
  }
}

ModalForm.propTypes = {
  title: PropTypes.string,
  onCancelPress: PropTypes.func.isRequired
};

export default ModalForm;