import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {
  TouchableOpacity,
  Animated
} from 'react-native';

const styles = EStyleSheet.create({
  buttonContainer: {
    position: 'absolute',
    height: '$headerHeight',
    width: '$headerHeight',
    borderRadius: 100,
    backgroundColor: '$appMainColor',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10
  },
  button: {
    color: '$headerColor',
    backgroundColor: 'transparent',
    fontSize: 40
  }
});

class ShuffleSongsButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bottom: new Animated.Value(0)
    }

    this._animate = this._animate.bind(this);
  }

  componentDidMount() {
    this._animate(400);
  }

  componentDidUpdate() {
    this._animate();
  }

  render() {
    let { bottom } = this.state;

    return (
      <Animated.View style={{ bottom }}>
        <TouchableOpacity style={[styles.buttonContainer, this.props.style]} onPress={this.props.onPress}>
          <Icon name='shuffle' color={styles._button.color} backgroundColor={styles._button.backgroundColor} size={styles._button.fontSize} />
        </TouchableOpacity>
      </Animated.View>
    );
  }

  _animate(duration) {
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
        duration: duration || 200,
      }
    ).start();
  }
}

ShuffleSongsButton.propTypes = {
  onPress: PropTypes.func.isRequired
};

export default ShuffleSongsButton;