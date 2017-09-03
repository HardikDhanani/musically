import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Text,
  Platform,
  Dimensions
} from 'react-native';

import Button from './Button';

export default class SongCard extends Component {
  constructor(props) {
    super(props);

    this._onOptionPressed = this._onOptionPressed.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.id !== nextProps.id;
  }

  render() {
    let buttonTextStyle = [styles.itemText, this.props.styles.text, { fontSize: 25 }];
    let duration = null;
    if (this.props.duration) {
      let d = new Date(parseInt(this.props.duration));
      let minutes = "00" + d.getMinutes().toString();
      let seconds = "00" + d.getSeconds().toString();
      duration = minutes.substring(minutes.length - 2, minutes.length) + ":" + seconds.substring(seconds.length - 2, seconds.length);
    }
    return (
      <TouchableWithoutFeedback onPress={this.props.onPress}>
        <View style={[styles.songCard, this.props.styles.container]}>
          <Button text={'>'} textStyle={buttonTextStyle} />
          <View style={{ flexDirection: 'row', flex: 1, paddingHorizontal: 5 }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start', height: SongCard.currentHeight * 0.7, width: SongCard.currentHeight * 0.7 }}>
              <Text numberOfLines={1} style={[styles.itemText, this.props.styles.text, { fontSize: 16, fontWeight: 'bold' }]}>{this.props.name}</Text>
              <Text numberOfLines={1} style={[styles.itemText, this.props.styles.text, { fontSize: 12 }]}>{this.props.artist}</Text>
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center', height: SongCard.currentHeight * 0.7, width: SongCard.currentHeight * 0.7 }}>
              <Text numberOfLines={1} style={[styles.itemText, this.props.styles.text, { fontSize: 12 }]}>{duration || "00:00"}</Text>
            </View>
          </View>
          <Button onRef={ref => this._options = ref} onPress={this._onOptionPressed} text={'+'} textStyle={buttonTextStyle} />
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

  static get currentHeight() {
    return (Platform.OS === "ios" ? 64 : 56);
  }
}

const styles = StyleSheet.create({
  itemText: {
    color: 'white',
    fontSize: 16,
  },
  songCard: {
    flexDirection: 'row',
    width: Dimensions.get('window').width,
    height: SongCard.currentHeight,
    backgroundColor: '#4c4c4c',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10
  },
});