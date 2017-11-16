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

class PlaylistMenu extends Component {
  render() {
    return (
      <FloatMenu contentHeight={styles._container.height} onPress={this.props.onPress} positionY={this.props.positionY} positionX={this.props.positionX}>
        <FloatMenuOption onPress={this.props.onPlayPress} key={1} text={'Play'} />
        <FloatMenuOption onPress={this.props.onAddToQueuePress} key={3} text={'Add to queue'} />
        <FloatMenuOption onPress={this.props.onDeletePress} key={4} text={'Delete playlist'} />
      </FloatMenu>
    );
  }
}

PlaylistMenu.propTypes = {
  positionX: PropTypes.number.isRequired,
  positionY: PropTypes.number.isRequired,
  onPress: PropTypes.func,
  onPlayPress: PropTypes.func,
  onDeletePress: PropTypes.func,
  onAddToQueuePress: PropTypes.func
};

export default PlaylistMenu;