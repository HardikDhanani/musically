import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as homeActions from '../redux/actions/homeActions';
import * as appActions from '../redux/actions/appActions';
import * as playerActions from '../redux/actions/playerActions';
import * as homeSelectors from '../redux/selectors/home';
import * as favoritesActions from '../redux/actions/favoritesActions';

import { TouchableWithoutFeedback, Animated, ActivityIndicator, StyleSheet, StatusBar, Image, View, Text, FlatList, Dimensions, Platform, TouchableOpacity, ScrollView } from 'react-native';
import Swiper from 'react-native-swiper';

import ControlPanel from './ControlPanel';
import Body from '../components/Body';
import FloatMenuOption from '../components/FloatMenuOption';
import HomeHeader from '../components/HomeHeader';
import ArtistCard from '../components/ArtistCard';
import AlbumCard from '../components/AlbumCard';
import GenreCard from '../components/GenreCard';
import SongCard from '../components/SongCard';
import FloatMenu from '../components/FloatMenu';
import PlayerFooter from './PlayerFooter';
import ThreeColumnContainer from '../components/ThreeColumnContainer';
import PaginationHeader from '../components/PaginationHeader';
import SongMenu from '../components/SongMenu';
import ItemMenu from '../components/ItemMenu';
import Container from '../components/Container';

