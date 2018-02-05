import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';

import {
  View
} from 'react-native';
import Text from './common/Text';
import RowCard from './common/cards/RowCard';
import CheckBox from './common/buttons/CheckBox';

const styles = EStyleSheet.create({
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 5
  },
  text: {
    color: '$textColor',
    fontSize: '$textFontSize'
  },
  textBold: {
    color: '$textMainColor',
    fontSize: '$bigTextFontSize'
  },
  checkboxChecked: {
    color: '$appMainColor',
  },
  checkboxUnchecked: {
    color: '$elementInactive',
  }
});

class SongCardWithCheck extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.selected !== nextProps.selected;
  }

  render() {
    let duration = '00:00';
    if (this.props.duration) {
      let d = new Date(parseInt(this.props.duration));
      let minutes = "00" + d.getMinutes().toString();
      let seconds = "00" + d.getSeconds().toString();
      duration = minutes.substring(minutes.length - 2, minutes.length) + ":" + seconds.substring(seconds.length - 2, seconds.length);
    }

    return (
      <RowCard onPress={this.props.onSelectSong}>
        <View style={styles.infoContainer}>
          <View>
            <Text numberOfLines={1} style={styles.textBold}>{this.props.title}</Text>
            <Text numberOfLines={1} style={styles.text}>{this.props.artist}</Text>
          </View>
          <View>
            <Text numberOfLines={1} style={styles.text}>{duration}</Text>
          </View>
        </View>
        <CheckBox onChange={this.props.onSelectSong} style={this.props.selected ? styles.checkboxChecked : styles.checkboxUnchecked} />
      </RowCard>
    );
  }
}

SongCardWithCheck.propTypes = {
  title: PropTypes.string.isRequired,
  artist: PropTypes.string,
  duration: PropTypes.number,
  selected: PropTypes.bool.isRequired,
  onSelectSong: PropTypes.func.isRequired
};

export default SongCardWithCheck;