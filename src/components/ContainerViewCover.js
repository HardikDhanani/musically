import React, { PureComponent } from 'react';

import { Image, View } from 'react-native';
import StyleManager from '../styles/StyleManager';

export default class ContainerViewCover extends PureComponent {
  constructor(props) {
    super(props);

    this._containerStyle = StyleManager.getStyle('ContainerViewCoverContainer');
    this._imageStyle = StyleManager.getStyle('ContainerViewCoverImage');
    this._contentStyle = StyleManager.getStyle('ContainerViewCoverContent');
  }

  render() {
    return (
      <View style={this._containerStyle}>
        <Image source={this.props.source} style={this._imageStyle} />
        <View style={this._contentStyle}>
          {this.props.coverContent}
        </View>
      </View>
    );
  }
}