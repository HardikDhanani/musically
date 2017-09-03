import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Animated
} from 'react-native';

import Header from '../components/Header';

export default class PaginationHeader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      left: new Animated.Value(this.props.currentIndex)
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.total !== nextProps.total || this.props.currentIndex !== nextProps.currentIndex;
  }

  render() {
    let width = Dimensions.get('window').width / this.props.total;
    Animated.timing(
      this.state.left,
      {
        toValue: width * this.props.currentIndex,
        duration: 300
      }
    ).start();

    return (
      <View style={styles.pagination}>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
          {this._renderPaginationHeaders()}
        </View>
        <Animated.View style={{ left: this.state.left, width: width, height: 5, backgroundColor: '#ffa500', }} />
      </View>
    );
  }

  _renderPaginationHeaders() {
    let ret = [];
    for (let i = 0; i < this.props.total; i++) {
      ret.push(
        <TouchableOpacity key={i} style={{ flex: 1, flexDirection: 'column' }} onPress={() => this.props.onPageChange(i)}>
          <Text style={[styles.title, { flex: 1, textAlign: 'center', textAlignVertical: 'center' }]}>
            {this.props.sectionTextGenerator(i)}
          </Text>
        </TouchableOpacity>
      );
    }

    return ret;
  }

  static get currentHeight() {
    return Header.currentHeight * 0.7;
  }
}

const styles = StyleSheet.create({
  pagination: {
    flexDirection: 'column',
    width: Dimensions.get('window').width,
    height: PaginationHeader.currentHeight,
    backgroundColor: '#2E2E2E',
    paddingLeft: 2,
    paddingRight: 2,
    position: 'absolute',
    top: 0,
  },
  title: {
    color: 'white',
    alignSelf: 'center',
    justifyContent: 'flex-end',
  },
});