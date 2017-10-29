import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';

import {
  View,
  Text,
  Image
} from 'react-native';

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    height: 200
  },
  image: {
    flex: 1
  },
  info: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    flexDirection: 'column',
    alignSelf: 'flex-start',
    marginBottom: 10,
    marginLeft: 15,
  },
  text: {
    fontSize: '$titleFontSize'
  },
  textBold: {
    fontSize: '$titleFontSize',
    fontWeight: 'bold'
  }
});

class ControlPanelCover extends PureComponent {
  render() {
    return (
      <View style={styles.container}>
        <Image source={this.props.source} style={styles.image} />
        <View style={styles.info}>
          <Text style={styles.textBold}>{this.props.song}</Text>
          <Text style={styles.text}>{this.props.artist}</Text>
        </View>
      </View>
    );
  }
}

ControlPanelCover.propTypes = {
  song: PropTypes.string,
  artist: PropTypes.string
};

export default ControlPanelCover;