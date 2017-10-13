import React, { PureComponent } from 'react';

import Header from './Header';
import HeaderTitle from './HeaderTitle';
import HeaderLeftSection from './HeaderLeftSection';
import HeaderRightSection from './HeaderRightSection';
import HeaderCenterSection from './HeaderCenterSection';
import HeaderButton from './HeaderButton';

export default class HomeHeader extends PureComponent {
  render() {
    return (
      <Header>
        <HeaderLeftSection>
          <HeaderButton text={'M'} onPress={this.props.onMenuPress} />
        </HeaderLeftSection>
        <HeaderCenterSection>
          <HeaderTitle>{this.props.title}</HeaderTitle>
        </HeaderCenterSection>
        <HeaderRightSection>
          <HeaderButton text={'S'} onPress={this.props.onSearchPress} />
          <HeaderButton text={'+'} onPress={this.props.onMorePress} />
        </HeaderRightSection>
      </Header>
    );
  }

  static get currentHeight(){
    return Header.currentHeight;
  }
}