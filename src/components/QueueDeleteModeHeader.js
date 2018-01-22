import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';
import LinearGradient from 'react-native-linear-gradient';

import {
  View
} from 'react-native';
import Header from './common/headers/Header';
import HeaderTitle from './HeaderTitle';
import HeaderLeftSection from './HeaderLeftSection';
import HeaderRightSection from './HeaderRightSection';
import HeaderCenterSection from './HeaderCenterSection';
import IconButton from './common/buttons/IconButton';
import CheckBox from './common/buttons/CheckBox';

const styles = EStyleSheet.create({
  container: {
    flexDirection: 'row',
    height: '$headerHeight + $statusBarHeight',
    backgroundColor: 'white',
    elevation: 5,
    paddingTop: '$statusBarHeight'
  },
  button: {
    color: '$headerColor',
    backgroundColor: 'transparent',
    fontSize: '$headerIconSize'
  },
  checkboxChecked: {
    color: 'white'
  },
  checkboxUnchecked: {
    color: '$elementInactive',
  },
  gradient: {
    height: '$statusBarHeight'
  },
  gradientStart: {
    color: '$headerStartGradientBackgroundColor'
  },
  gradientEnd: {
    color: '$headerEndGradientBackgroundColor'
  }
});

class QueueDeleteModeHeader extends PureComponent {
  render() {
    return (
      <LinearGradient
        start={{ x: 0.0, y: 1.0 }}
        end={{ x: 1.0, y: 1.0 }}
        colors={[styles._gradientStart.color, styles._gradientEnd.color]}
        style={styles.container}>
        <HeaderLeftSection>
          <IconButton iconName='arrow-back' onPress={this.props.onBackPress} style={styles._button} iconSize={styles._button.fontSize} />
        </HeaderLeftSection>
        <HeaderCenterSection>
          <HeaderTitle>{this.props.title}</HeaderTitle>
        </HeaderCenterSection>
        <HeaderRightSection style={{ marginRight: 10 }}>
          <CheckBox onChange={this.props.onSelectAllPress} style={this.props.selectedAll ? styles.checkboxChecked : styles.checkboxUnchecked} />
        </HeaderRightSection>
      </LinearGradient>
    );
  }
}

QueueDeleteModeHeader.propTypes = {
  title: PropTypes.string.isRequired,
  selectedAll: PropTypes.bool.isRequired,
  onBackPress: PropTypes.func.isRequired,
  onSelectAllPress: PropTypes.func.isRequired
};

export default QueueDeleteModeHeader;