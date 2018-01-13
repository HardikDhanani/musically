import React, { Component } from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import LinearGradient from 'react-native-linear-gradient';

import {
  View
} from 'react-native';

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '$appBackgroundColor'
  },
  gradient: {
    height: '$statusBarHeight'
  },
  gradientStartColor: {
    color: '$headerStartGradientBackgroundColor'
  },
  gradientEndColor: {
    color: '$headerEndGradientBackgroundColor'
  }
});

export default class Container extends Component {
  render() {
    let fillStatusBar = this.props.fillStatusBar === undefined || this.props.fillStatusBar === null ? true : this.props.fillStatusBar;

    return (
      <View style={styles.container}>
        {
          !fillStatusBar ?
            null :
            <LinearGradient
              start={{ x: 0.0, y: 1.0 }}
              end={{ x: 1.0, y: 1.0 }}
              colors={[styles._gradientStartColor.color, styles._gradientEndColor.color]}
              style={styles.gradient} />
        }
        {this.props.children}
      </View>
    );
  }
}