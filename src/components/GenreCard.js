import React, { Component } from 'react';
import {
  StyleSheet,
  Text
} from 'react-native';

import CoverCard from '../components/CoverCard';

export default class GenreCard extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.id !== nextProps.id;
  }

  render() {
    return (
      <CoverCard
        onPress={this.props.onPress}
        source={this.props.source}
        imageUri={this.props.imageUri}
        title={this.props.name}
        onOptionPressed={this.props.onOptionPressed}>
        <Text numberOfLines={1} style={styles.infoText}>{this.props.albums + ' albums'}</Text>
        <Text numberOfLines={1} style={styles.infoText}>{this.props.songs + ' songs'}</Text>
      </CoverCard>
    );
  }
}

const styles = StyleSheet.create({
  infoText: {
    fontSize: 12
  }
});