// @flow

import { Dimensions, Platform } from 'react-native';

const headerHeight = Platform.OS === "ios" ? 64 : 56;

const style = {
  flexDirection: 'row',
  width: Dimensions.get('window').width,
  height: headerHeight,
  backgroundColor: '#4c4c4c',
  alignItems: 'center',
  paddingLeft: 10,
  paddingRight: 10
};

export default style;