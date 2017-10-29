import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';

import {
  View,
  Text
} from 'react-native';
import ProgressBar from '../components/ProgressBar';

const styles = EStyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    height: '$appHeight * 0.41',
    backgroundColor: '$headerBackgroundColor'
  },
  infoContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-between'
  },
  title: {
    lineHeight: 25,
    color: '$headerColor',
    fontSize: '$titleFontSize'
  },
  text: {
    lineHeight: 25,
    color: '$textColor'
  },
  progressBarContainer: {
    marginTop: 30
  },
  elapsedTimeContainer: {
    paddingTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});

class PlayerControls extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.title !== nextProps.title
      || this.props.artist !== nextProps.artist
      || this.props.album !== nextProps.album
      || this.props.currentIndex !== nextProps.currentIndex
      || this.props.totalSongs !== nextProps.totalSongs
      || this.props.elapsedTime !== nextProps.elapsedTime
      || this.props.duration !== nextProps.duration;
  }

  render() {
    let formattedElapsedTime = this._formatTime(this.props.elapsedTime);

    return (
      <View style={styles.container}>
        <Text style={styles.title}>{this.props.title}</Text>
        <Text style={styles.text}>{this.props.artist}</Text>
        <View style={styles.infoContainer}>
          <Text style={styles.text}>{this.props.album}</Text>
          <Text style={styles.text}>{this.props.currentIndex + '/' + this.props.totalSongs}</Text>
        </View>
        <View style={styles.progressBarContainer}>
          <ProgressBar
            total={this.props.total}
            elapsed={this.props.elapsedTime}
            showButton={true}
            onProgressChange={this.props.onProgressChange} />
          <View style={styles.elapsedTimeContainer}>
            <Text style={styles.text}>{formattedElapsedTime}</Text>
            <Text style={styles.text}>{this.props.duration}</Text>
          </View>
        </View>
      </View>
    );
  }

  _formatTime(elapsedTime) {
    let ret = "00:00";
    if (elapsedTime) {
      let d = new Date(parseInt(elapsedTime));
      let minutes = "00" + d.getMinutes().toString();
      let seconds = "00" + d.getSeconds().toString();
      ret = minutes.substring(minutes.length - 2, minutes.length) + ":" + seconds.substring(seconds.length - 2, seconds.length);
    }

    return ret;
  }
}

PlayerControls.propTypes = {
  title: PropTypes.string,
  artist: PropTypes.string,
  album: PropTypes.string,
  currentIndex: PropTypes.number,
  totalSongs: PropTypes.number,
  elapsedTime: PropTypes.number,
  duration: PropTypes.number,
  onProgressChange: PropTypes.func
};

export default PlayerControls;