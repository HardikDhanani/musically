import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';

import {
  View,
  Animated
} from 'react-native';
import Text from './Text';

const styles = EStyleSheet.create({
  container: {
    position: 'absolute',
    padding: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '$appMainColor',
    bottom: '$footerHeight * 1.25',
    borderRadius: 100
  },
  text: {
    color: 'white'
  }
});

class FadeInOutMessage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      opacity: new Animated.Value(1)
    }

    this._loopAnimation = this._loopAnimation.bind(this);
  }

  componentDidMount() {
    this._loopAnimation();
  }

  render() {
    let { opacity } = this.state;
    return (
      <Animated.View style={[styles.container, { opacity }]}>
        <Text style={styles.text}>{this.props.text}</Text>
      </Animated.View>
    );
  }

  _loopAnimation() {
    Animated.sequence([
      Animated.timing(this.state.opacity, {
        toValue: 0.25,
        duration: 1000
      }),
      Animated.timing(this.state.opacity, {
        toValue: 1,
        duration: 1000
      })
    ]).start(() => {
      this._loopAnimation();
    });
  }
}

FadeInOutMessage.propTypes = {
  text: PropTypes.string.isRequired
};

export default FadeInOutMessage;