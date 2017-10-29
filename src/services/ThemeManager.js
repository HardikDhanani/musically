//@flow

import EStyleSheet from 'react-native-extended-stylesheet';

import DefaultTheme from '../themes/DefaultTheme';
import DarkTheme from '../themes/DarkTheme';
import LightTheme from '../themes/LightTheme';

class ThemeManager {
  init(themeName: string = 'default') {
    let theme = this._getTheme(themeName);
    EStyleSheet.build(theme);
  }

  toggleTheme(themeName: string, doAfterInit: () => void) {
    let theme = this._getTheme(themeName);
    EStyleSheet.build(theme);

    if (doAfterInit)
      doAfterInit();
  }

  _getTheme(themeName: string) {
    switch (themeName.toLowerCase()) {
      case 'dark':
        return DarkTheme;
      case 'light':
        return LightTheme;
      default:
        return DefaultTheme;
    }
  }
}

var themeManager = new ThemeManager();

export default themeManager;