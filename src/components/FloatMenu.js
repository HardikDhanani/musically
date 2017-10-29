import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';

import {
  View,
  TouchableWithoutFeedback,
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

    return (
      <TouchableWithoutFeedback onPress={this.props.onPress}>
        <View style={styles.container}>
          <View style={[styles.content, { top: top, right: windowWidth - right }]}>
            {this.props.children}
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

FloatMenu.propTypes = {
  contentHeight: PropTypes.number.isRequired,
  positionX: PropTypes.number.isRequired,
  positionY: PropTypes.number.isRequired,
  onPress: PropTypes.func
};

export default FloatMenu;