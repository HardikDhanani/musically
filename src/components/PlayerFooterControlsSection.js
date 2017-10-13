import React, { Component } from 'react';
import {
  View
} from 'react-native';

import StyleManager from '../styles/StyleManager';

import Button from './Button';

export default class PlayerFooterControlsSection extends Component {
  constructor(props) {
    super(props);

    this._containerStyle = StyleManager.getStyle('PlayerFooterControlsSection');
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.playPauseText !== this.props.playPauseText;
  }

  render() {
    return (
      <View style={this._containerStyle}>
        <Button text={'<<'} onPress={this.props.onPrevPress} />
        <Button text={this.props.playPauseText} onPress={this.props.onPlayPausePress} />
        <Button text={'>>'} onPress={this.props.onNextPress} />
      </View>
    );
  }
}