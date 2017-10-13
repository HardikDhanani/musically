import React, { PureComponent } from 'react';
import {
  Text,
  View
} from 'react-native';

import StyleManager from '../styles/StyleManager';

export default class PlayerFooterSongSection extends PureComponent {
  constructor(props) {
    super(props);

    this._containerStyle = StyleManager.getStyle('PlayerFooterSongSection');
    this._titleStyle = StyleManager.getStyle('PlayerFooterSongSectionTitle');
    this._textStyle = StyleManager.getStyle('PlayerFooterSongSectionText');
  }

  render() {
    return (
      <View style={this._containerStyle}>
        <Text numberOfLines={1} style={this._titleStyle}>{this.props.title}</Text>
        <Text numberOfLines={1} style={this._textStyle}>{this.props.artist}</Text>
      </View>
    );
  }
}