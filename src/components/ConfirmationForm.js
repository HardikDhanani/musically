import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {
  View,
  ScrollView,
  Modal,
  TouchableOpacity
} from 'react-native';
import Touchable from './common/buttons/Touchable';
import Text from './common/Text';

const styles = EStyleSheet.create({
  mainContainer: {
    flex: 1,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.90)',
    width: '$appWidth',
    height: '$appHeight',
    justifyContent: 'center',
    alignItems: 'center'
  },
  formContainer: {
    width: '$appWidth * 0.65',
    backgroundColor: '$modalFormContentBackgroundColor',
    borderRadius: 7,
    elevation: 5
  },
  titleContainer: {
    height: '$headerHeight',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginHorizontal: 10
  },
  contentContainer: {
    marginHorizontal: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  button: {
    flex: 1,
    height: '$headerHeight',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '$appMainColor',
    borderBottomLeftRadius: 7,
    borderBottomRightRadius: 7,
  },
  buttonText: {
    fontSize: '$titleFontSize',
    color: '$appMainTextColor',
    fontFamily: 'bold'
  },
  icon: {
    color: '$elementActive',
    backgroundColor: 'transparent',
    fontSize: '$headerIconSize'
  },
  title: {
    fontSize: '$titleFontSize',
    color: '$textMainColor',
    fontWeight: 'bold'
  }
});

class ConfirmationForm extends Component {
  render() {
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
        <View style={styles.mainContainer}>
          <View style={styles.formContainer}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{this.props.title}</Text>
            </View>
            <ScrollView style={styles.contentContainer}>
              {this.props.children}
            </ScrollView>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity style={styles.button} onPress={this.props.onConfirmPress}>
                <Text style={styles.buttonText}>{this.props.actionText}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

ConfirmationForm.propTypes = {
  isVisible: PropTypes.bool,
  title: PropTypes.string.isRequired,
  onCancelPress: PropTypes.func,
  onConfirmPress: PropTypes.func
};

export default ConfirmationForm;