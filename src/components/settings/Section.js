import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';

import {
  View,
  Text
} from 'react-native';

const styles = EStyleSheet.create({
  container: {
    width: '$appWidth',
    flexDirection: 'column',
    paddingTop: 10
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '$buttonSelected',
    paddingHorizontal: 20
  }
});

class Section extends PureComponent {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{this.props.title}</Text>
        {this.props.children}
      </View>
    );
  }
}

Section.propTypes = {
  title: PropTypes.string.isRequired
};

export default Section;