import React, { Component } from 'react';
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

class HomeHeader extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.title !== this.props.title;
  }

  render() {
    return (
      <Header>
        <HeaderLeftSection>
          <IconButton iconName="menu" onPress={this.props.onMenuPress} style={styles._button} iconSize={styles._button.fontSize} />
        </HeaderLeftSection>
        <HeaderCenterSection>
          <HeaderTitle>{this.props.title}</HeaderTitle>
        </HeaderCenterSection>
        <HeaderRightSection>
          <IconButton iconName="search" onPress={this.props.onSearchPress} style={styles._button} iconSize={styles._button.fontSize} />
          <IconButton iconName="more-vert" onPress={this.props.onMorePress} style={styles._button} iconSize={styles._button.fontSize} />
        </HeaderRightSection>
      </Header>
    );
  }
}

HomeHeader.propTypes = {
  title: PropTypes.string,
  onSearchPress: PropTypes.func,
  onMorePress: PropTypes.func,
  onMenuPress: PropTypes.func
};

export default HomeHeader;