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
  },
  likedButton: {
    color: '$elementActive',
    backgroundColor: 'transparent',
    fontSize: '$headerIconSize'
  },
  unlikedButton: {
    color: '$headerColor',
    backgroundColor: 'transparent',
    fontSize: '$headerIconSize'
  }
});

class ContainerViewHeader extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.title !== this.props.title
      || nextProps.liked !== this.props.liked;
  }

  render() {
    return (
      <Header>
        <HeaderLeftSection>
          <IconButton iconName="arrow-back" onPress={this.props.onBackPress} style={styles._button} iconSize={styles._button.fontSize} />
        </HeaderLeftSection>
        <HeaderCenterSection>
          <HeaderTitle>{this.props.title}</HeaderTitle>
        </HeaderCenterSection>
        <HeaderRightSection>
          <IconButton iconName="search" onPress={this.props.onSearchPress} style={styles._button} iconSize={styles._button.fontSize} />
          <IconButton iconName="favorite" onPress={this.props.onLikePress} style={this.props.liked ? styles._likedButton : styles._unlikedButton} iconSize={styles._button.fontSize} />
          <IconButton iconName="more-vert" onPress={this.props.onMenuPress} style={styles._button} iconSize={styles._button.fontSize} />
        </HeaderRightSection>
      </Header>
    );
  }
}

ContainerViewHeader.propTypes = {
  liked: PropTypes.bool,
  title: PropTypes.string,
  onSearchPress: PropTypes.func,
  onLikePress: PropTypes.func,
  onMenuPress: PropTypes.func,
  onBackPress: PropTypes.func
};

export default ContainerViewHeader;