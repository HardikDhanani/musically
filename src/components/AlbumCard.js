import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';

import {
  Text
} from 'react-native';
import CoverCard from './CoverCard';

const styles = EStyleSheet.create({
  text: {
    fontSize: '$textFontSize'
  }
});

class AlbumCard extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }

  render() {
    return (
      <CoverCard
        onPress={this.props.onPress}
        source={this.props.source}
        imageUri={this.props.imageUri}
        title={this.props.name}
        onOptionPressed={this.props.onOptionPressed}>
        <Text numberOfLines={1} style={styles.text}>{this.props.artist}</Text>
        <Text numberOfLines={1} style={styles.text}>{this.props.songsDescription}</Text>
      </CoverCard>
    );
  }
}

AlbumCard.propTypes = {
  imageUri: PropTypes.string,
  name: PropTypes.string.isRequired,
  artist: PropTypes.string.isRequired,
  songsDescription: PropTypes.number.isRequired,
  onPress: PropTypes.func,
  onOptionPressed: PropTypes.func
};

export default AlbumCard;