class Home extends Component {
  constructor(props) {
    super(props);

    this._renderArtist = this._renderArtist.bind(this);
    this._renderAlbum = this._renderAlbum.bind(this);
    this._renderGenre = this._renderGenre.bind(this);
    this._renderSong = this._renderSong.bind(this);
    this._renderArtistCard = this._renderArtistCard.bind(this);
    this._renderAlbumCard = this._renderAlbumCard.bind(this);
    this._renderGenreCard = this._renderGenreCard.bind(this);
    this._renderItem = this._renderItem.bind(this);
    this._swiperHeight = this._swiperHeight.bind(this);
    this._onPageChange = this._onPageChange.bind(this);
    this._groupItems = this._groupItems.bind(this);
    this._keyExtractor = this._keyExtractor.bind(this);
    this._onRef = this._onRef.bind(this);
    this._getSectionText = this._getSectionText.bind(this);
    this._getSectionIndex = this._getSectionIndex.bind(this);
    this._changeSection = this._changeSection.bind(this);
    this._playSongs = this._playSongs.bind(this);
    this._renderMenu = this._renderMenu.bind(this);
    this._getFloatMenuHeight = this._getFloatMenuHeight.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedSection !== this.props.selectedSection)
      this._changeSection(this._getSectionIndex(nextProps.selectedSection));
  }

  render() {
    return (
      <ControlPanel onRef={this._onRef} navigation={this.props.navigation}>
        <Container>
          <HomeHeader
            title={'Musically'}
            onMenuPress={() => this._drawer.open()}
            onMorePress={() => this.props.setMenu({ target: 'MENU' })}
            onSearchPress={() => this.props.navigation.navigate('Search', {})} />
          <Swiper
            style={styles.page}
            showsPagination={true}
            loop={false}
            renderPagination={(index, total, context) => <PaginationHeader currentIndex={index} total={total} sectionTextGenerator={this._getSectionText} onPageChange={this._onPageChange} />}
            ref={component => this._swiper = component}>
            <Body hasPaginationHeader={true}>
              {
                !this.props.isReady ?
                  <ActivityIndicator animating={true} size='large' /> :
                  <FlatList initialNumToRender={4} getItemLayout={(data, index) => ({ length: 160, offset: 160 * index, index })} data={this._groupItems(this.props.artists)} renderItem={this._renderArtist} keyExtractor={this._keyExtractor} />
              }
            </Body>
            <Body hasPaginationHeader={true}>
              {
                !this.props.isReady ?
                  <ActivityIndicator animating={true} size='large' /> :
                  <FlatList initialNumToRender={4} getItemLayout={(data, index) => ({ length: 160, offset: 160 * index, index })} data={this._groupItems(this.props.albums)} renderItem={this._renderAlbum} keyExtractor={this._keyExtractor} />
              }
            </Body>
            <Body hasPaginationHeader={true}>
              {
                !this.props.isReady ?
                  <ActivityIndicator animating={true} size='large' /> :
                  <FlatList initialNumToRender={4} getItemLayout={(data, index) => ({ length: 160, offset: 160 * index, index })} data={this._groupItems(this.props.genres)} renderItem={this._renderGenre} keyExtractor={this._keyExtractor} />
              }
            </Body>
            <Body hasPaginationHeader={true}>
              {
                !this.props.isReady ?
                  <ActivityIndicator animating={true} size='large' /> :
                  <FlatList initialNumToRender={10} getItemLayout={(data, index) => ({ length: 56, offset: 56 * index, index })} data={this.props.songs} renderItem={this._renderSong} keyExtractor={this._keyExtractor} />
              }
            </Body>
          </Swiper>
          {this._renderMenu()}
          <PlayerFooter navigation={this.props.navigation} />
        </Container>
      </ControlPanel>
    );
  }

  _onRef(component) {
    this._drawer = component;
  }

  _onPageChange(targetIndex) {
    this.props.selectedSectionChanged(this._getSectionText(targetIndex).toLowerCase());
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
        return 'Artists';
      case 1:
        return 'Albums';
      case 2:
        return 'Genres';
      case 3:
        return 'Songs';
      default:
        return '';
    }
  }

  _getSectionIndex(text) {
    switch (text.toLowerCase()) {
      case 'artists':
        return 0;
      case 'albums':
        return 1;
      case 'genres':
        return 2;
      case 'songs':
        return 3;
      default:
        return -1;
    }
  }

  _swiperHeight() {
    let footerHeight = 60;
    return Dimensions.get('window').height - (HomeHeader.currentHeight + footerHeight + StatusBar.currentHeight);
  }

  _groupItems(items) {
    let grupedItems = [];
    for (let i = 0; i < items.length; i += 3) {
      grupedItems.push(items.slice(i, 3 + i));
    }
    return grupedItems;
  }

  _renderArtist(items) {
    return this._renderItem(items, this._renderArtistCard)
  }

  _renderAlbum(items) {
    return this._renderItem(items, this._renderAlbumCard)
  }

  _renderGenre(items) {
    return this._renderItem(items, this._renderGenreCard)
  }

  _renderSong(song) {
    let targetMenu = {
      type: 'SONG',
      payload: song.item
    };

    return (
      <SongCard
        styles={{ container: { backgroundColor: '#f1f1f1' }, text: { color: 'gray' } }}
        key={song.index}
        id={song.item.id}
        name={song.item.title}
        artist={song.item.artist}
        duration={song.item.duration}
        like={song.item.isFavorite}
        onOptionPressed={measures => this.props.setMenu(targetMenu, measures.absoluteX, measures.absoluteY)}
        onPress={() => this._playSongs(song.item, this.props.songs)}
      />
    );
  }

  _renderItem(items, renderCard) {
    return (
      <ThreeColumnContainer items={items.item} renderItem={renderCard} />
    );
  }

  _keyExtractor(item, index) {
    return index;
  }

  _renderArtistCard(artist) {
    let targetMenu = {
      type: 'ARTIST',
      payload: artist
    };

    let songsCount = 0;
    for (let i = 0; i < artist.albums.length; i++) {
      songsCount += artist.albums[i].songs.length;
    }

    return (
      <ArtistCard
        onPress={() => this.props.navigation.navigate('Artist', { artist })}
        id={artist.id}
        name={artist.artist}
        albums={artist.albums.length}
        songs={songsCount}
        source={require('../images/music.png')}
        imageUri={artist.cover}
        onOptionPressed={measures => this.props.setMenu(targetMenu, measures.absoluteX, measures.absoluteY)}
      />
    );
  }

  _renderAlbumCard(album) {
    let targetMenu = {
      type: 'ALBUM',
      payload: album
    };

    return (
      <AlbumCard
        onPress={() => this.props.navigation.navigate('Album', { album })}
        id={album.id}
        name={album.album}
        artist={album.artist}
        songs={album.songs.length}
        source={require('../images/music.png')}
        imageUri={album.cover}
        onOptionPressed={measures => this.props.setMenu(targetMenu, measures.absoluteX, measures.absoluteY)}
      />
    );
  }

  _renderGenreCard(genre) {
    let targetMenu = {
      type: 'GENRE',
      payload: genre
    };

    let songsCount = 0;
    for (let i = 0; i < genre.albums.length; i++) {
      songsCount += genre.albums[i].songs.length;
    }

    return (
      <GenreCard
        onPress={() => this.props.navigation.navigate('Genre', { genre })}
        id={genre.id}
        name={genre.genre}
        albums={genre.albums.length}
        songs={songsCount}
        source={require('../images/music.png')}
        imageUri={genre.cover}
        onOptionPressed={measures => this.props.setMenu(targetMenu, measures.absoluteX, measures.absoluteY)}
      />
    );
  }

  _renderMenu() {
    if (!this.props.showMenu)
      return null;

    let contentHeight = this._getFloatMenuHeight(this.props.targetMenu.type);
    return (
      <FloatMenu contentHeight={contentHeight} positionY={this.props.menuPositionY} positionX={this.props.menuPositionX} onPress={() => this.props.setMenu(null, 0, 0)}>
        {this._getTargetMenu(this.props.targetMenu)}
      </FloatMenu>
    );
  }

  _getTargetMenu(target) {
    if (target.type === 'MENU')
      return this._getMenu();

    return this._getItemMenu(target);
  }

  _getMenu() {
    return [
      (<FloatMenuOption key={1} text={'Sort Order'} haveContent={true} />),
      (<FloatMenuOption key={2} text={'View Mode'} haveContent={true} />),
      (<FloatMenuOption key={3} text={'Rescan Library'} />),
      (<FloatMenuOption key={4} text={'Playlist Queue'} />)
    ];
  }

  _getItemMenu(target) {
    let initialSong = null;
    let queue = [];

    switch (target.type) {
      case 'ARTIST':
      case 'GENRE':
        for (let i = 0; i < target.payload.albums.length; i++) {
          queue = queue.concat(target.payload.albums[i].songs);
        }
        break;
      case 'ALBUM':
        queue = target.payload.songs;
        break;
      case 'SONG':
        return this._getSongMenu(target.payload);
    }

    return (
      <ItemMenu
        onPlayPress={() => this._playSongs(initialSong, queue, true)}
        onAddToQueuePress={() => this._addToQueue(queue)}
        onLikePress={() => this.props.like(target.type, target.payload)} />
    );
  }

  _getSongMenu(song) {
    let initialSong = song;
    let queue = [initialSong];

    return (
      <SongMenu
        onPlayPress={() => this._playSongs(initialSong, queue, true)}
        onAddToQueuePress={() => this._addToQueue(queue)}
        onLikePress={() => {
          this.props.like('song', song);
          this.props.setMenu(null, 0, 0);
        }}
        isFavorite={song.isFavorite} />
    );
  }

  _playSongs(initialSong, queue, closeMenu = false) {
    this.props.navigation.navigate('Player', { queue, initialSong });

    if (closeMenu)
      this.props.setMenu(null, 0, 0);
  }

  _addToQueue(queue) {
    this.props.addToQueue(queue);
    this.props.setMenu(null, 0, 0);
  }

  _getFloatMenuHeight(type) {
    switch (type.toLowerCase()) {
      case 'song':
        return SongMenu.currentHeight;
      case 'artist':
      case 'album':
      case 'genre':
        return ItemMenu.currentHeight;
      default:
        return 55 * 3;
    }
  }
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
  icon: {
    color: 'white'
  },
  row: {
    flexDirection: 'row',
  },
  column: {
    flexDirection: 'column',
  },
  page: {
    marginTop: HomeHeader.currentHeight * 0.7,
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  }
});

const mapStateToProps = state => {
  return {
    isReady: state.app.isReady,
    songs: state.app.songs,
    albums: state.app.albums,
    artists: state.app.artists,
    genres: state.app.genres,
    selectedSection: state.home.selectedSection,
    showMenu: state.app.showMenu,
    targetMenu: state.app.targetMenu,
    menuPositionX: state.app.menuPositionX,
    menuPositionY: state.app.menuPositionY,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    selectedSectionChanged: (section) => homeActions.selectedSectionChanged(section)(dispatch),
    setMenu: (target, positionX, positionY) => dispatch(appActions.setMenu(target, positionX, positionY)),
    addToQueue: (queue) => playerActions.addToQueue(queue)(dispatch),
    like: (type, target) => dispatch(favoritesActions.like(type, target)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);