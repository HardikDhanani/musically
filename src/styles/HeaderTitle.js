// @flow

import { Platform } from 'react-native';

const style = {
  fontFamily: Platform.OS === "ios" ? "System" : "Roboto_medium",
  fontSize: Platform.OS === "ios" ? 17 : 19,
  color: 'white',
  alignSelf: 'center',
  justifyContent: 'flex-end',
};

export default style;