import React, { PureComponent } from 'react';

import Header from '../common/headers/Header';
import HeaderLeftSectionWithBackButton from '../common/headers/HeaderLeftSectionWithBackButton';
import HeaderCenterSectionWithTitle from '../common/headers/HeaderCenterSectionWithTitle';
import HeaderRightSection from '../common/headers/HeaderRightSection';

export default class FavoritesHeader extends PureComponent {
  render() {
    return (
      <Header>
        <HeaderLeftSectionWithBackButton onBackPress={this.props.onBackPress} />
        <HeaderCenterSectionWithTitle title={this.props.title} />
        <HeaderRightSection />
      </Header>
    );
  }
}