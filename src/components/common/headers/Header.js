import React, { PureComponent } from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import LinearGradient from 'react-native-linear-gradient';

const styles = EStyleSheet.create({
  container: {
    height: '$headerHeight',
    flexDirection: 'row'
  },
  gradientStart: {
    color: '$headerStartGradientBackgroundColor'
  },
  gradientEnd: {
    color: '$headerEndGradientBackgroundColor'
  }
});

export default class Header extends PureComponent {
  render() {
    return (
      <LinearGradient
        start={{ x: 0.0, y: 1.0 }}
        end={{ x: 1.0, y: 1.0 }}
        colors={[styles._gradientStart.color, styles._gradientEnd.color]}
        style={styles.container}>
        {this.props.children}
      </LinearGradient>
    );
  }
}