import React, { PureComponent } from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';

import {
  Text as TextReact
} from 'react-native';

const styles = EStyleSheet.create({
  text: {
    fontFamily: '$fontFamily'
  }
});

class Text extends PureComponent {
  render() {
    return (
      <TextReact numberOfLines={this.props.numberOfLines} style={[styles.text, this.props.style]}>
        {this.props.children}
      </TextReact>
    );
  }
}

export default Text;