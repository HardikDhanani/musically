import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
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

Text.propTypes = {
  imageUri: PropTypes.string,
  title: PropTypes.string,
  onPress: PropTypes.func,
  onOptionPressed: PropTypes.func,
};

export default Text;