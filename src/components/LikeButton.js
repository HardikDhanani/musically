import React, { PureComponent } from 'react';
import { TouchableOpacity, Text } from 'react-native';

import StyleManager from '../styles/StyleManager';

export default class LikeButton extends PureComponent {
  constructor(props) {
    super(props);

    this._buttonStyle = StyleManager.getStyle('HeaderButton');
    this._likedStyle = StyleManager.getStyle('LikeButtonLiked');
    this._unlikedStyle = StyleManager.getStyle('LikeButtonUnliked');
  }

  render() {
    return (
      <TouchableOpacity style={this._buttonStyle} onPress={this.props.onPress}>
        <Text style={this.props.liked ? this._likedStyle : this._unlikedStyle}>{'L'}</Text>
      </TouchableOpacity>
    );
  }
}