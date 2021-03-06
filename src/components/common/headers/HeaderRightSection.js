import React, { Component } from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';

import {
  View
} from 'react-native';

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'center',
    flexDirection: 'row',
    paddingRight: 10,
    justifyContent: 'flex-end'
  }
});

export default class HeaderRightSection extends Component {
  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        {this.props.children}
      </View>
    );
  }
}