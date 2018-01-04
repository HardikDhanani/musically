import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';

import {
  View,
  TouchableOpacity,
  Image
} from 'react-native';
import Text from '../Text';
import TwoColumnContainer from '../containers/TwoColumnContainer';

const styles = EStyleSheet.create({
  $containerWidth: '$appWidth / 2',
  $cardWidth: '$containerWidth * 0.9',
  $imageWidth: '$cardWidth / 2',
  container: {
    margin: 7,
    marginTop: 16,
    width: '$cardWidth'
  },
  coversContainer: {
    elevation: 5,
    flexDirection: 'column',
    backgroundColor: 'white'
  },
  imageContainer: {
    height: '$imageWidth',
    width: '$imageWidth',
  },
  image: {
    height: '$imageWidth',
    width: null
  },
  title: {
    fontSize: '$bigTextFontSize',
    marginTop: 8,
    color: 'black'
  },
});

class FourCoverCard extends PureComponent {
  constructor(props) {
    super(props);

    this._renderCover = this._renderCover.bind(this);
  }

  render() {
    let firstPair = [
      {
        imageUri: this.props.items[0] ? this.props.items[0].imageUri : null,
        source: this.props.defaultSource,
      },
      {
        imageUri: this.props.items[1] ? this.props.items[1].imageUri : null,
        source: this.props.defaultSource,
      },
    ]

    let secondPair = [
      {
        imageUri: this.props.items[2] ? this.props.items[2].imageUri : null,
        source: this.props.defaultSource,
      },
      {
        imageUri: this.props.items[3] ? this.props.items[3].imageUri : null,
        source: this.props.defaultSource,
      },
    ]

    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.props.onPress} style={styles.coversContainer} activeOpacity={0.7}>
          <TwoColumnContainer items={firstPair} renderItem={this._renderCover} />
          <TwoColumnContainer items={secondPair} renderItem={this._renderCover} />
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

  _renderCover(item) {
    return (
      <View style={styles.imageContainer}>
        <Image source={item.imageUri ? { uri: item.imageUri } : require('../../../images/music.png')} style={styles.image} />
      </View>
    );
  }
}

FourCoverCard.propTypes = {
  items: PropTypes.array.isRequired,
  title: PropTypes.string,
  detail: PropTypes.string,
  onPress: PropTypes.func
};

export default FourCoverCard;