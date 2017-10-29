import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';

import {
  View,
  TouchableOpacity,
  Text,
  Image
} from 'react-native';
import IconButton from './common/buttons/IconButton';

const styles = EStyleSheet.create({
  $containerWidth: '$appWidth / 3',
  container: {
    margin: 1,
    padding: 2,
    width: '$containerWidth - 4',
    height: 160
  },
  imageContainer: {
    flex: 6
  },
  image: {
    height: 95,
    width: null
  },
  body: {
    paddingLeft: 5,
    flexDirection: 'column',
    backgroundColor: '$body_1_backgroundColor',
    flex: 4
  },
  title: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 12,
    paddingRight: 5
  },
  texts: {
    flexDirection: 'row',
    flex: 2
  },
  info: {
    flexDirection: 'column',
    flex: 10
  },
  button: {
    color: '$headerColor',
    backgroundColor: 'transparent',
    fontSize: '$iconSize'
  }
});

class CoverCard extends PureComponent {
  constructor(props) {
    super(props);

    this._onOptionPressed = this._onOptionPressed.bind(this);
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.imageContainer} onPress={this.props.onPress}>
          <Image source={this.props.imageUri ? { uri: this.props.imageUri } : this.props.source} style={styles.image} />
        </TouchableOpacity>
        <View style={styles.body}>
          <Text numberOfLines={1} style={styles.title}>{this.props.title}</Text>
          <View style={styles.texts}>
            <View style={styles.info}>
              {this.props.children}
            </View>
            <IconButton iconName='more-vert' onPress={this._onOptionPressed} onRef={ref => this._options = ref} style={styles._button} iconSize={styles._button.fontSize} />
          </View>
        </View>
      </View>
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

CoverCard.propTypes = {
  imageUri: PropTypes.string,
  title: PropTypes.string,
  onPress: PropTypes.func,
  onOptionPressed: PropTypes.func,
};

export default CoverCard;