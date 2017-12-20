import React, { Component } from 'react';
import {
  TouchableWithoutFeedback,
  Animated,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
  Image,
  View,
  Text,
  FlatList,
  Dimensions,
  Platform,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { connect } from 'react-redux';
import Swiper from 'react-native-swiper';

import * as homeActions from '../redux/actions/homeActions';
import * as appActions from '../redux/actions/appActions';
import * as playerActions from '../redux/actions/playerActions';
import * as homeSelectors from '../redux/selectors/home';
import * as favoritesActions from '../redux/actions/favoritesActions';

import HomePlaylists from './HomePlaylists';

import ControlPanel from './ControlPanel';
import Body from '../components/Body';
import HomeHeader from '../components/HomeHeader';
import ArtistCard from '../components/ArtistCard';
import AlbumCard from '../components/AlbumCard';
import GenreCard from '../components/GenreCard';
import SongCard from '../components/SongCard';
import PlaylistCard from '../components/PlaylistCard';
import PlayerFooter from './PlayerFooter';
import ThreeColumnContainer from '../components/ThreeColumnContainer';
import PaginationHeader from '../components/PaginationHeader';
import CardMenu from '../components/CardMenu';
import SongMenu from '../components/SongMenu';
import HomeMenu from '../components/HomeMenu';
import PlaylistMenu from '../components/PlaylistMenu';
import Container from '../components/Container';
import PlaylistSelector from '../components/PlaylistSelector';

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
    this._getSectionTextId = this._getSectionTextId.bind(this);
    this._getSectionIndex = this._getSectionIndex.bind(this);
    this._changeSection = this._changeSection.bind(this);
    this._playSongs = this._playSongs.bind(this);
    this._renderMenu = this._renderMenu.bind(this);
    this._getCardMenu = this._getCardMenu.bind(this);
    this._getHomeMenu = this._getHomeMenu.bind(this);
    this._showAddToPlaylistForm = this._showAddToPlaylistForm.bind(this);
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
        <Container>
          <HomeHeader
            title={'Musically'}
            onMenuPress={() => this._drawer.open()}
            onMorePress={() => this.props.setMenu({ type: 'MENU' })}
            onSearchPress={() => this.props.navigation.navigate('Search', {})} />
          <Swiper
            style={styles.page}
            showsPagination={true}
            loop={false}
            renderPagination={this._renderPagination}
            ref={component => this._swiper = component}
            onIndexChanged={this._onIndexChanged}>
            <HomePlaylists navigation={this.props.navigation} />
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
          <PlayerFooter navigation={this.props.navigation} />
          {this._renderMenu()}
          {this._showAddToPlaylistForm()}
        </Container>
      </ControlPanel>
    );
  }

  _showAddToPlaylistForm() {
    if (!this.props.showAddToPlaylistForm)
      return null;

    return (
      <PlaylistSelector
        onCancelPress={this.props.cancelAddSongToPlaylist}
        onSelected={playlist => this.props.addSongToPlaylistConfirmed(this.props.songToAddToPlaylist, playlist)}
        playlists={this.props.playlists} />
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
        return this.props.dictionary.getWord('genres');
      case 4:
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
        return 'genres';
      case 4:
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
      case 'genres':
        return 3;
      case 'songs':
        return 4;
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
        onPress={() => this._playSongs([song.item])}
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
    if (!this.props.showMenu || (!this.props.targetMenu ? undefined : this.props.targetMenu.caller) !== 'HOME')
      return null;

    switch (this.props.targetMenu.type.toLowerCase()) {
      case 'song':
        return this._getSongMenu(this.props.targetMenu.payload);
      case 'artist':
      case 'album':
      case 'genre':
        return this._getCardMenu(this.props.targetMenu.type.toLowerCase(), this.props.targetMenu.payload);
      default:
        return this._getHomeMenu();
    }
  }

  _getHomeMenu() {
    return (
      <HomeMenu
        positionX={this.props.menuPositionX}
        positionY={this.props.menuPositionY}
        onPress={() => this.props.setMenu(null, 0, 0)} />
    );
  }

  _getSongMenu(song) {
    let initialSong = song;
    let queue = [initialSong];

    return (
      <SongMenu
        positionX={this.props.menuPositionX}
        positionY={this.props.menuPositionY}
        isFavorite={song.isFavorite}
        onPlayPress={() => this._playSongs(initialSong, queue, true)}
        onAddToPlaylistPress={() => {
          this.props.setMenu(null, 0, 0);
          this.props.addSongToPlaylist(song);
        }}
        onAddToQueuePress={() => {
          this._addToQueue(queue);
        }}
        onLikePress={() => {
          this.props.setMenu(null, 0, 0);
          this.props.like('song', song);
        }}
        onPress={() => this.props.setMenu(null, 0, 0)} />
    );
  }

  _getCardMenu(targetType, target) {
    let queue = [];

    if (targetType === 'artist' || targetType === 'genre') {
      queue = [].concat.apply([], target.albums.map(a => a.songs));
    } else {
      queue = target.songs;
    }

    return (
      <CardMenu
        positionX={this.props.menuPositionX}
        positionY={this.props.menuPositionY}
        onPlayPress={() => this._playSongs(queue, true)}
        onAddToQueuePress={() => this._addToQueue(queue)}
        onPress={() => this.props.setMenu(null, 0, 0)} />
    );
  }

  _playSongs(queue, closeMenu = false) {
    if (closeMenu)
      this.props.setMenu(null, 0, 0);

    this.props.navigation.navigate('Player', { queue, reset: true });
  }

  _addToQueue(queue) {
    this.props.setMenu(null, 0, 0);
    this.props.addToQueue(queue);
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
  },
  addButton: {
    position: 'absolute',
    right: 25
  },
  confirmationText: {
    color: 'white',
    fontSize: 16
  }
});

const mapStateToProps = state => {
  return {
    isReady: state.app.isReady,
    songs: state.app.songs,
    albums: state.app.albums,
    artists: state.app.artists,
    genres: state.app.genres,
    dictionary: state.app.dictionary,
    selectedSection: state.home.selectedSection,
    showMenu: state.app.showMenu,
    targetMenu: state.app.targetMenu,
    menuPositionX: state.app.menuPositionX,
    menuPositionY: state.app.menuPositionY,
    showAddToPlaylistForm: state.home.showAddToPlaylistForm,
    songToAddToPlaylist: state.home.songToAddToPlaylist
  }
}

const mapDispatchToProps = dispatch => {
  return {
    selectedSectionChanged: (section) => homeActions.selectedSectionChanged(section)(dispatch),
    setMenu: (target, positionX, positionY) => dispatch(appActions.setMenu({ ...target, caller: 'HOME' }, positionX, positionY)),
    addToQueue: (queue) => playerActions.addToQueue(queue)(dispatch),
    like: (type, target) => dispatch(favoritesActions.like(type, target)),
    addSongToPlaylist: (song) => dispatch(homeActions.addSongToPlaylist(song)),
    cancelAddSongToPlaylist: () => dispatch(homeActions.cancelAddSongToPlaylist()),
    addSongToPlaylistConfirmed: (song, playlist) => homeActions.addSongToPlaylistConfirmed(song, playlist)(dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);