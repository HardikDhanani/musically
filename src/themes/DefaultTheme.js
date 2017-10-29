import { Dimensions, Platform, StatusBar } from 'react-native';

const PRIMARY_COLOR = '#2E2E2E';
const SECONDARY_COLOR = '#f1f1f1';
const BODY_1_BACKGROUND_COLOR = '#d3d3d3';

const getHeaderHeight = () => {
  return Platform.OS === "ios" ? 64 : 56;
}

const getFooterHeight = () => {
  return 60
}

const getBodyHeight = () => {
  return Dimensions.get('window').height - (getHeaderHeight() + getFooterHeight() + StatusBar.currentHeight);
}

const getHomeBodyHeight = () => {
  const paginationHeaderHeight = getHeaderHeight() * 0.7;
  return Dimensions.get('window').height - (getHeaderHeight() + paginationHeaderHeight + getFooterHeight() + StatusBar.currentHeight);
}

const theme = {
  $theme: 'default',
  $appWidth: Dimensions.get('window').width,
  $appHeight: Dimensions.get('window').height,
  $bodyHeight: getBodyHeight(),
  $homeBodyHeight: getHomeBodyHeight(),
  
  $headerHeight: getHeaderHeight(),
  $headerColor: 'white',
  $headerBackgroundColor: PRIMARY_COLOR,

  $footerHeight: getFooterHeight(),
  $footerColor: 'white',

  $body_1_backgroundColor: BODY_1_BACKGROUND_COLOR,
  $bodyBackgroundColor: SECONDARY_COLOR,
  $bodySecondaryBackgroundColor: '#4c4c4c',

  $floatMenuContentBackgroundColor: 'black',
  $floatMenuOptionTextColor: 'white',
  $floatMenuOptionHeight: 55,

  $buttonSelected: 'orange',
  $buttonUnselected: 'white',

  $elementActive: 'orange',
  $elementInactive: 'gray',

  $textColor: 'gray',

  '@media ios': {
    $fontFamily: 'System',
    $titleFontSize: 17,
    $bigTextFontSize: 15,
    $textFontSize: 12,
    $headerIconSize: 20,
    $iconSize: 15,
  },
  '@media android': {
    $fontFamily: 'Roboto_medium',
    $titleFontSize: 19,
    $bigTextFontSize: 17,
    $textFontSize: 14,
    $headerIconSize: 30,
    $iconSize: 20,
  },  
}

export default theme;