import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';

import {
  View
} from 'react-native';
import ProgressBar from '../components/ProgressBar';
import Text from '../components/common/Text';
import IconButton from '../components/common/buttons/IconButton';
import FavoriteButton from '../components/common/buttons/FavoriteButton';

const styles = EStyleSheet.create({
  container: {
    paddingHorizontal: 20,
    width: '$appWidth'
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  infoContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    lineHeight: 25,
    color: '$headerColor',
    fontSize: '$titleFontSize'
  },
  text: {
    lineHeight: 25,
    color: 'rgb(200, 200, 200)'
  },
  progressBarContainer: {
    marginTop: 30
  },
  elapsedTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  button: {
    backgroundColor: 'transparent',
    fontSize: '$headerIconSize',
    color: '$elementInactive'
  },
  likedButton: {
    color: '$appMainColor',
    backgroundColor: 'transparent',
    fontSize: '$headerIconSize',
    borderColor: 'white'
  },
  unlikedButton: {
    color: '$elementInactive',
    backgroundColor: 'transparent',
    fontSize: '$headerIconSize',
    borderColor: '$elementInactive'
  },
});

class PlayerControls extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.liked !== nextProps.liked
      || this.props.title !== nextProps.title
      || this.props.artist !== nextProps.artist
      || this.props.album !== nextProps.album
      || this.props.elapsedTime !== nextProps.elapsedTime
      || this.props.duration !== nextProps.duration;
  }

  render() {
    let formattedElapsedTime = this._formatTime(this.props.elapsedTime);
    let title = this.props.title || '';
    let detail = this.props.artist || '';
    detail = detail + (this.props.album ? ' - ' + this.props.album : '');

    return (
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <IconButton iconName='add' style={styles._button} iconSize={styles._button.fontSize + 6} />
          <View style={styles.infoContainer}>
            <Text numberOfLines={1} style={styles.title}>{title}</Text>
            <Text numberOfLines={1} style={styles.text}>{detail}</Text>
          </View>
          <FavoriteButton borderColor={this.props.liked ? styles._likedButton.borderColor : styles._unlikedButton.borderColor} onPress={() => this.props.onLikePress()} iconName='favorite' style={this.props.liked ? styles._likedButton : styles._unlikedButton} iconSize={styles._button.fontSize} />
        </View>
        <View style={styles.progressBarContainer}>
          <ProgressBar
            total={this.props.total}
            elapsed={this.props.elapsedTime}
            showElevation={true}
            onProgressChange={this.props.onProgressChange}
            color={styles._button.color}
            backgroundColor={'white'}
            showBorderRadius={true} />
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
  title: PropTypes.string.isRequired,
  artist: PropTypes.string.isRequired,
  album: PropTypes.string.isRequired,
  elapsedTime: PropTypes.number.isRequired,
  duration: PropTypes.string.isRequired,
  liked: PropTypes.bool.isRequired,
  onProgressChange: PropTypes.func.isRequired,
  onLikePress: PropTypes.func.isRequired
};

export default PlayerControls;