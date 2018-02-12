import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';

import { 
  View 
} from 'react-native';
import Header from '../common/headers/Header';
import HeaderTitle from '../common/headers/HeaderTitle';
import HeaderLeftSection from '../common/headers/HeaderLeftSection';
import HeaderRightSection from '../common/headers/HeaderRightSection';
import HeaderCenterSection from '../common/headers/HeaderCenterSection';
import IconButton from '../common/buttons/IconButton';

const styles = EStyleSheet.create({
  button: {
    color: '$headerColor',
    backgroundColor: 'transparent',
    fontSize: '$headerIconSize'
  }
});

class HomeHeader extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.title !== this.props.title
      || nextProps.itemViewMode !== this.props.itemViewMode;
  }

  render() {
    return (
      <Header useElevation={false}>
        <HeaderLeftSection>
          <IconButton iconName="menu" onPress={this.props.onMenuPress} style={styles._button} iconSize={styles._button.fontSize} />
        </HeaderLeftSection>
        <HeaderCenterSection>
          <HeaderTitle>{this.props.title}</HeaderTitle>
        </HeaderCenterSection>
        <HeaderRightSection>
          <View style={{ marginRight: 15 }}>
            <IconButton iconName={this.props.itemViewMode === 'row' ? 'filter-list' : 'view-module'} onPress={this.props.onChangeItemViewPress} style={styles._button} iconSize={styles._button.fontSize} />
          </View>
          <IconButton iconName="search" onPress={this.props.onSearchPress} style={styles._button} iconSize={styles._button.fontSize} />
        </HeaderRightSection>
      </Header>
    );
  }
}

HomeHeader.propTypes = {
  title: PropTypes.string.isRequired,
  itemViewMode: PropTypes.string.isRequired,
  onSearchPress: PropTypes.func.isRequired,
  onMenuPress: PropTypes.func.isRequired,
  onChangeItemViewPress: PropTypes.func.isRequired
};

export default HomeHeader;