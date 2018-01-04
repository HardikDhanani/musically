import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';

import Header from './common/headers/Header';
import HeaderLeftSection from './HeaderLeftSection';
import HeaderRightSection from './HeaderRightSection';
import HeaderCenterSection from './HeaderCenterSection';
import IconButton from './common/buttons/IconButton';

const styles = EStyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    width: '$appWidth',
    backgroundColor: 'transparent'
  },
  button: {
    color: '$elementInactive',
    backgroundColor: 'transparent',
    fontSize: '$headerIconSize'
  },
  likedButton: {
    color: '$elementActive',
    backgroundColor: 'transparent',
    fontSize: '$headerIconSize'
  },
  unlikedButton: {
    color: '$elementInactive',
    backgroundColor: 'transparent',
    fontSize: '$headerIconSize'
  }
});

class PlayerHeader extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.liked !== this.props.liked;
  }

  render() {
    return (
      <Header style={styles.container}>
        <HeaderLeftSection>
          <IconButton iconName='arrow-back' onPress={this.props.onBackPress} style={styles._button} iconSize={styles._button.fontSize} />
        </HeaderLeftSection>
        <HeaderCenterSection />
        <HeaderRightSection>
          <IconButton iconName='favorite' onPress={this.props.onLikePress} style={this.props.liked ? styles._likedButton : styles._unlikedButton} iconSize={styles._button.fontSize} />
          <IconButton iconName='share' onPress={this.props.onSharePress} style={styles._button} iconSize={styles._button.fontSize} />
          <IconButton iconName='more-vert' onPress={this.props.onMenuPress} style={styles._button} iconSize={styles._button.fontSize} />
        </HeaderRightSection>
      </Header>
    );
  }
}

PlayerHeader.propTypes = {
  liked: PropTypes.bool,
  onBackPress: PropTypes.func,
  onLikePress: PropTypes.func,
  onSharePress: PropTypes.func,
  onMenuPress: PropTypes.func
};

export default PlayerHeader;