import React, { PureComponent } from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';

import {
  TouchableNativeFeedback,
  View
} from 'react-native';

const styles = EStyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    alignItems: 'flex-end'
  }
});

export default class RightColumn extends PureComponent {
  render() {
    return (
      <View style={styles.container}>
        {this.props.children}
      </View>
    );
  }
}