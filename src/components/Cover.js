import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import {
  Image
} from 'react-native';

class Cover extends PureComponent {
  render() {
    return (
      <Image
        source={this.props.imageUri ? { uri: this.props.imageUri } : require('../images/default-cover.png')}
        style={{ width: this.props.width, height: this.props.height }} />
    );
  }
}

Cover.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  imageUri: PropTypes.string
};

export default Cover;