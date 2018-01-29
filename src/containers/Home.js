import React, { Component } from 'react';
import { connect } from 'react-redux';
import EStyleSheet from 'react-native-extended-stylesheet';
import Swiper from 'react-native-swiper';
import LinearGradient from 'react-native-linear-gradient';

import * as homeActions from '../redux/actions/homeActions';

import HomePlaylists from './HomePlaylists';
import HomeArtists from './HomeArtists';
import HomeAlbums from './HomeAlbums';
import HomeSongs from './HomeSongs';

import ControlPanel from './ControlPanel';
import HomeHeader from '../components/HomeHeader';
import PlayerFooter from './PlayerFooter';
import PaginationHeader from '../components/PaginationHeader';
import Container from '../components/Container';

const styles = EStyleSheet.create({
  container: {
    height: '$statusBarHeight'
  },
  gradientStart: {
    color: '$headerStartGradientBackgroundColor'
  },
  gradientEnd: {
    color: '$headerEndGradientBackgroundColor'
  }
});

class Home extends Component {
  constructor(props) {
    super(props);

    this._onPageChange = this._onPageChange.bind(this);
    this._onRef = this._onRef.bind(this);
    this._getSectionText = this._getSectionText.bind(this);
    this._getSectionTextId = this._getSectionTextId.bind(this);
    this._getSectionIndex = this._getSectionIndex.bind(this);
    this._changeSection = this._changeSection.bind(this);
    this._renderPagination = this._renderPagination.bind(this);
    this._onIndexChanged = this._onIndexChanged.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedSection !== this.props.selectedSection)
      this._changeSection(this._getSectionIndex(nextProps.selectedSection));
  }

  render() {
    return (
      <ControlPanel onRef={this._onRef} navigation={this.props.navigation}>
        <Container fillStatusBar={false}>
          <HomeHeader
            title={this.props.dictionary.getWord('my_music')}
            onMenuPress={() => this._drawer.open()}
            onMorePress={() => this.props.setMenu({ type: 'MENU' })}
            onSearchPress={() => this.props.navigation.navigate('Search', {})} />
          <Swiper
            showsPagination={true}
            loop={false}
            renderPagination={this._renderPagination}
            ref={component => this._swiper = component}
            onIndexChanged={this._onIndexChanged}>
            <HomePlaylists navigation={this.props.navigation} />
            <HomeArtists navigation={this.props.navigation} />
            <HomeAlbums navigation={this.props.navigation} />
            <HomeSongs navigation={this.props.navigation} />
          </Swiper>
          <PlayerFooter navigation={this.props.navigation} />
        </Container>
      </ControlPanel>
    );
  }

  _onRef(component) {
    this._drawer = component;
  }

  _onPageChange(targetIndex) {
    this.props.selectedSectionChanged(this._getSectionTextId(targetIndex).toLowerCase());
    this._changeSection(targetIndex);
  }

  _changeSection(targetIndex) {
    const currentIndex = this._swiper.state.index;
    const offset = targetIndex - currentIndex;
    this._swiper.scrollBy(offset);
  }

  _getSectionText(position) {
    switch (position) {
      case 0:
        return this.props.dictionary.getWord('playlists_short');
      case 1:
        return this.props.dictionary.getWord('artists');
      case 2:
        return this.props.dictionary.getWord('albums');
      case 3:
        return this.props.dictionary.getWord('songs');
      default:
        return '';
    }
  }

  _getSectionTextId(position) {
    switch (position) {
      case 0:
        return 'playlists';
      case 1:
        return 'artists';
      case 2:
        return 'albums';
      case 3:
        return 'songs';
      default:
        return '';
    }
  }

  _getSectionIndex(text) {
    switch (text.toLowerCase()) {
      case 'playlists':
        return 0;
      case 'artists':
        return 1;
      case 'albums':
        return 2;
      case 'songs':
        return 3;
      default:
        return -1;
    }
  }

  _renderPagination(index, total, context) {
    return (
      <PaginationHeader language={this.props.dictionary.language} currentIndex={index} total={total} sectionTextGenerator={this._getSectionText} onPageChange={this._onPageChange} />
    );
  }

  _onIndexChanged(index) {
    var text = this._getSectionTextId(index).toLowerCase();
    this.props.selectedSectionChanged(text);
  }
}

const mapStateToProps = state => {
  return {
    dictionary: state.app.dictionary,
    selectedSection: state.home.selectedSection,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    selectedSectionChanged: (section) => homeActions.selectedSectionChanged(section)(dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);