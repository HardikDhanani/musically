import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {
  TouchableOpacity,
  View,
  Text,
  BackHandler,
  ScrollView,
  Modal
} from 'react-native';

const styles = EStyleSheet.create({
  mainContainer: {
    flex: 1,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: '$appWidth',
    height: '$appHeight',
    justifyContent: 'center',
    alignItems: 'center'
  },
  formContainer: {
    width: '$appWidth * 0.95',
    // height: '$appHeight * 0.25',
    backgroundColor: '$headerBackgroundColor',
    justifyContent: 'space-between'
  },
  titleContainer: {
    height: 40,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginHorizontal: 10
  },
  contentContainer: {
    marginHorizontal: 10,
  },
  buttonsContainer: {
    height: 40,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  button: {
    marginHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    color: '$elementActive',
    backgroundColor: 'transparent',
    fontSize: '$headerIconSize'
  },
  title: {
    fontSize: '$titleFontSize',
    color: '$headerColor',
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
              <TouchableOpacity style={styles.button} onPress={this.props.onCancelPress}>
                <Icon name='clear' color={styles._icon.color} backgroundColor={styles._icon.backgroundColor} size={styles._icon.fontSize} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={this.props.onConfirmPress}>
                <Icon name='check' color={styles._icon.color} backgroundColor={styles._icon.backgroundColor} size={styles._icon.fontSize} />
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