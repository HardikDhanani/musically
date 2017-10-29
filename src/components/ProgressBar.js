import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';

import {
  View,
  PanResponder,
  Animated,
  Dimensions
} from 'react-native';

const styles = EStyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  elapsed: {
    height: 4,
    backgroundColor: '$elementActive'
  },
  left: {
    height: 4,
    backgroundColor: '$elementInactive'
  },
  button: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 5,
    position: 'absolute',
    borderColor: '$elementActive'
  }
});

class ProgressBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pan: new Animated.ValueXY(),
    };

    this._currentPosition = 0;
    this._maxPosition = 320 - 20;
    this._isPanWorking = false;
    this._width = Dimensions.get('window').width;

    this._onProgressChange = this._onProgressChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (!this._isPanWorking && this.props.elapsed !== nextProps.elapsed) {
      let percentage = this.props.total ? ((nextProps.elapsed * 100) / this.props.total) / 100 : 0;
      let newdx = this._maxPosition * percentage;
      this._currentPosition = newdx;
      this.state.pan.setOffset({ x: newdx, y: 0 });
    } else if (this.props.elapsed !== nextProps.elapsed && nextProps.elapsed === 0) {
      this.state.pan.setOffset({ x: -this._currentPosition, y: 0 });
      this._currentPosition = 0;
    }
  }

  componentWillMount() {
    this._panResponder = PanResponder.create({
      onMoveShouldSetResponderCapture: () => true, //Tell iOS that we are allowing the movement
      onMoveShouldSetPanResponderCapture: () => true, // Same here, tell iOS that we allow dragging
      onPanResponderGrant: (e, gestureState) => {
        this.state.pan.setOffset({ x: this.state.pan.x._value, y: 0 });
        //this.state.pan.setValue({ x: 0, y: 0 }); //Initial value
      },
      onPanResponderMove: (evt, gestureState) => {
        this._isPanWorking = true;
        if (gestureState.dx !== 0) {
          let newdx = gestureState.dx;
          let position = this._currentPosition + gestureState.dx;

          if (position < 0) {
            newdx = -1 * this._currentPosition;
            position = 0;
          } else if (position > this._maxPosition) {
            newdx = this._maxPosition - this._currentPosition;
            position = this._maxPosition;
          }

          Animated.event([
            null, { dx: this.state.pan.x, dy: 0 },
          ])(evt, { dx: newdx, dy: 0 });

          this._onProgressChange(position);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (this._currentPosition + gestureState.dx < 0)
          this._currentPosition = 0;
        else if (this._currentPosition + gestureState.dx > this._maxPosition)
          this._currentPosition = this._maxPosition;
        else
          this._currentPosition += gestureState.dx;

        this._isPanWorking = false;
        this.state.pan.flattenOffset(); // Flatten the offset so it resets the default positioning
      }
    });
  }

  render() {
    let percentage = this.props.total ? ((this.props.elapsed * 100) / this.props.total) / 100 : 0;
    let elapsedWidth = this._width * percentage;
    let leftWidth = this._width - elapsedWidth;
    let imageStyle = { transform: [{ translateX: this.state.pan.x }, { translateY: 0 }] };

    return (
      <View style={styles.container}>
        <View style={[styles.elapsed, { flex: elapsedWidth }]} />
        <View style={[styles.left, { flex: leftWidth }]} />
        {
          this.props.showButton
            ? <Animated.View hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }} style={[styles.button, imageStyle]} {...this._panResponder.panHandlers} />
            : null
        }
      </View>
    );
  }

  _onProgressChange(position) {
    let percentage = ((position * 100) / this._maxPosition) / 100;
    console.log('percentage: ' + percentage);
    this.props.onProgressChange(percentage);
  }
}

ProgressBar.propTypes = {
  elapsed: PropTypes.number.isRequired,
  total: PropTypes.string.isRequired,
  showButton: PropTypes.bool,
  onProgressChange: PropTypes.func
};

export default ProgressBar;