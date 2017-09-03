import React, { Component } from 'react';
import {
  StyleSheet,
  Platform,
  Text
} from 'react-native';

export default class Title extends Component {
  render() {
    return (
      <Text style={[styles.card, this.props.style]}>
        {this.props.children}
      </Text>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto_medium",
    fontSize: Platform.OS === "ios" ? 17 : 19,
  }
});