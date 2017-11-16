import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';

import {
  View
} from 'react-native';

const styles = EStyleSheet.create({
  body: {
    alignItems: 'center',
    alignSelf: 'center',
    height: '$bodyHeight',
  },
  paginationHeader: {
    marginTop: '$paginationHeader',
    height: '$paginationHeader'
  }
});

class Body extends PureComponent {
  render() {
    let height = this.props.hasPaginationHeader
      ? styles._body.height - styles._paginationHeader.height
      : styles._body.height;

    let marginTop = this.props.hasPaginationHeader ? styles._paginationHeader.marginTop : 0;

    return (
      <View style={[styles.body, { height, marginTop }]}>
        {this.props.children}
      </View>
    );
  }
}

Body.propTypes = {
  height: PropTypes.number
};

export default Body;