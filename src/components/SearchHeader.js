import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';

import {
  TextInput,
  View
} from 'react-native';
import Header from './common/headers/Header';
import HeaderTitle from './common/headers/HeaderTitle';
import IconButton from './common/buttons/IconButton';

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
    marginRight: 15,
  },
  input: {
    flex: 1,
    fontSize: '$textFontSize',
    color: '$headerColor',
  },
  button: {
    color: '$headerColor',
    backgroundColor: 'transparent',
    fontSize: '$headerIconSize'
  },
  left: {
    flexDirection: 'row',
    marginLeft: 10
  }
});

class SearchHeader extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.criteria !== this.props.criteria;
  }

  render() {
    return (
      <Header>
        <View style={styles.left}>
          <IconButton iconName='arrow-back' onPress={this.props.onBackPress} style={styles._button} iconSize={styles._button.fontSize} />
        </View>
        <View style={styles.container}>
          <TextInput
            selectionColor={"white"}
            autoGrow={true}
            placeholder={this.props.placeholder}
            style={styles.input}
            onChangeText={this.props.search}
            value={this.props.criteria}
            underlineColorAndroid={'transparent'}
            placeholderTextColor={'rgb(200, 200, 200)'}
          />
          {
            this.props.criteria
              ? <IconButton iconName='close' onPress={this.props.deleteSearch} style={styles._button} iconSize={styles._button.fontSize} />
              : null
          }
        </View>
      </Header>
    );
  }
}

SearchHeader.propTypes = {
  criteria: PropTypes.string,
  placeholder: PropTypes.string.isRequired,
  search: PropTypes.func.isRequired,
  onBackPress: PropTypes.func.isRequired,
  deleteSearch: PropTypes.func.isRequired
};

export default SearchHeader;