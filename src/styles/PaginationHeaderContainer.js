// @flow

import { Dimensions, Platform } from 'react-native';

const headerHeight = Platform.OS === "ios" ? 64 : 56;

const style = {
  flexDirection: 'column',
  width: Dimensions.get('window').width,
  height: headerHeight * 0.7,
  backgroundColor: '#2E2E2E',
  paddingLeft: 2,
  paddingRight: 2,
  position: 'absolute',
  top: 0,
};

export default style;