// @flow

import { Dimensions, Platform } from 'react-native';

const headerHeight = Platform.OS === "ios" ? 64 : 56;

const style = {
  width: Dimensions.get('window').width,
  height: headerHeight * 0.7,
  backgroundColor: '#4c4c4c',
  borderBottomWidth: 1,
  borderBottomColor: 'gray',
  justifyContent: 'center',
  paddingLeft: 10,
  marginBottom: 5
};

export default style;