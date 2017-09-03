import React, { Component } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

export default class ProgressBar extends Component {
  render() {
    let percentage = this.props.total ? ((this.props.elapsed * 100) / this.props.total) / 100 : 0;

    let elapsedWidth = this.props.width * percentage;
    let leftWidth = this.props.width - elapsedWidth;

    return (
      <View style={{ flexDirection: 'row' }}>
        <View style={[styles.progressBar, { flex: elapsedWidth, backgroundColor: this.props.color }]} />
        <View style={[styles.progressBar, { flex: leftWidth, backgroundColor: this.props.backgroundColor }]} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  progressBar: {
    height: 4,
  }
});