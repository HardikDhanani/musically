import React, { Component } from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';

import {
  View
} from 'react-native';

const styles = EStyleSheet.create({
  container: {
    height: '$footerHeight',
    width: '$footerWidth',
    backgroundColor: '$footerBackgroundColor',
    elevation: 10
  }
});

export default class Footer extends Component {
  render() {
    return (
      <View style={styles.container}>
        {this.props.children}
      </View>
    );
  }
}