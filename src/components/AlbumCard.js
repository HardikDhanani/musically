import React, { Component } from 'react';
import {
  Text,
} from 'react-native';

import StyleManager from '../styles/StyleManager';

import CoverCard from '../components/CoverCard';

export default class AlbumCard extends Component {
  constructor(props) {
    super(props);

    this._infoTextStyle = StyleManager.getStyle('CoverCardInfoText');
  }

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
        <Text numberOfLines={1} style={this._infoTextStyle}>{this.props.artist}</Text>
        <Text numberOfLines={1} style={this._infoTextStyle}>{this.props.songs + ' songs'}</Text>
      </CoverCard>
    );
  }
}