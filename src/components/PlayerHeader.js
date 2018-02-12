import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';

import {
  View
} from 'react-native';
import Header from './common/headers/Header';
import HeaderLeftSection from './common/headers/HeaderLeftSection';
import HeaderRightSection from './common/headers/HeaderRightSection';
import HeaderCenterSection from './common/headers/HeaderCenterSection';
import IconButton from './common/buttons/IconButton';
import Text from './common/Text';

const styles = EStyleSheet.create({
  mainContainer: {
    height: '$headerHeight + $statusBarHeight',
  },
  headerContainer: {
    height: '$headerHeight',
    flexDirection: 'row'
  },
  button: {
    color: '$elementInactive',
    backgroundColor: 'transparent',
    fontSize: '$headerIconSize'
  },
  buttonWhite: {
    color: 'white',
    fontSize: '$headerIconSize'
  },
  gradientContainer: {
    height: '$statusBarHeight',
    width: '$appWidth',
    backgroundColor: '$headerStartGradientBackgroundColor'
  },
  title: {
    fontSize: '$titleFontSize',
    color: 'white'
  }
});

class PlayerHeader extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.title !== this.props.title;
  }

  render() {
    return (
      <View style={styles.mainContainer}>
        <View style={styles.gradientContainer} />
        <View style={styles.headerContainer}>
          <HeaderLeftSection>
            <IconButton iconName='keyboard-arrow-down' onPress={this.props.onBackPress} style={styles._buttonWhite} iconSize={styles._button.fontSize + 6} />
          </HeaderLeftSection>
          <HeaderCenterSection>
            <Text style={styles.title}>{this.props.title}</Text>
          </HeaderCenterSection>
          <HeaderRightSection />
        </View>
      </View>
    );
  }
}

PlayerHeader.propTypes = {
  title: PropTypes.string.isRequired,
  onBackPress: PropTypes.func
};

export default PlayerHeader;