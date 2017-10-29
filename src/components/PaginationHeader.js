import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';

import {
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Animated
} from 'react-native';

class PaginationHeader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      left: new Animated.Value(this.props.currentIndex)
    }

    this._styles = EStyleSheet.create({
      $totalButtons: this.props.total,
      container: {
        flexDirection: 'column',
        width: '$appWidth',
        height: '$headerHeight * 0.7',
        backgroundColor: '$headerBackgroundColor',
        paddingLeft: 2,
        paddingRight: 2,
        position: 'absolute',
        top: 0,
      },
      title: {
        color: '$headerColor',
        alignSelf: 'center',
        justifyContent: 'flex-end',
        flex: 1,
        textAlign: 'center',
        textAlignVertical: 'center'
      },
      pageButton: {
        height: 5,
        backgroundColor: '$buttonSelected',
        width: '$appWidth / $totalButtons'
      }
    });

    this._renderPaginationHeaders = this._renderPaginationHeaders.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.total !== nextProps.total
      || this.props.currentIndex !== nextProps.currentIndex;
  }

  render() {
    Animated.timing(
      this.state.left,
      {
        toValue: this._styles._pageButton.width * this.props.currentIndex,
        duration: 300
      }
    ).start();

    return (
      <View style={this._styles.container}>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
          {this._renderPaginationHeaders()}
        </View>
        <Animated.View style={[this._styles.pageButton, { left: this.state.left }]} />
      </View>
    );
  }

  _renderPaginationHeaders() {
    let ret = [];
    for (let i = 0; i < this.props.total; i++) {
      ret.push(
        <TouchableOpacity key={i} style={{ flex: 1, flexDirection: 'column' }} onPress={() => this.props.onPageChange(i)}>
          <Text style={this._styles.title}>
            {this.props.sectionTextGenerator(i)}
          </Text>
        </TouchableOpacity>
      );
    }

    return ret;
  }
}

PaginationHeader.propTypes = {
  total: PropTypes.number.isRequired,
  currentIndex: PropTypes.number.isRequired,
  onPageChange: PropTypes.func,
  sectionTextGenerator: PropTypes.func,
};

export default PaginationHeader;