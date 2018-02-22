import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';

import {
  FlatList,
  View,
  Text
} from 'react-native';

const styles = EStyleSheet.create({
  title: {
    width: '$appWidth',
    height: '$headerHeight * 0.7',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    paddingLeft: 10,
    marginTop: 5,
  },
  text: {
    color: '$elementInactive',
    fontSize: '$textFontSize',
    fontWeight: 'bold'
  }
});

class GroupSection extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.title !== this.props.title
      || nextProps.data !== this.props.data;
  }

  render() {
    return (
      <View>
        {
          (!this.props.data || this.props.data.length === 0) ?
            null :
            <View style={styles.title}>
              <Text style={styles.text}>{this.props.title}</Text>
            </View>
        }
        <FlatList
          getItemLayout={this.props.getItemLayout}
          data={this.props.data}
          renderItem={this.props.renderItem}
          keyExtractor={this.props.keyExtractor}
          numColumns={this.props.numColumns}
          key={this.props.numColumns} />
      </View>
    );
  }
}

GroupSection.propTypes = {
  title: PropTypes.string,
  renderItem: PropTypes.func,
  keyExtractor: PropTypes.func,
  getItemLayout: PropTypes.func
};

export default GroupSection;