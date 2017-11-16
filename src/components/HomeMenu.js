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

class HomeMenu extends Component {
  render() {
    return (
      <FloatMenu contentHeight={styles._container.height} onPress={this.props.onPress} positionY={this.props.positionY} positionX={this.props.positionX}>
        <FloatMenuOption key={1} text={'Sort Order'} haveContent={true} />
        <FloatMenuOption key={2} text={'View Mode'} haveContent={true}/>
        <FloatMenuOption key={3} text={'Rescan Library'} />
        <FloatMenuOption key={4} text={'Playlist Queue'} />
      </FloatMenu>
    );
  }
}

HomeMenu.propTypes = {
  positionX: PropTypes.number.isRequired,
  positionY: PropTypes.number.isRequired,
  isFavorite: PropTypes.bool,
  onPress: PropTypes.func
};

export default HomeMenu;