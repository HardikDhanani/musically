import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Dimensions
} from 'react-native';

export default class AlbumCover extends Component {
  render() {
    return (
      <View style={styles.cover}>
        {this.props.children}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  cover: { 
    margin: 1, 
    padding: 2, 
    width: (Dimensions.get('window').width / 3) - 4, 
    height: 160 
  }
});