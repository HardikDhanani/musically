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

class ArtistCard extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.id !== nextProps.id;
  }

  render() {
    return (
      <CoverCard
        onPress={this.props.onPress}
        source={this.props.source}
        imageUri={this.props.imageUri}
        title={this.props.name}
        onOptionPressed={this.props.onOptionPressed}>
        <Text numberOfLines={1} style={styles.text}>{this.props.albums + ' albums'}</Text>
        <Text numberOfLines={1} style={styles.text}>{this.props.songs + ' songs'}</Text>
      </CoverCard>
    );
  }
}

ArtistCard.propTypes = {
  id: PropTypes.string.isRequired,
  imageUri: PropTypes.string,
  name: PropTypes.string,
  albums: PropTypes.number,
  songs: PropTypes.number,
  onPress: PropTypes.func,
  onOptionPressed: PropTypes.func
};

export default ArtistCard;