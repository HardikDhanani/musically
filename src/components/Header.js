import React, { PureComponent } from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';

import {
  View,
} from 'react-native';

const styles = EStyleSheet.create({
  container: {
    height: '$headerHeight',
    backgroundColor: '$headerBackgroundColor',
    flexDirection: 'row'
  }
});

export default class Header extends PureComponent {
  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        {this.props.children}
      </View>
    );
  }
}