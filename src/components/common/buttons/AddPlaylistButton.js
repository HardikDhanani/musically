import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';

import {
  TouchableOpacity,
  Animated
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const styles = EStyleSheet.create({
  buttonContainer: {
    position: 'absolute',
    height: '$headerHeight',
    width: '$headerHeight',
    borderRadius: 100,
    backgroundColor: '$elementActive',
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    color: '$headerColor',
    backgroundColor: 'transparent',
    fontSize: 40
  }
});

class AddPlaylistButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bottom: new Animated.Value(0)
    }
  }

  componentDidUpdate() {
    if (this.state.bottom._value === 0 && this.props.hide)
      return;

    if (this.state.bottom._value === this.props.bottom && !this.props.hide)
      return;

    let toValue = this.props.bottom;
    if (this.props.hide)
      toValue = 0;

    Animated.timing(
      this.state.bottom,
      {
        toValue: toValue,
        duration: 200,
      }
    ).start();
  }

  render() {
    let { bottom } = this.state;

    return (
      <Animated.View style={{ bottom }}>
        <TouchableOpacity style={[styles.buttonContainer, this.props.style]} onPress={this.props.onPress}>
          <Icon name="playlist-add" color={styles._button.color} backgroundColor={styles._button.backgroundColor} size={styles._button.fontSize} />
        </TouchableOpacity>
      </Animated.View>
    );
  }
}

AddPlaylistButton.propTypes = {
  onPress: PropTypes.func
};

export default AddPlaylistButton;