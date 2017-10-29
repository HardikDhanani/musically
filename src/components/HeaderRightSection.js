import React, { Component } from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';

import {
  View
} from 'react-native';

const styles = EStyleSheet.create({
  container: {
    alignSelf: 'center',
    justifyContent: 'flex-end',
    flexDirection: 'row'
  }
});

export default class HeaderRightSection extends Component {
  render() {
    return (
      <View style={styles.container}>
        {this.props.children}
      </View>
    );
  }
}