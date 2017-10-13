import React, { Component } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Animated
} from 'react-native';

import StyleManager from '../styles/StyleManager';

export default class PaginationHeader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      left: new Animated.Value(this.props.currentIndex)
    }

    this._pageButtonWidth = Dimensions.get('window').width / this.props.total;
    this._containerStyle = StyleManager.getStyle('PaginationHeaderContainer');
    this._titleStyle = StyleManager.getStyle('PaginationHeaderTitle');
    this._pageButtonStyle = StyleManager.getStyle('PaginationHeaderPageButton');
    this._pageButtonStyle.width = this._pageButtonWidth;
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.total !== nextProps.total || this.props.currentIndex !== nextProps.currentIndex;
  }

  render() {
    Animated.timing(
      this.state.left,
      {
        toValue: this._pageButtonWidth * this.props.currentIndex,
        duration: 300
      }
    ).start();

    return (
      <View style={this._containerStyle}>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
          {this._renderPaginationHeaders()}
        </View>
        <Animated.View style={[{ left: this.state.left }, this._pageButtonStyle]} />
      </View>
    );
  }

  _renderPaginationHeaders() {
    let ret = [];
    for (let i = 0; i < this.props.total; i++) {
      ret.push(
        <TouchableOpacity key={i} style={{ flex: 1, flexDirection: 'column' }} onPress={() => this.props.onPageChange(i)}>
          <Text style={this._titleStyle}>
            {this.props.sectionTextGenerator(i)}
          </Text>
        </TouchableOpacity>
      );
    }

    return ret;
  }
}