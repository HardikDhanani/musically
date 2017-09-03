import React, { PureComponent } from 'react';
import {
  Dimensions,
  View,
  TouchableWithoutFeedback,
} from 'react-native';

import Styles from '../styles/Styles';

export default class FloatMenu extends PureComponent {
  render() {
    let style = Styles.getFloatMenuStyle();

    let currentHeight = this.props.contentHeight;
    let top = this.props.positionY;
    let windowHeight = Dimensions.get('window').height;
    let footerHeight = 60;

    let right = this.props.positionX;
    let windowWidth = Dimensions.get('window').width;

    if (currentHeight > (windowHeight - footerHeight - top))
      top = (windowHeight - footerHeight - currentHeight);

    if ((windowWidth / 2) > right)
      right = windowWidth / 2;

    return (
      <TouchableWithoutFeedback onPress={this.props.onPress} style={style.menuBackground}>
        <View style={style.menuContainer}>
          <View style={[style.menuContent, { top: top, right: windowWidth - right }]}>
            {this.props.children}
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}