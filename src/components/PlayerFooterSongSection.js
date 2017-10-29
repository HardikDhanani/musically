import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';

import {
  Text,
  View
} from 'react-native';

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 15
  },
  title: {
    fontSize: '$titleFontSize',
    color: '$footerColor',
    fontWeight: 'bold'
  },
  text: {
    fontSize: '$textFontSize',
    color: '$footerColor'
  }
});

class PlayerFooterSongSection extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.title !== this.props.title
      || nextProps.artist !== this.props.artist;
  }

  render() {
    return (
      <View style={styles.container}>
        <Text numberOfLines={1} style={styles.title}>{this.props.title}</Text>
        <Text numberOfLines={1} style={styles.text}>{this.props.artist}</Text>
      </View>
    );
  }
}

PlayerFooterSongSection.propTypes = {
  title: PropTypes.string,
  artist: PropTypes.string
};

export default PlayerFooterSongSection;