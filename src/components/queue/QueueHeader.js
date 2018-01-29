import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';

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

class QueueHeader extends PureComponent {
  render() {
    return (
      <Header>
        <HeaderLeftSectionWithBackButton onBackPress={this.props.onBackPress} />
        <HeaderCenterSectionWithTitle title={this.props.title} />
        <HeaderRightSection>
          <IconButton iconName='delete' onPress={this.props.onDeletePress} style={styles._button} iconSize={styles._button.fontSize - 2} />
        </HeaderRightSection>
      </Header>
    );
  }
}

QueueHeader.propTypes = {
  onDeletePress: PropTypes.func.isRequired
};

export default QueueHeader;