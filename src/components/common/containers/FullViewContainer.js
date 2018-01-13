import React, { PureComponent } from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import LinearGradient from 'react-native-linear-gradient';

import {
  View,
  ScrollView
} from 'react-native';

const styles = EStyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '$appBackgroundColor'
  },
  informationContainer: {
    width: '$appWidth',
    height: '$appHeight * 0.55',
    alignItems: 'center'
  },
  gradientStart: {
    color: '$headerStartGradientBackgroundColor'
  },
  gradientEnd: {
    color: 'rgba(108,3,233,1)'
  },
  contentContainer: {
    flex: 1
  },
});

class FullViewContainer extends PureComponent {
  render() {
    return (
      <ScrollView style={styles.mainContainer}>
        <LinearGradient
          start={{ x: 0.0, y: 0.0 }}
          end={{ x: 0.0, y: 1.0 }}
          colors={[styles._gradientStart.color, styles._gradientEnd.color]}
          style={styles.informationContainer}>
          {this.props.header}
          {this.props.cover}
          {this.props.controls}
        </LinearGradient>
        {this.props.pagination}
        <View style={styles.contentContainer}>
          {this.props.children}
        </View>
      </ScrollView>
    );
  }
}

export default FullViewContainer;