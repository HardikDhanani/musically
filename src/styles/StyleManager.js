import SearchMessageText from './SearchMessageText';
import SearchContainer from './SearchContainer';
import SearchSongCardContainer from './SearchSongCardContainer';
import SearchSongCardItemText from './SearchSongCardItemText';

class StyleManager {
  getStyle(style: string): any {
    switch (style.toLowerCase()) {
      case 'searchmessagetext':
        return SearchMessageText;
      case 'searchcontainer':
        return SearchContainer;
      case 'searchsongcardcontainer':
        return SearchSongCardContainer;
      case 'searchsongcarditemtext':
        return SearchSongCardItemText;
    }
  }

  getStyles(){
    
  }
}

let styleManager = new StyleManager();

module.exports = styleManager;