import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';

import {
  View
} from 'react-native';
import IconButton from './common/buttons/IconButton';
import PlayPauseButton from './common/buttons/PlayPauseButton';

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: 10
  },
  button: {
    color: 'black',
    backgroundColor: 'transparent',
    fontSize: 35
  }
});

class PlayerFooterControlsSection extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.playing !== this.props.playing;
  }

  render() {
    return (
      <View style={styles.container}>
        <IconButton iconName='fast-rewind' onPress={this.props.onPrevPress} style={styles._button} iconSize={styles._button.fontSize} />
        <PlayPauseButton iconName={this.props.playing ? 'pause' : 'play-arrow' } onPress={this.props.onPlayPausePress} style={styles._button} iconSize={styles._button.fontSize} />
        <IconButton iconName='fast-forward' onPress={this.props.onNextPress} style={styles._button} iconSize={styles._button.fontSize} />
      </View>
    );
  }
}

PlayerFooterControlsSection.propTypes = {
  playing: PropTypes.bool,
  onPrevPress: PropTypes.func,
  onPlayPausePress: PropTypes.func,
  onNextPress: PropTypes.func
};

export default PlayerFooterControlsSection;