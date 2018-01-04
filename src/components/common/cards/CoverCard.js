import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';

import {
  View,
  TouchableOpacity,
  Image
} from 'react-native';
import Text from '../Text';

const styles = EStyleSheet.create({
  $containerWidth: '$appWidth / 2',
  $cardWidth: '$containerWidth * 0.9',
  container: {
    margin: 7,
    marginTop: 16,
    width: '$cardWidth',
  },
  imageContainer: {
    elevation: 5,
    backgroundColor: 'white'
  },
  image: {
    height: '$cardWidth',
    width: null
  },
  title: {
    fontSize: '$bigTextFontSize',
    marginTop: 8,
    color: 'black'
  },
});

class CoverCard extends PureComponent {
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.props.onPress} style={styles.imageContainer} activeOpacity={0.7}>
          <Image source={this.props.imageUri ? { uri: this.props.imageUri } : this.props.source} style={styles.image} />
        </TouchableOpacity>
        <Text numberOfLines={1} style={styles.title}>{this.props.title}</Text>
        {
          this.props.detail ?
            <Text numberOfLines={1} style={styles.detail}>{this.props.detail}</Text> :
            null
        }
      </View>
    );
  }
}

CoverCard.propTypes = {
  imageUri: PropTypes.string,
  title: PropTypes.string,
  detail: PropTypes.string,
  onPress: PropTypes.func
};

export default CoverCard;