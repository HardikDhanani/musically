import React, { PureComponent } from 'react';
import {
  StyleSheet,
  View,
  Platform
} from 'react-native';

export default class Header extends PureComponent {
  render() {
    return (
      <View style={[styles.header, this.props.style]}>
        {this.props.children}
      </View>
    );
  }

  static get currentHeight(){
    return Platform.OS === "ios" ? 64 : 56;
  }
}

const styles = StyleSheet.create({
  header: {
    height: Header.currentHeight,
    flexDirection: 'row',
  }
});