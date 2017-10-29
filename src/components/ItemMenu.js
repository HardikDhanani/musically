import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';

import {
  TouchableOpacity,
  Text,
  View
} from 'react-native';

const styles = EStyleSheet.create({
  option: {
    flexDirection: 'row',
    height: '$floatMenuOptionHeight * 0.8',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10
  },
  optionText: {
    fontSize: '$textFontSize',
    color: '$floatMenuOptionTextColor'
  }
});

class ItemMenu extends Component {
  render() {
    return (
      <View>
        <TouchableOpacity key={1} style={styles.option} onPress={this.props.onPlayPress}>
          <Text style={styles.optionText}>{'Play'}</Text>
        </TouchableOpacity>
        <TouchableOpacity key={2} style={styles.option} onPress={this.props.onAddToPlaylistPress}>
          <Text style={styles.optionText}>{'Add to playlist'}</Text>
        </TouchableOpacity>
        <TouchableOpacity key={3} style={styles.option} onPress={this.props.onAddToQueuePress}>
          <Text style={styles.optionText}>{'Add to queue'}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  static get currentHeight() {
    return styles._option.height * 3;
  }
}

ItemMenu.propTypes = {
  onPlayPress: PropTypes.func,
  onAddToPlaylistPress: PropTypes.func,
  onAddToQueuePress: PropTypes.func
};

export default ItemMenu;