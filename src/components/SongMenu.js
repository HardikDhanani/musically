import React, { Component } from 'react';
import {
  TouchableOpacity,
  Text,
  View
} from 'react-native';

import Styles from '../styles/Styles';

export default class SongMenu extends Component {
  render() {
    let style = Styles.getFloatMenuStyle();
    return (
      <View>
        <TouchableOpacity key={1} style={style.menuOption} onPress={this.props.onPlayPress}>
          <Text style={style.menuOptionText}>{'Play'}</Text>
        </TouchableOpacity>
        <TouchableOpacity key={2} style={style.menuOption} onPress={this.props.onAddToPlaylistPress}>
          <Text style={style.menuOptionText}>{'Add to playlist'}</Text>
        </TouchableOpacity>
        <TouchableOpacity key={3} style={style.menuOption} onPress={this.props.onAddToQueuePress}>
          <Text style={style.menuOptionText}>{'Add to queue'}</Text>
        </TouchableOpacity>
        <TouchableOpacity key={4} style={style.menuOption} onPress={this.props.onLikePress}>
          <Text style={style.menuOptionText}>{this.props.isFavorite ? 'Remove from favorites' : 'Add to favorites'}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  static get currentHeight() {
    let ret = Styles.floatMenuOptionHeight() * 4;
    return ret;
  }
}