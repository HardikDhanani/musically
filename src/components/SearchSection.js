import React, { PureComponent } from 'react';

import { FlatList, View, Text } from 'react-native';
import StyleManager from '../styles/StyleManager';

export default class SearchSection extends PureComponent {
  constructor(props) {
    super(props);

    this._titleStyle = StyleManager.getStyle('SearchSectionTitle');
    this._textStyle = StyleManager.getStyle('SearchSectionTitleText');
  }

  render() {
    return (
      <View>
        <View style={this._titleStyle}>
          <Text style={this._textStyle}>{this.props.title}</Text>
        </View>
        <FlatList
          getItemLayout={this.props.getItemLayout}
          data={this.props.data}
          renderItem={this.props.renderItem}
          keyExtractor={this.props.keyExtractor} />
      </View>
    );
  }
}