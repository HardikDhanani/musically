import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';

import {
  Text,
  TouchableOpacity
} from 'react-native';

const styles = EStyleSheet.create({
  container: {
    flexDirection: 'row',
    height: '$floatMenuOptionHeight',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10
  },
  text: {
    fontSize: '$titleFontSize',
    color: '$floatMenuOptionTextColor'
  }
});

class FloatMenuOption extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.text !== this.props.text
      || nextProps.haveContent !== this.props.haveContent;
  }

  render() {
    return (
      <TouchableOpacity onPress={this.props.onPress} style={styles.container}>
        <Text style={styles.text}>{this.props.text}</Text>
        {
          this.props.haveContent
            ? <Text style={styles.text}>{'>'}</Text>
            : null
        }
      </TouchableOpacity>
    );
  }
}

FloatMenuOption.propTypes = {
  text: PropTypes.string,
  haveContent: PropTypes.bool,
  onPress: PropTypes.func
};

export default FloatMenuOption;