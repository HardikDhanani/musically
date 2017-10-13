import React, { Component } from 'react';
import {
  Text,
  TouchableOpacity
} from 'react-native';

import StyleManager from '../styles/StyleManager';

export default class FloatMenuOption extends Component {
  constructor(props){
    super(props);

    this._containerStyle = StyleManager.getStyle('FloatMenuOptionContainer');
    this._textStyle = StyleManager.getStyle('FloatMenuOptionText');
  }

  render() {
    return (
      <TouchableOpacity style={this._containerStyle}>
        <Text style={this._textStyle}>{this.props.text}</Text>
        {
          this.props.haveContent
            ? <Text style={this._textStyle}>{'>'}</Text>
            : null
        }
      </TouchableOpacity>
    );
  }
}