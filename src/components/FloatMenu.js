import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';

import {
  View,
  TouchableWithoutFeedback,
  Animated,
  BackHandler
} from 'react-native';

const styles = EStyleSheet.create({
  container: {
    position: 'absolute',
    height: '$appHeight',
    width: '$appWidth',
    backgroundColor: 'transparent',
    alignItems: 'flex-end',
    padding: 5
  },
  content: {
    width: '$appWidth * 0.5',
    backgroundColor: '$floatMenuContentBackgroundColor',
  },
  footer: {
    height: '$footerHeight'
  }
});

class FloatMenu extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      height: new Animated.Value(0),
      width: new Animated.Value(0),
    }
    this._mounted = false;

    this._onPress = this._onPress.bind(this);
    this._startAnimation = this._startAnimation.bind(this);
    this._backHandler = this._backHandler.bind(this);
  }

  componentDidMount() {
    this._mounted = true;
    BackHandler.addEventListener('hardwareBackPress', this._backHandler);
    this._startAnimation(this.props.contentHeight, styles._content.width);
  }

  componentWillUnmount() {
    this._mounted = false;
    BackHandler.removeEventListener('hardwareBackPress', this._backHandler);
  }

  render() {
    let top = this.props.positionY;
    let right = this.props.positionX;

    let windowHeight = styles._container.height;
    let windowWidth = styles._container.width;
    let footerHeight = styles._footer.height;

    if (this.props.contentHeight > (windowHeight - footerHeight - top))
      top = (windowHeight - footerHeight - this.props.contentHeight);

    if ((windowWidth / 2) > right)
      right = windowWidth / 2;

    let { height, width } = this.state;

    return (
      <TouchableWithoutFeedback onPress={this._onPress}>
        <View style={styles.container}>
          <Animated.View style={[styles.content, { height, width, top: top, right: windowWidth - right }]}>
            {this.props.children}
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  _onPress() {
    this._startAnimation(0, 0, this.props.onPress);
  }

  _startAnimation(heightToValue, widthToValue, onAnimationEnd) {
    Animated.parallel([
      Animated.timing(
        this.state.height,
        {
          toValue: heightToValue,
          duration: 200,
        }
      ),
      Animated.timing(
        this.state.width,
        {
          toValue: widthToValue,
          duration: 200,
        }
      )
    ]).start(onAnimationEnd);
  }

  _backHandler() {
    if (this._mounted) {
      this._startAnimation(0, 0, this.props.onPress);
    }

    return true;
  }
}

FloatMenu.propTypes = {
  contentHeight: PropTypes.number.isRequired,
  positionX: PropTypes.number,
  positionY: PropTypes.number,
  onPress: PropTypes.func
};

export default FloatMenu;