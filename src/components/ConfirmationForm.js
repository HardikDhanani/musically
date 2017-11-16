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
  Animated
} from 'react-native';

const styles = EStyleSheet.create({
  mainContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: '$appWidth',
    height: '$appHeight',
    justifyContent: 'center',
    alignItems: 'center'
  },
  formContainer: {
    width: '$appWidth * 0.95',
    height: '$appHeight * 0.25',
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
  constructor(props) {
    super(props);

    this.state = {
      opacity: new Animated.Value(0),
    }

    this._backHandler = this._backHandler.bind(this);
    this._onPressHandler = this._onPressHandler.bind(this);
    this._startAnimation = this._startAnimation.bind(this);
  }

  componentDidMount() {
    this._mounted = true;
    BackHandler.addEventListener('hardwareBackPress', this._backHandler);
    this._startAnimation(1);
  }

  componentWillUnmount() {
    this._mounted = false;
    BackHandler.removeEventListener('hardwareBackPress', this._backHandler);
  }

  render() {
    var { opacity } = this.state;

    return (
      <Animated.View style={[styles.mainContainer, { opacity }]}>
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
            <TouchableOpacity style={styles.button} onPress={this._onPressHandler}>
              <Icon name='check' color={styles._icon.color} backgroundColor={styles._icon.backgroundColor} size={styles._icon.fontSize} />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    );
  }

  _backHandler() {
    if (this._mounted) {
      this._startAnimation(0, this.props.onCancelPress);
    }

    return true;
  }

  _onPressHandler() {
    if (this.props.onConfirmPress)
      this.props.onConfirmPress();
  }

  _startAnimation(toValue, onAnimationEnd) {
    Animated.timing(
      this.state.opacity,
      {
        toValue,
        duration: 250,
      }
    ).start(onAnimationEnd);
  }
}

ConfirmationForm.propTypes = {
  title: PropTypes.string.isRequired,
  onCancelPress: PropTypes.func,
  onConfirmPress: PropTypes.func
};

export default ConfirmationForm;