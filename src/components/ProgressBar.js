import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';

import {
  View
} from 'react-native';

const styles = EStyleSheet.create({
  appWidth: {
    width: '$appWidth'
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 6,
    backgroundColor: 'white'
  },
  elapsed: {
    height: 6,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
  left: {
    height: 6,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
  elevation: {
    elevation: 3
  }
});

class ProgressBar extends Component {
  constructor(props) {
    super(props);

    this._calculateMainContainerStyle = this._calculateMainContainerStyle.bind(this);
    this._calculateElapsedContainerStyle = this._calculateElapsedContainerStyle.bind(this);
    this._calculateLeftContainerStyle = this._calculateLeftContainerStyle.bind(this);
  }

  render() {
    let percentage = this.props.total ? ((this.props.elapsed * 100) / this.props.total) / 100 : 0;
    let elapsedWidth = styles._appWidth.width * percentage;
    let leftWidth = styles._appWidth.width - elapsedWidth;

    return (
      <View style={this._calculateMainContainerStyle()}>
        <View style={this._calculateElapsedContainerStyle(elapsedWidth)} />
        <View style={this._calculateLeftContainerStyle(leftWidth)} />
      </View>
    );
  }

  _calculateMainContainerStyle() {
    return [
      styles.container,
      this.props.showElevation ? styles.elevation : null,
      {
        borderTopLeftRadius: this.props.showBorderRadius ? 5 : 0,
        borderBottomLeftRadius: this.props.showBorderRadius ? 5 : 0,
        borderTopRightRadius: this.props.showBorderRadius ? 5 : 0,
        borderBottomRightRadius: this.props.showBorderRadius ? 5 : 0,
        backgroundColor: this.props.backgroundColor
      }
    ];
  }

  _calculateElapsedContainerStyle(elapsedWidth) {
    return [
      styles.elapsed,
      {
        borderTopLeftRadius: this.props.showBorderRadius ? 5 : 0,
        borderBottomLeftRadius: this.props.showBorderRadius ? 5 : 0
      },
      { flex: elapsedWidth, backgroundColor: this.props.color }
    ];
  }

  _calculateLeftContainerStyle(leftWidth) {
    return [
      styles.left,
      {
        borderTopRightRadius: this.props.showBorderRadius ? 5 : 0,
        borderBottomRightRadius: this.props.showBorderRadius ? 5 : 0
      },
      { flex: leftWidth }
    ];
  }
}

ProgressBar.propTypes = {
  elapsed: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  showElevation: PropTypes.bool,
  showBorderRadius: PropTypes.bool
};

export default ProgressBar;