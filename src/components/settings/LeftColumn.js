import React, { PureComponent } from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';

import {
  View
} from 'react-native';

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  }
});

export default class LeftColumn extends PureComponent {
  render() {
    return (
      <View style={styles.container}>
        {this.props.children}
      </View>
    );
  }
}