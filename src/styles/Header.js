// @flow

import { Platform } from 'react-native';

const style = {
  height: (Platform.OS === "ios" ? 64 : 56),
  backgroundColor: '#2E2E2E',
  flexDirection: 'row'
};

export default style;