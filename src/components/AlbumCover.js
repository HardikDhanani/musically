import React, { Component } from 'react';
import {
  View
} from 'react-native';

import StyleManager from '../styles/StyleManager';

export default class AlbumCover extends Component {
  constructor(props) {
    super(props);

    this._containerStyle = StyleManager.getStyle('AlbumCoverContainer');
  }

  render() {
    return (
      <View style={this._containerStyle}>
        {this.props.children}
      </View>
    );
  }
}