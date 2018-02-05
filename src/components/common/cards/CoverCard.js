import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';

import {
  View,
  TouchableOpacity
} from 'react-native';
import Text from '../Text';
import Cover from '../../Cover';

const styles = EStyleSheet.create({
  container: {
    margin: 7,
    marginTop: 16,
    width: '$coverCardWidth',
  },
  imageContainer: {
    elevation: 5,
    backgroundColor: 'white',
    height: '$coverCardHeight',
    width: '$coverCardWidth',
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    height: '$coverCardHeight',
    width: '$coverCardWidth'
  },
  title: {
    fontSize: '$bigTextFontSize',
    marginTop: 8,
    color: 'black'
  },
});

class CoverCard extends PureComponent {
  render() {
    let imageHeight = this.props.imageUri ? styles._image.height : styles._image.height * 0.75;
    let imageWidth = this.props.imageUri ? styles._image.width : styles._image.width * 0.75;

    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.props.onPress} style={styles.imageContainer} activeOpacity={0.7}>
          <Cover imageUri={this.props.imageUri} height={imageHeight} width={imageWidth} />
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
  title: PropTypes.string.isRequired,
  detail: PropTypes.string,
  onPress: PropTypes.func.isRequired
};

export default CoverCard;