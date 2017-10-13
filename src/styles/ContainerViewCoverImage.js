// @flow

import { Platform } from 'react-native';

const headerHeight = (Platform.OS === "ios" ? 64 : 56) * 2;

const style = {
  width: headerHeight,
  height: headerHeight,
  marginLeft: 20,
};

export default style;