import React, { PureComponent } from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';

import {
  View,
  ActivityIndicator as ActivityIndicatorReact
} from 'react-native';

const styles = EStyleSheet.create({
  container: {
    height: '$headerHeight',
    width: '$headerHeight',
    backgroundColor: '$appMainColor',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '$headerHeight',
    marginBottom: 20,
    elevation: 5
  },
});

export default class ActivityIndicator extends PureComponent {
  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        <ActivityIndicatorReact animating={true} size='large' color='white' />
      </View>
    );
  }
}