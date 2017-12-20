import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';

import Header from '../Header';
import HeaderTitle from '../HeaderTitle';
import HeaderLeftSection from '../HeaderLeftSection';
import HeaderCenterSection from '../HeaderCenterSection';
import IconButton from '../common/buttons/IconButton';

const styles = EStyleSheet.create({
  button: {
    color: '$headerColor',
    backgroundColor: 'transparent',
    fontSize: '$headerIconSize'
  }
});

class SettingsHeader extends PureComponent {
  render() {
    return (
      <Header>
        <HeaderLeftSection>
          <IconButton iconName='arrow-back' onPress={this.props.onBackPress} style={styles._button} iconSize={styles._button.fontSize} />
        </HeaderLeftSection>
        <HeaderCenterSection>
          <HeaderTitle>{this.props.title}</HeaderTitle>
        </HeaderCenterSection>
      </Header>
    );
  }
}

SettingsHeader.propTypes = {
  title: PropTypes.string.isRequired,
  onBackPress: PropTypes.func
};

export default SettingsHeader;