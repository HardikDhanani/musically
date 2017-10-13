// @flow

import { Platform } from 'react-native';

const style = {
  flexDirection: 'row',
  height: (Platform.OS === "ios" ? 64 : 56) * 0.8,
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingHorizontal: 10
};

export default style;