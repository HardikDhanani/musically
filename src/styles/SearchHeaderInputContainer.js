// @flow

import { Dimensions, Platform } from 'react-native';

const style = {
  width: Dimensions.get('window').width - (((Platform.OS === "ios" ? 64 : 56) * 0.7) * 4),
  justifyContent: 'center',
};

export default style;