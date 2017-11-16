import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';

import FloatMenu from './FloatMenu';
import FloatMenuOption from './FloatMenuOption';

const styles = EStyleSheet.create({
  container: {
    height: '$floatMenuOptionHeight * 4'
  }
});

class SongMenu extends Component {
  render() {
    return (
      <FloatMenu contentHeight={styles._container.height} onPress={this.props.onPress} positionY={this.props.positionY} positionX={this.props.positionX}>
        <FloatMenuOption onPress={this.props.onPlayPress} key={1} text={'Play'} />
        <FloatMenuOption onPress={this.props.onAddToPlaylistPress} key={2} text={'Add to playlist'} />
        <FloatMenuOption onPress={this.props.onAddToQueuePress} key={3} text={'Add to queue'} />
        <FloatMenuOption onPress={this.props.onLikePress} key={4} text={this.props.isFavorite ? 'Remove from favorites' : 'Add to favorites'} />
      </FloatMenu>
    );
  }
}

SongMenu.propTypes = {
  positionX: PropTypes.number.isRequired,
  positionY: PropTypes.number.isRequired,
  isFavorite: PropTypes.bool,
  onPress: PropTypes.func,
  onPlayPress: PropTypes.func,
  onAddToPlaylistPress: PropTypes.func,
  onAddToQueuePress: PropTypes.func,
  onLikePress: PropTypes.func
};

export default SongMenu;