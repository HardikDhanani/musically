import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';

import {
  View
} from 'react-native';
import Text from '../common/Text';

const styles = EStyleSheet.create({
  container: {
    width: '$appWidth',
    flexDirection: 'column',
    paddingVertical: 17,
    paddingHorizontal: 17
  },
  title: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '$textMainColor'
  },
  separator: {
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(215,215,215,1)',
    paddingTop: 15
  }
});

class Section extends PureComponent {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{this.props.title}</Text>
        <View style={styles.separator} />
        {this.props.children}
      </View>
    );
  }
}

Section.propTypes = {
  title: PropTypes.string.isRequired
};

export default Section;