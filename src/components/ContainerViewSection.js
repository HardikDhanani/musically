import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';

import {
  View,
  Text,
  FlatList
} from 'react-native';
import Container from './Container';

const styles = EStyleSheet.create({
  title: {
    width: '$appWidth',
    height: '$headerHeight * 0.8',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    justifyContent: 'center'
  },
  text: {
    color: 'gray',
    fontSize: '$titleFontSize'
  }
});

class ContainerViewSection extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.title !== this.props.title
      || nextProps.data !== this.props.data;
  }

  render() {
    return (
      <Container>
        <View style={styles.title}>
          <Text style={styles.text}>{this.props.title}</Text>
        </View>
        <View>
          <FlatList data={this.props.data} renderItem={this.props.renderItem} keyExtractor={this.props.keyExtractor} />
        </View>
      </Container>
    );
  }
}

ContainerViewSection.propTypes = {
  title: PropTypes.string,
  renderItem: PropTypes.func,
  keyExtractor: PropTypes.func
};

export default ContainerViewSection;