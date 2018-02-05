import React, { Component } from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';

import Text from '../Text';

const styles = EStyleSheet.create({
  container: {
    fontSize: '$titleFontSize',
    color: '$headerColor',
    alignSelf: 'center',
    justifyContent: 'flex-end',
  }
});

export default class HeaderTitle extends Component {
  render() {
    return (
      <Text style={styles.container}>
        {this.props.children}
      </Text>
    );
  }
}