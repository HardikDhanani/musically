import React, { PureComponent } from 'react';
import {
  View
} from 'react-native';

export default class ThreeColumnContainer extends PureComponent {
  render() {
    return (
      <View style={{ flexDirection: 'row', flex: 1 }}>
        {this.props.items[0] ? this.props.renderItem(this.props.items[0]) : null}
        {this.props.items[1] ? this.props.renderItem(this.props.items[1]) : null}
        {this.props.items[2] ? this.props.renderItem(this.props.items[2]) : null}
      </View>
    );
  }
}