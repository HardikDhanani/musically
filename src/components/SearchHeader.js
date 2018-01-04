import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';

import {
  TextInput,
  View
} from 'react-native';
import Header from './common/headers/Header';
import HeaderTitle from './HeaderTitle';
import HeaderLeftSection from './HeaderLeftSection';
import HeaderRightSection from './HeaderRightSection';
import HeaderCenterSection from './HeaderCenterSection';
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
    fontSize: '$titleFontSize',
    color: '$headerColor',
  },
  button: {
    color: '$headerColor',
    backgroundColor: 'transparent',
    fontSize: '$headerIconSize'
  }
});

class SearchHeader extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.criteria !== this.props.criteria;
  }

  render() {
    return (
      <Header>
        <HeaderLeftSection>
          <IconButton iconName='arrow-back' onPress={this.props.onBackPress} style={styles._button} iconSize={styles._button.fontSize} />
        </HeaderLeftSection>
        <HeaderCenterSection>
          <View style={styles.container}>
            <TextInput
              placeholder={'Search'}
              style={styles.input}
              onChangeText={this.props.search}
              value={this.props.criteria}
              underlineColorAndroid={'transparent'}
              placeholderTextColor={'gray'}
            />
            {
              this.props.criteria
                ? <IconButton iconName='close' onPress={this.props.deleteSearch} style={styles._button} iconSize={styles._button.fontSize} />
                : null
            }
          </View>
        </HeaderCenterSection>
        <HeaderRightSection>
          <IconButton iconName='more-vert' onPress={this.props.onMorePress} style={styles._button} iconSize={styles._button.fontSize} />
        </HeaderRightSection>
      </Header>
    );
  }
}

SearchHeader.propTypes = {
  criteria: PropTypes.string,
  search: PropTypes.func,
  onBackPress: PropTypes.func,
  deleteSearch: PropTypes.func,
  onMorePress: PropTypes.func
};

export default SearchHeader;