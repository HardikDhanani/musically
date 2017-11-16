import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';

import FloatMenu from './FloatMenu';
import FloatMenuOption from './FloatMenuOption';

const styles = EStyleSheet.create({
  container: {
    height: '$floatMenuOptionHeight * 3'
  }
});

class PlaylistSongMenu extends Component {
  render() {
    return (
      <FloatMenu contentHeight={styles._container.height} onPress={this.props.onPress} positionY={this.props.positionY} positionX={this.props.positionX}>
        <FloatMenuOption onPress={this.props.onPlayPress} key={1} text={'Play'} />
        <FloatMenuOption onPress={this.props.onRemoveFromPlaylistPress} key={2} text={'Remove from playlist'} />
        <FloatMenuOption onPress={this.props.onAddToQueuePress} key={3} text={'Add to queue'} />
      </FloatMenu>
    );
  }
}

PlaylistSongMenu.propTypes = {
  positionX: PropTypes.number.isRequired,
  positionY: PropTypes.number.isRequired,
  isFavorite: PropTypes.bool,
  onPress: PropTypes.func,
  onPlayPress: PropTypes.func,
  onRemoveFromPlaylistPress: PropTypes.func,
  onAddToQueuePress: PropTypes.func
};

export default PlaylistSongMenu;