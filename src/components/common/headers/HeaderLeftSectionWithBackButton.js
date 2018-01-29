import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';

import HeaderLeftSection from './HeaderLeftSection';
import IconButton from '../buttons/IconButton';

const styles = EStyleSheet.create({
  button: {
    color: '$headerColor',
    backgroundColor: 'transparent',
    fontSize: '$headerIconSize'
  },
});

class HeaderLeftSectionWithBackButton extends PureComponent {
  render() {
    return (
      <HeaderLeftSection>
        <IconButton iconName='arrow-back' onPress={this.props.onBackPress} style={styles._button} iconSize={styles._button.fontSize} />
      </HeaderLeftSection>
    );
  }
}

HeaderLeftSectionWithBackButton.propTypes = {
  onBackPress: PropTypes.func.isRequired
};

export default HeaderLeftSectionWithBackButton;