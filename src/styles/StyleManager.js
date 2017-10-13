import Header from './Header';
import HeaderTitle from './HeaderTitle';
import HeaderButton from './HeaderButton';
import HeaderButtonText from './HeaderButtonText';
import HeaderLeftSection from './HeaderLeftSection';
import HeaderRightSection from './HeaderRightSection';
import HeaderCenterSection from './HeaderCenterSection';
import PlayerFooterContainer from './PlayerFooterContainer';
import PlayerFooterImage from './PlayerFooterImage';
import PlayerFooterSongSection from './PlayerFooterSongSection';
import PlayerFooterSongSectionTitle from './PlayerFooterSongSectionTitle';
import PlayerFooterSongSectionText from './PlayerFooterSongSectionText';
import PlayerFooterControlsSection from './PlayerFooterControlsSection';
import FloatMenuOptionContainer from './FloatMenuOptionContainer';
import FloatMenuOptionText from './FloatMenuOptionText';
import SplashContainer from './SplashContainer';
import SearchHeaderInputContainer from './SearchHeaderInputContainer';
import SearchHeaderInput from './SearchHeaderInput';
import Body from './Body';
import HomeBody from './HomeBody';
import PaginationHeaderContainer from './PaginationHeaderContainer';
import PaginationHeaderTitle from './PaginationHeaderTitle';
import PaginationHeaderPageButton from './PaginationHeaderPageButton';
import SearchSectionTitle from './SearchSectionTitle';
import SearchSectionTitleText from './SearchSectionTitleText';
import SearchMessageText from './SearchMessageText';
import SearchContainer from './SearchContainer';
import SearchSongCardContainer from './SearchSongCardContainer';
import SearchSongCardItemText from './SearchSongCardItemText';
import CoverCardInfoText from './CoverCardInfoText';
import AlbumCoverContainer from './AlbumCoverContainer';
import Container from './Container';
import LikeButtonLiked from './LikeButtonLiked';
import LikeButtonUnliked from './LikeButtonUnliked';
import ContainerViewCoverContainer from './ContainerViewCoverContainer';
import ContainerViewCoverImage from './ContainerViewCoverImage';
import ContainerViewCoverContent from './ContainerViewCoverContent';

class StyleManager {
  getStyle(style: string): any {
    switch (style.toLowerCase()) {
      case 'header':
        return Header;
      case 'headertitle':
        return HeaderTitle;
      case 'headerbutton':
        return HeaderButton;
      case 'headerbuttontext':
        return HeaderButtonText;
      case 'headerleftsection':
        return HeaderLeftSection;
      case 'headerrightsection':
        return HeaderRightSection;
      case 'headercentersection':
        return HeaderCenterSection;
      case 'playerfootercontainer':
        return PlayerFooterContainer;
      case 'playerfooterimage':
        return PlayerFooterImage;
      case 'playerfootersongsection':
        return PlayerFooterSongSection;
      case 'playerfootersongsectiontitle':
        return PlayerFooterSongSectionTitle;
      case 'playerfootersongsectiontext':
        return PlayerFooterSongSectionText;
      case 'playerfootercontrolssection':
        return PlayerFooterControlsSection;
      case 'floatmenuoptioncontainer':
        return FloatMenuOptionContainer;
      case 'floatmenuoptiontext':
        return FloatMenuOptionText;
      case 'splashcontainer':
        return SplashContainer;
      case 'searchheaderinputcontainer':
        return SearchHeaderInputContainer;
      case 'searchheaderinput':
        return SearchHeaderInput;
      case 'body':
        return Body;
      case 'homebody':
        return HomeBody;
      case 'paginationheadercontainer':
        return PaginationHeaderContainer;
      case 'paginationheadertitle':
        return PaginationHeaderTitle;
      case 'paginationheaderpagebutton':
        return PaginationHeaderPageButton;
      case 'searchsectiontitle':
        return SearchSectionTitle;
      case 'searchsectiontitletext':
        return SearchSectionTitleText;
      case 'searchmessagetext':
        return SearchMessageText;
      case 'searchcontainer':
        return SearchContainer;
      case 'searchsongcardcontainer':
        return SearchSongCardContainer;
      case 'searchsongcarditemtext':
        return SearchSongCardItemText;
      case 'covercardinfotext':
        return CoverCardInfoText;
      case 'albumcovercontainer':
        return AlbumCoverContainer;
      case 'container':
        return Container;
      case 'likebuttonliked':
        return LikeButtonLiked;
      case 'likebuttonunliked':
        return LikeButtonUnliked;
      case 'containerviewcovercontent':
        return ContainerViewCoverContent;
      case 'containerviewcoverimage':
        return ContainerViewCoverImage;
      case 'containerviewcovercontainer':
        return ContainerViewCoverContainer;
    }
  }
}

let styleManager = new StyleManager();

module.exports = styleManager;