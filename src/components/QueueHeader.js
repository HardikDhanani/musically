import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';

import Header from './common/headers/Header';
import HeaderTitle from './HeaderTitle';
import HeaderLeftSection from './HeaderLeftSection';
import HeaderRightSection from './HeaderRightSection';
import HeaderCenterSection from './HeaderCenterSection';
import IconButton from './common/buttons/IconButton';

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
        <HeaderLeftSection>
          <IconButton iconName='arrow-back' onPress={this.props.onBackPress} style={styles._button} iconSize={styles._button.fontSize} />
        </HeaderLeftSection>
        <HeaderCenterSection>
          <HeaderTitle>{this.props.title}</HeaderTitle>
        </HeaderCenterSection>
        <HeaderRightSection>
          <IconButton iconName='delete' onPress={this.props.onDeletePress} style={styles._button} iconSize={styles._button.fontSize - 2} />
          <IconButton iconName='more-vert' onPress={this.props.onMorePress} style={styles._button} iconSize={styles._button.fontSize} />
        </HeaderRightSection>
      </Header>
    );
  }
}

QueueHeader.propTypes = {
  onBackPress: PropTypes.func,
  onDeletePress: PropTypes.func,
  onMorePress: PropTypes.func
};

export default QueueHeader;