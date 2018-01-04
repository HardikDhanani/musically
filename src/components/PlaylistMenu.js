import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';

import FloatMenu from './FloatMenu';
import FloatMenuOption from './FloatMenuOption';

const styles = EStyleSheet.create({
  container: {
    height: '$floatMenuOptionHeight'
  }
});

class PlaylistMenu extends Component {
  render() {
    let items = this.props.showDelete ? 3 : 2;
    return (
      <FloatMenu contentHeight={styles._container.height * items} onPress={this.props.onPress} positionY={this.props.positionY} positionX={this.props.positionX}>
        <FloatMenuOption onPress={this.props.onPlayPress} key={1} text={this.props.getWord('play')} />
        <FloatMenuOption onPress={this.props.onAddToQueuePress} key={3} text={this.props.getWord('addToQueue')} />
        {
          this.props.showDelete
            ? <FloatMenuOption onPress={this.props.onDeletePress} key={4} text={this.props.getWord('deletePlaylist')} />
            : null
        }
      </FloatMenu>
    );
  }
}

PlaylistMenu.propTypes = {
  positionX: PropTypes.number.isRequired,
  positionY: PropTypes.number.isRequired,
  getWord: PropTypes.func,
  onPress: PropTypes.func,
  onPlayPress: PropTypes.func,
  onDeletePress: PropTypes.func,
  onAddToQueuePress: PropTypes.func
};

export default PlaylistMenu;