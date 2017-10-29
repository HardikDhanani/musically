import React, { PureComponent } from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';

import {
  View
} from 'react-native';

const styles = EStyleSheet.create({
  container: {
    backgroundColor: '$headerBackgroundColor',
    borderBottomColor: '$elementInactive',
    borderBottomWidth: 1,
    paddingLeft: 15
  }
});

export default class ControlPanelSection extends PureComponent {
  render() {
    return (
      <View style={styles.container}>
        {this.props.children}
      </View>
    );
  }
}