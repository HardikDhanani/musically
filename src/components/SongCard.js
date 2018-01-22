import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';

import {
  View
} from 'react-native';
import Text from './common/Text';
import IconButton from './common/buttons/IconButton';
import PlayPauseButtonWhite from './common/buttons/PlayPauseButtonWhite';

const styles = EStyleSheet.create({
  container: {
    flexDirection: 'row',
    height: '$headerHeight * 1.5',
    backgroundColor: 'white',
    alignItems: 'center',
    marginHorizontal: 10,
    marginVertical: 7,
    paddingHorizontal: 6,
    borderRadius: 6,
    elevation: 5
  },
  detail: {
    color: '$textColor',
    fontSize: '$textFontSize',
  },
  title: {
    color: '$textMainColor',
    fontSize: '$bigTextFontSize',
  },
  buttonEnabled: {
    color: '$buttonEnabled',
    backgroundColor: 'transparent',
    fontSize: '$headerIconSize'
  },
  buttonDisabled: {
    color: '$buttonDisabled',
    backgroundColor: 'transparent',
    fontSize: '$headerIconSize'
  },
  plusButton: {
    color: '$elementInactive',
    backgroundColor: 'transparent',
    fontSize: 35
  },
  infoContainer: {
    flexDirection: 'row',
    flex: 1,
    paddingHorizontal: 5
  },
  songInformation: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    height: '$headerHeight * 0.7'
  },
  playPauseButton: {
    marginHorizontal: 5
  }
});

class SongCard extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.id !== nextProps.id
      || this.props.isFavorite !== nextProps.isFavorite
      || this.props.isPlaying !== nextProps.isPlaying;
  }

  render() {
    return (
      <View style={styles.container}>
        <PlayPauseButtonWhite iconName={this.props.isPlaying ? 'pause' : 'play-arrow'} style={styles.playPauseButton} onPress={this.props.onPlayPress} />
        <View style={styles.infoContainer}>
          <View style={styles.songInformation}>
            <Text numberOfLines={1} style={styles.title}>{this.props.name}</Text>
            <Text numberOfLines={1} style={styles.detail}>{this.props.artist}</Text>
          </View>
        </View>
        <View style={{marginRight: 10}}>
          <IconButton iconName={'add'} onPress={this.props.onOptionPress} style={styles._plusButton} iconSize={styles._plusButton.fontSize} />
        </View>
        <IconButton iconName={'favorite'} onPress={this.props.onLikePress} style={this.props.isFavorite ? styles._buttonEnabled : styles._buttonDisabled} iconSize={styles._buttonEnabled.fontSize} />
      </View>
    );
  }
}

SongCard.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  artist: PropTypes.string,
  isFavorite: PropTypes.bool,
  isPlaying: PropTypes.bool,
  onPress: PropTypes.func,
  onOptionPress: PropTypes.func,
  onPlayPress: PropTypes.func,
  onLikePress: PropTypes.func
};

export default SongCard;