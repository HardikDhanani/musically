import React, { PureComponent } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  Text,
  Image
} from 'react-native';

import Button from './Button';

export default class CoverCard extends PureComponent {
  constructor(props) {
    super(props);

    this._onOptionPressed = this._onOptionPressed.bind(this);
  }

  render() {
    return (
      <View style={styles.card}>
        <TouchableOpacity style={styles.button} onPress={this.props.onPress}>
          <Image source={this.props.imageUri ? { uri: this.props.imageUri } : this.props.source} style={styles.image} />
        </TouchableOpacity>
        <View style={styles.body}>
          <Text numberOfLines={1} style={styles.title}>{this.props.title}</Text>
          <View style={styles.texts}>
            <View style={styles.info}>
              {this.props.children}
            </View>
            <Button onRef={ref => this._options = ref} onPress={this._onOptionPressed} text={'+'} textStyle={styles.itemText} />
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

  static get currentHeight() {
    return 160;
  }
}

const styles = StyleSheet.create({
  card: {
    margin: 1,
    padding: 2,
    width: (Dimensions.get('window').width / 3) - 4,
    height: CoverCard.currentHeight
  },
  button: {
    flex: 6
  },
  image: {
    height: 95,
    width: null
  },
  body: {
    paddingLeft: 5,
    flexDirection: 'column',
    backgroundColor: '#d3d3d3',
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
  itemText: {
    color: 'gray',
    fontSize: 16,
  },
});