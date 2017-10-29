import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';

import Header from './Header';
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

class FavoritesHeader extends PureComponent {
  render() {
    return (
      <Header>
        <HeaderLeftSection>
          <IconButton iconName='arrow-back' onPress={this.props.onBackPress} style={styles._button} iconSize={styles._button.fontSize} />
        </HeaderLeftSection>
        <HeaderCenterSection>
          <HeaderTitle>{'Favorites'}</HeaderTitle>
        </HeaderCenterSection>
        <HeaderRightSection>
          <IconButton iconName='more-vert' onPress={this.props.onMorePress} style={styles._button} iconSize={styles._button.fontSize} />
        </HeaderRightSection>
      </Header>
    );
  }
}

FavoritesHeader.propTypes = {
  onBackPress: PropTypes.func,
  onMorePress: PropTypes.func
};

export default FavoritesHeader;