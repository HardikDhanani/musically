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
  },
  flex: {
    flex: 1
  }
});

class Body extends PureComponent {
  render() {
    let heightStyle = this.props.height ? { height: this.props.height } : styles.flex;
    return (
      <View style={[styles.body, heightStyle]}>
        {this.props.children}
      </View>
    );
  }
}

Body.propTypes = {
  height: PropTypes.number
};

export default Body;