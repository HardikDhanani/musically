import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';

import {
  View
} from 'react-native';
import Header from '../common/headers/Header';
import HeaderLeftSectionWithBackButton from '../common/headers/HeaderLeftSectionWithBackButton';
import HeaderCenterSectionWithTitle from '../common/headers/HeaderCenterSectionWithTitle';
import HeaderRightSection from '../common/headers/HeaderRightSection';
import IconButton from '../common/buttons/IconButton';

const styles = EStyleSheet.create({
  button: {
    color: '$headerColor',
    backgroundColor: 'transparent',
    fontSize: '$headerIconSize'
  }
});

class MostPlayedHeader extends PureComponent {
  render() {
    return (
      <Header>
        <HeaderLeftSectionWithBackButton onBackPress={this.props.onBackPress} />
        <HeaderCenterSectionWithTitle title={this.props.title} />
        <HeaderRightSection>
          <View style={{ marginRight: 20 }}>
            <IconButton iconName='delete' onPress={this.props.onDeletePress} style={styles._button} iconSize={styles._button.fontSize - 2} />
          </View>
          <IconButton iconName='settings' onPress={this.props.onSettingsPress} style={styles._button} iconSize={styles._button.fontSize} />
        </HeaderRightSection>
      </Header>
    );
  }
}

MostPlayedHeader.propTypes = {
  onDeletePress: PropTypes.func.isRequired,
  onSettingsPress: PropTypes.func.isRequired
};

export default MostPlayedHeader;