import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import FloatMenu from './FloatMenu';
import FloatMenuOption from './FloatMenuOption';

class HeaderMenu extends PureComponent {
  render() {
    return (
      <FloatMenu onPress={this.props.onPress} positionY={this.props.positionY} positionX={this.props.positionX}>
        <FloatMenuOption key={1} text={'Sort Order'} haveContent={true} />
        <FloatMenuOption key={2} text={'View Mode'} haveContent={true} />
        <FloatMenuOption key={3} text={'Rescan Library'} />
        <FloatMenuOption key={4} text={'Playlist Queue'} />
      </FloatMenu>
    );
  }
}

HeaderMenu.propTypes = {
  positionY: PropTypes.number.isRequired,
  positionX: PropTypes.number.isRequired,
  onPress: PropTypes.func
};

export default HeaderMenu;