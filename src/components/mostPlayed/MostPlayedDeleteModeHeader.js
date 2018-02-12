import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';

import Header from '../common/headers/Header';
import HeaderLeftSectionWithBackButton from '../common/headers/HeaderLeftSectionWithBackButton';
import HeaderCenterSectionWithTitle from '../common/headers/HeaderCenterSectionWithTitle';
import HeaderRightSection from '../common/headers/HeaderRightSection';
import IconButton from '../common/buttons/IconButton';
import CheckBox from '../common/buttons/CheckBox';

const styles = EStyleSheet.create({
  checkboxChecked: {
    color: 'white'
  },
  checkboxUnchecked: {
    color: '$elementInactive',
  }
});

class MostPlayedDeleteModeHeader extends PureComponent {
  render() {
    return (
      <Header>
        <HeaderLeftSectionWithBackButton onBackPress={this.props.onBackPress} />
        <HeaderCenterSectionWithTitle title={this.props.title} />
        <HeaderRightSection style={{ marginRight: 10 }}>
          <CheckBox onChange={this.props.onSelectAllPress} style={this.props.selectedAll ? styles.checkboxChecked : styles.checkboxUnchecked} />
        </HeaderRightSection>
      </Header>
    );
  }
}

MostPlayedDeleteModeHeader.propTypes = {
  selectedAll: PropTypes.bool.isRequired,
  onSelectAllPress: PropTypes.func.isRequired
};

export default MostPlayedDeleteModeHeader;