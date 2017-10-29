import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';

import {
  View,
  TouchableWithoutFeedback,
  Text
} from 'react-native';
import IconButton from './common/buttons/IconButton';

const styles = EStyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '$appWidth',
    height: '$headerHeight',
    backgroundColor: '$headerBackgroundColor',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10
  },
  text: {
    color: '$headerColor',
    fontSize: '$textFontSize',
  },
  textBold: {
    color: '$headerColor',
    fontSize: '$bigTextFontSize',
    fontWeight: 'bold'
  },
  button: {
    color: '$elementInactive',
    backgroundColor: 'transparent',
    fontSize: '$headerIconSize'
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
  durationContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '$headerHeight * 0.7',
    width: '$headerHeight * 0.7'
  }
});

class SongCard extends Component {
  constructor(props) {
    super(props);

    this._onOptionPressed = this._onOptionPressed.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.id !== nextProps.id;
  }

  render() {
    let duration = this._getDuration(this.props.duration);

    return (
      <TouchableWithoutFeedback onPress={this.props.onPress}>
        <View style={[styles.container, this.props.styles.container]}>
          <IconButton iconName='play-arrow' onPress={this.props.onPlayPress} style={styles._button} iconSize={styles._button.fontSize} />
          <View style={styles.infoContainer}>
            <View style={styles.songInformation}>
              <Text numberOfLines={1} style={[styles.textBold, this.props.styles.text]}>{this.props.name}</Text>
              <Text numberOfLines={1} style={[styles.text, this.props.styles.text]}>{this.props.artist}</Text>
            </View>
            <View style={styles.durationContainer}>
              <Text numberOfLines={1} style={[styles.text, this.props.styles.text]}>{duration || '00:00'}</Text>
            </View>
          </View>
          <IconButton iconName='more-vert' onPress={this._onOptionPressed} onRef={ref => this._options = ref} style={styles._button} iconSize={styles._button.fontSize} />
        </View>
      </TouchableWithoutFeedback>
    );
  }

  _getDuration(duration) {
    if (duration) {
      let d = new Date(parseInt(duration));
      let minutes = "00" + d.getMinutes().toString();
      let seconds = "00" + d.getSeconds().toString();
      return minutes.substring(minutes.length - 2, minutes.length) + ":" + seconds.substring(seconds.length - 2, seconds.length);
    }

    return null;
  }

  _onOptionPressed() {
    this._options.measure((fx, fy, width, height, px, py) => {
      if (this.props.onOptionPressed)
        this.props.onOptionPressed({
          relativeX: fx,
          relativeY: fy,
          absoluteX: px,
          absoluteY: py,
          height,
          width
        });
    });
  }
}

SongCard.propTypes = {
  id: PropTypes.string.isRequired,
  duration: PropTypes.string,
  name: PropTypes.string,
  artist: PropTypes.string,
  onPress: PropTypes.func,
  onOptionPressed: PropTypes.func,
  onPlayPress: PropTypes.func
};

export default SongCard;