// @flow

import { Dimensions, Platform, StatusBar } from 'react-native';

const footerHeight = 60;
const headerHeight = Platform.OS === "ios" ? 64 : 56;
const height = Dimensions.get('window').height - (headerHeight + footerHeight + StatusBar.currentHeight);

const style = {
  alignItems: 'center',
  alignSelf: 'center',
  height: height
};

export default style;