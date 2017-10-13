import React, { PureComponent } from 'react';

import LikeButton from '../components/LikeButton';
import Header from '../components/Header';
import HeaderButton from '../components/HeaderButton';
import HeaderTitle from '../components/HeaderTitle';
import HeaderLeftSection from '../components/HeaderLeftSection';
import HeaderRightSection from '../components/HeaderRightSection';
import HeaderCenterSection from '../components/HeaderCenterSection';

export default class ContainerViewHeader extends PureComponent {
  render() {
    return (
      <Header>
        <HeaderLeftSection>
          <HeaderButton text={'<'} onPress={this.props.onBackPress} />
        </HeaderLeftSection>
        <HeaderCenterSection>
          <HeaderTitle>{this.props.title}</HeaderTitle>
        </HeaderCenterSection>
        <HeaderRightSection>
          <HeaderButton text={'S'} onPress={this.props.onSearchPress} />
          <LikeButton liked={this.props.liked} onPress={this.props.onLikePress} />
          <HeaderButton text={'+'} onPress={this.props.onMenuPress} />
        </HeaderRightSection>
      </Header>
    );
  }
}