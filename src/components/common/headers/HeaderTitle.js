import React, { Component } from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';

import Text from '../Text';

const styles = EStyleSheet.create({
  container: {
    fontSize: '$titleFontSize',
    color: '$headerColor',
    alignSelf: 'center',
    lineHeight: '$titleFontSize * 1.2',
    textAlign: 'left'
  }
});

export default class HeaderTitle extends Component {
  render() {
    return (
      <Text numberOfLines={1} style={styles.container}>
        {this.props.children}
      </Text>
    );
  }
}