import React, { PureComponent } from 'react';

import Header from './Header';
import HeaderTitle from './HeaderTitle';
import HeaderLeftSection from './HeaderLeftSection';
import HeaderRightSection from './HeaderRightSection';
import HeaderCenterSection from './HeaderCenterSection';
import HeaderButton from './HeaderButton';

import { TextInput, View, Text, TouchableOpacity } from 'react-native';
import StyleManager from '../styles/StyleManager';

export default class SearchHeader extends PureComponent {
  constructor(props) {
    super(props);

    this._inputContainerStyle = StyleManager.getStyle('SearchHeaderInputContainer');
    this._inputStyle = StyleManager.getStyle('SearchHeaderInput');
  }

  render() {
    return (
      <Header>
        <HeaderLeftSection>
          <HeaderButton text={'<<'} onPress={this.props.onBackPress} />
        </HeaderLeftSection>
        <HeaderCenterSection>
          <View style={this._inputContainerStyle}>
            <TextInput
              placeholder={'Search'}
              style={this._inputStyle}
              onChangeText={this.props.search}
              value={this.props.criteria}
              underlineColorAndroid={'transparent'}
              placeholderTextColor={'gray'}
            />
          </View>
          <HeaderButton text={this.props.criteria ? 'x' : ''} onPress={this.props.deleteSearch} />
        </HeaderCenterSection>
        <HeaderRightSection>
          <HeaderButton text={'+'} onPress={this.props.onMorePress} />
        </HeaderRightSection>
      </Header>
    );
  }
}