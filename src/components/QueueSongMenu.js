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

class QueueSongMenu extends Component {
  render() {
    return (
      <FloatMenu contentHeight={styles._container.height} onPress={this.props.onPress} positionY={this.props.positionY} positionX={this.props.positionX}>
        <FloatMenuOption onPress={this.props.onPlayPress} key={1} text={'Play'} />
        <FloatMenuOption onPress={this.props.onArtistPress} key={2} text={'Artist'} />
        <FloatMenuOption onPress={this.props.onAlbumPress} key={3} text={'Album'} />
        <FloatMenuOption onPress={this.props.onRemovePress} key={4} text={'Remove from queue'} />
      </FloatMenu>
    );
  }
}

QueueSongMenu.propTypes = {
  positionX: PropTypes.number.isRequired,
  positionY: PropTypes.number.isRequired,
  onPress: PropTypes.func,
  onPlayPress: PropTypes.func,
  onRemovePress: PropTypes.func,
  onArtistPress: PropTypes.func,
  onAlbumPress: PropTypes.func
};

export default QueueSongMenu;