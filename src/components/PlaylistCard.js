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
  }
});

class PlaylistCard extends Component {
  constructor(props) {
    super(props);

    this._onOptionPressed = this._onOptionPressed.bind(this);
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={this.props.onPress}>
        <View style={[styles.container, this.props.styles.container]}>
          <IconButton iconName='play-arrow' onPress={this.props.onPlayPress} style={styles._button} iconSize={styles._button.fontSize} />
          <View style={styles.infoContainer}>
            <View style={styles.songInformation}>
              <Text numberOfLines={1} style={[styles.textBold, this.props.styles.text]}>{this.props.name}</Text>
              <Text numberOfLines={1} style={[styles.text, this.props.styles.text]}>{this.props.songs.length + " songs"}</Text>
            </View>
          </View>
          <IconButton iconName='more-vert' onPress={this._onOptionPressed} onRef={ref => this._options = ref} style={styles._button} iconSize={styles._button.fontSize} />
        </View>
      </TouchableWithoutFeedback>
    );
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

PlaylistCard.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string,
  songs: PropTypes.array,
  onPress: PropTypes.func,
  onOptionPressed: PropTypes.func,
  onPlayPress: PropTypes.func
};

export default PlaylistCard;