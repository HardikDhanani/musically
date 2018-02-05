import { Dimensions, Platform, StatusBar } from 'react-native';

const PRIMARY_COLOR = 'rgba(107,4,237,1)';
const SECONDARY_COLOR = 'rgba(245,246,251,1)';
const FORM_BACKGROUND_COLOR = 'rgba(255,255,255,1)';
const FORM_MAIN_BACKGROUND_COLOR = 'rgba(245,246,251,0.9)';
const BODY_1_BACKGROUND_COLOR = '#d3d3d3';

const appWidth = Dimensions.get('window').width;
const appHeight = Dimensions.get('window').height;

const getHeaderHeight = () => {
  return Platform.OS === "ios" ? 64 : 56;
}

const getFooterHeight = () => {
  return 80;
}

const getBodyHeight = () => {
  return appHeight - (getHeaderHeight() + getFooterHeight() + StatusBar.currentHeight);
}

const getPaginationHeaderHeight = () => {
  return getHeaderHeight() * 0.7;
}

const theme = {
  $theme: 'default',
  $appWidth: appWidth,
  $appHeight: appHeight,
  $appMainColor: PRIMARY_COLOR,
  $appBackgroundColor: SECONDARY_COLOR,
  $appMainTextColor: 'rgba(255,255,255,1)',

  $bodyHeight: getBodyHeight(),
  $statusBarHeight: StatusBar.currentHeight,

  $headerHeight: getHeaderHeight(),
  $headerColor: 'white',
  $headerBackgroundColor: '#6B04ED',
  $headerEndGradientBackgroundColor: PRIMARY_COLOR,
  $headerStartGradientBackgroundColor: 'rgba(74,144,226,1)',

  $paginationHeaderHeight: getPaginationHeaderHeight(),
  $paginationHeaderColorLeft: 'rgba(40,66,171,1)',
  $paginationHeaderColorRight: 'rgba(190,177,227,1)',
  $paginationHeaderTextColor: 'rgba(255,255,255,1)',

  $footerHeight: getFooterHeight(),
  $footerWidth: appWidth,
  $footerBackgroundColor: 'rgba(255,255,255,1)',
  $footerTextColor: 'rgba(0,0,0,1)',

  $body_1_backgroundColor: BODY_1_BACKGROUND_COLOR,
  $bodySecondaryBackgroundColor: '#4c4c4c',

  $cardBackgroundColor: 'white',
  $coverCardHeight: (appWidth / 2) * 0.9,
  $coverCardWidth: (appWidth / 2) * 0.9,
  $rowCardHeight: getHeaderHeight() * 1.5,

  $modalFormWidth: appWidth * 0.65,
  $modalFormHeight: appHeight * 0.5,
  $modalFormBackgroundColor: FORM_MAIN_BACKGROUND_COLOR,
  $modalFormContentBackgroundColor: FORM_BACKGROUND_COLOR,
  $modalFormButtonColor: PRIMARY_COLOR,
  $modalFormButtonTextColor: 'white',
  $modalFormButtonDisabledColor: 'rgba(242,242,242,1)',

  $floatMenuContentBackgroundColor: 'black',
  $floatMenuOptionTextColor: FORM_BACKGROUND_COLOR,
  $floatMenuOptionHeight: getHeaderHeight() * 0.8,

  $buttonEnabled: PRIMARY_COLOR,
  $buttonDisabled: 'rgba(190,178,228,1)',

  $buttonSelected: 'orange',
  $buttonUnselected: FORM_BACKGROUND_COLOR,

  $elementActive: 'orange',
  $elementInactive: 'rgba(200,200,200,1)',

  $shadowBackgroundColor: 'rgba(0, 0, 0, 0.25)',

  $textMainColor: 'black',
  $textColor: 'gray',
  $fontFamily: 'nunito',

  '@media ios': {
    $titleFontSize: 17,
    $bigTextFontSize: 15,
    $textFontSize: 12,
    $detailFontSize: 12,
    $headerIconSize: 20,
    $iconSize: 15,
  },
  '@media android': {
    $titleFontSize: 19,
    $bigTextFontSize: 17,
    $textFontSize: 14,
    $detailFontSize: 14,
    $headerIconSize: 30,
    $iconSize: 20,
  },
}

export default theme;