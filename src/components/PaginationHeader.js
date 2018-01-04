import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';
import LinearGradient from 'react-native-linear-gradient';

import {
  TouchableOpacity,
  View,
  Animated
} from 'react-native';
import Text from './common/Text';

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
        height: '$paginationHeaderHeight',
        paddingLeft: 2,
        paddingRight: 2,
        position: 'absolute',
        top: 0,
        backgroundColor: 'white',
        elevation: 5
      },
      gradientStart: {
        color: '$headerStartGradientBackgroundColor'
      },
      gradientEnd: {
        color: '$headerEndGradientBackgroundColor'
      },
      title: {
        color: '$paginationHeaderTextColor',
        alignSelf: 'center',
        justifyContent: 'flex-end',
        flex: 1,
        textAlign: 'center',
        textAlignVertical: 'center'
      },
      pageButton: {
        height: 5,
        width: '$appWidth / $totalButtons'
      },
      pageButtonLeft: {
        backgroundColor: '$paginationHeaderColorLeft'
      },
      pageButtonRight: {
        backgroundColor: '$paginationHeaderColorRight'
      }
    });

    this._renderPaginationHeaders = this._renderPaginationHeaders.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.total !== nextProps.total
      || this.props.currentIndex !== nextProps.currentIndex
      || this.props.language !== nextProps.language;
  }

  render() {
    Animated.timing(
      this.state.left,
      {
        toValue: this._styles._pageButton.width * this.props.currentIndex,
        duration: 300
      }
    ).start();

    let backgroundColor = this.props.currentIndex < 2 ? this._styles._pageButtonLeft.backgroundColor : this._styles._pageButtonRight.backgroundColor;

    return (
      <LinearGradient
        start={{ x: 0.0, y: 1.0 }}
        end={{ x: 1.0, y: 1.0 }}
        colors={[this._styles._gradientStart.color, this._styles._gradientEnd.color]}
        style={this._styles.container}>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
          {this._renderPaginationHeaders()}
        </View>
        <Animated.View style={[this._styles.pageButton, { backgroundColor, left: this.state.left }]} />
      </LinearGradient>
    );
  }

  _renderPaginationHeaders() {
    let ret = [];
    for (let i = 0; i < this.props.total; i++) {
      ret.push(
        <TouchableOpacity key={i} style={{ flex: 1, flexDirection: 'column' }} onPress={() => this.props.onPageChange(i)}>
          <Text style={[this._styles.title, { fontWeight: this.props.currentIndex === i ? 'bold' : 'normal' }]}>
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