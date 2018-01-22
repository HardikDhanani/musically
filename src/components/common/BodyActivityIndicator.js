import React, { PureComponent } from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';

import {
  View,
} from 'react-native';
import ActivityIndicator from './ActivityIndicator';

const styles = EStyleSheet.create({
  activityIndicator: {
    width: '$appWidth',
    height: '$bodyHeight',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default class BodyActivityIndicator extends PureComponent {
  render() {
    return (
      <View style={styles.activityIndicator}>
        <ActivityIndicator />
      </View>
    );
  }
}