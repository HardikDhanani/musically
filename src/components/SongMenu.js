import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';

import {
  TouchableOpacity,
  Text,
  View
} from 'react-native';
import FloatMenu from './FloatMenu';
import FloatMenuOption from './FloatMenuOption';

const styles = EStyleSheet.create({
  container: {
    height: '$floatMenuOptionHeight * 4'
  }
});

/*
      <View>
        <TouchableOpacity key={1} style={styles.option} onPress={this.props.onPlayPress}>
          <Text style={styles.text}>{'Play'}</Text>
        </TouchableOpacity>
        <TouchableOpacity key={2} style={styles.option} onPress={this.props.onAddToPlaylistPress}>
          <Text style={styles.text}>{'Add to playlist'}</Text>
        </TouchableOpacity>
        <TouchableOpacity key={3} style={styles.option} onPress={this.props.onAddToQueuePress}>
          <Text style={styles.text}>{'Add to queue'}</Text>
        </TouchableOpacity>
        <TouchableOpacity key={4} style={styles.option} onPress={this.props.onLikePress}>
          <Text style={styles.text}>{this.props.isFavorite ? 'Remove from favorites' : 'Add to favorites'}</Text>
        </TouchableOpacity>
      </View>
*/

class SongMenu extends Component {
  render() {
    return (
      <FloatMenu constentHeight={styles._container.height} onPress={this.props.onPress} positionY={this.props.positionY} positionX={this.props.positionX}>
        <FloatMenuOption onPress={this.props.onPlayPress} key={1} text={'Play'} />
        <FloatMenuOption onPress={this.props.onAddToPlaylistPress} key={2} text={'Add to playlist'} />
        <FloatMenuOption onPress={this.props.onAddToQueuePress} key={3} text={'Add to queue'} />
        <FloatMenuOption onPress={this.props.onLikePress} key={4} text={this.props.isFavorite ? 'Remove from favorites' : 'Add to favorites'} />
      </FloatMenu>
    );
  }

  // static get currentHeight() {
  //   return styles._container.height;
  // }
}

SongMenu.propTypes = {
  positionX: PropTypes.number.isRequired,
  positionY: PropTypes.number.isRequired,
  isFavorite: PropTypes.bool,
  onPlayPress: PropTypes.func,
  onAddToPlaylistPress: PropTypes.func,
  onAddToQueuePress: PropTypes.func,
  onLikePress: PropTypes.func
};

export default SongMenu;