import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import EStyleSheet from 'react-native-extended-stylesheet';

import * as favoritesActions from '../redux/actions/favoritesActions';
import * as appActions from '../redux/actions/appActions';

import {
  ScrollView,
  View
} from 'react-native';

import FavoritesHeader from '../components/FavoritesHeader';
import Body from '../components/Body';
import SongCard from '../components/SongCard';
import AlbumCard from '../components/AlbumCard';
import ArtistCard from '../components/ArtistCard';
import GenreCard from '../components/GenreCard';
import ThreeColumnContainer from '../components/ThreeColumnContainer';
import PlayerFooter from './PlayerFooter';
import SongMenu from '../components/SongMenu';
import HeaderMenu from '../components/HeaderMenu';
import GroupSection from '../components/GroupSection';

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '$bodySecondaryBackgroundColor'
  }
});

class Favorites extends Component {
  constructor(props) {
    super(props);

    this._renderSongs = this._renderSongs.bind(this);
    this._renderSong = this._renderSong.bind(this);
    this._renderArtists = this._renderArtists.bind(this);
    this._renderArtist = this._renderArtist.bind(this);
    this._renderAlbums = this._renderAlbums.bind(this);
    this._renderAlbum = this._renderAlbum.bind(this);
    this._renderGenres = this._renderGenres.bind(this);
    this._renderGenre = this._renderGenre.bind(this);
    this._renderMenu = this._renderMenu.bind(this);
    this._groupItems = this._groupItems.bind(this);
    this._playSongs = this._playSongs.bind(this);
  }

  componentDidMount() {
    this.props.load();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.update != this.props.update && nextProps.update)
      this.props.load();
  }

  render() {
    return (
      <View style={styles.container}>
        <FavoritesHeader
          onBackPress={() => this.props.navigation.goBack()}
          onMorePress={() => this.props.setMenu({ type: 'MENU' })} />
        <Body>
          <ScrollView>
            {this.props.songs.length ? this._renderSongs() : null}
            {this.props.albums.length ? this._renderAlbums() : null}
            {this.props.artists.length ? this._renderArtists() : null}
            {this.props.genres.length ? this._renderGenres() : null}
          </ScrollView>
        </Body>
        {this._renderMenu()}
        <PlayerFooter navigation={this.props.navigation} />
      </View>
    );
  }

  _renderSongs() {
    return (
      <GroupSection
        title={'Songs'}
        getItemLayout={(data, index) => ({ length: 56, offset: 56 * index, index })}
        data={this.props.songs}
        renderItem={this._renderSong}
        keyExtractor={(item, index) => item.id} />
    );
  }

  _renderAlbums() {
    return (
      <GroupSection
        title={'Albums'}
        getItemLayout={(data, index) => ({ length: 160, offset: 160 * index, index })}
        data={this._groupItems(this.props.albums)}
        renderItem={album => this._renderItem(album, this._renderAlbum)}
        keyExtractor={(item, index) => index} />
    );
  }

  _renderArtists() {
    return (
      <GroupSection
        title={'Artists'}
        getItemLayout={(data, index) => ({ length: 160, offset: 160 * index, index })}
        data={this._groupItems(this.props.artists)}
        renderItem={artist => this._renderItem(artist, this._renderArtist)}
        keyExtractor={(item, index) => index} />
    );
  }

  _renderGenres() {
    return (
      <GroupSection
        title={'Genres'}
        getItemLayout={(data, index) => ({ length: 160, offset: 160 * index, index })}
        data={this._groupItems(this.props.genres)}
        renderItem={genre => this._renderItem(genre, this._renderGenre)}
        keyExtractor={(item, index) => index} />
    );
  }

  _renderSong(song) {
    let targetMenu = {
      type: 'SONG',
      payload: song
    };

    return (
      <View key={song.index}>
        <SongCard
          styles={{ container: styles.item, text: styles.itemText }}
          id={song.item.id}
          name={song.item.title}
          artist={song.item.artist}
          duration={song.item.duration}
          onOptionPressed={measures => this.props.setMenu(targetMenu, measures.absoluteX, measures.absoluteY)}
          onPress={() => this._playSongs(song.item)}
        />
      </View>
    );
  }

  _renderAlbum(album) {
    let targetMenu = {
      type: 'ALBUM',
      payload: album
    };

    let songCount = album.songs.length;

    return (
      <AlbumCard
        onPress={() => this.props.navigation.navigate('Album', { album })}
        id={album.id}
        name={album.album}
        artist={album.artist}
        songs={songCount}
        source={require('../images/music.png')}
        imageUri={album.cover}
        onOptionPressed={measures => this.props.setMenu(targetMenu, measures.absoluteX, measures.absoluteY)}
      />
    );
  }

  _renderArtist(artist) {
    let targetMenu = {
      type: 'ARTIST',
      payload: artist
    };

    let songCount = 0;
    for (let i = 0; i < artist.albums.length; i++) {
      songCount += artist.albums[i].songs.length;
    }
    let albumCount = (artist && artist.albums) ? artist.albums.length : 0;

    return (
      <ArtistCard
        onPress={() => this.props.navigation.navigate('Artist', { artist })}
        id={artist.id}
        name={artist.artist}
        albums={albumCount}
        songs={songCount}
        source={require('../images/music.png')}
        imageUri={artist.cover}
        onOptionPressed={measures => this.props.setMenu(targetMenu, measures.absoluteX, measures.absoluteY)}
      />
    );
  }

  _renderGenre(genre) {
    let targetMenu = {
      type: 'GENRE',
      payload: genre
    };

    let songCount = 0;
    for (let i = 0; i < genre.albums.length; i++) {
      songCount += genre.albums[i].songs.length;
    }
    let albumCount = (genre && genre.albums) ? genre.albums.length : 0;

    return (
      <GenreCard
        onPress={() => this.props.navigation.navigate('Genre', { genre })}
        id={genre.id}
        name={genre.genre}
        albums={albumCount}
        songs={songCount}
        source={require('../images/music.png')}
        imageUri={genre.cover}
        onOptionPressed={measures => this.props.setMenu(targetMenu, measures.absoluteX, measures.absoluteY)}
      />
    );
  }

  _renderMenu() {
    if (!this.props.showMenu || this.props.targetMenu.caller !== 'FAVORITES')
      return null;

    switch (this.props.targetMenu.type.toLowerCase()) {
      case 'song':
      case 'artist':
      case 'album':
      case 'genre':
        return (
          <SongMenu
            isFavorite={true} positionX={this.props.menuPositionX}
            positionY={this.props.menuPositionY}
            onPress={() => this.props.setMenu({ type: this.props.targetMenu.type })}/>
        );

      default:
        return <HeaderMenu onPress={() => this.props.setMenu({ type: this.props.targetMenu.type })} positionX={this.props.menuPositionX} positionY={this.props.menuPositionY} />;
    }
  }

  _renderItem(items, renderCard) {
    return (
      <ThreeColumnContainer items={items.item} renderItem={renderCard} />
    );
  }

  _groupItems(items) {
    let grupedItems = [];

    for (let i = 0; i < items.length; i += 3) {
      grupedItems.push(items.slice(i, 3 + i));
    }

    return grupedItems;
  }

  _playSongs(song) {
    let queue = this.props.songs;

    if (song) {
      let index = queue.findIndex(s => s.artist === song.artist && s.album === song.album && s.name === song.name);
      if (index !== -1) {
        queue.splice(index, 1);
        queue.unshift(song);
      }
    }

    this.props.navigation.navigate('Player', { queue })
  }
}

const mapStateToProps = state => {
  return {
    isLoading: state.favorites.isLoading,
    update: state.favorites.update,
    songs: state.favorites.songs,
    albums: state.favorites.albums,
    artists: state.favorites.artists,
    genres: state.favorites.genres,
    showMenu: state.app.showMenu,
    targetMenu: state.app.targetMenu,
    menuPositionX: state.app.menuPositionX,
    menuPositionY: state.app.menuPositionY,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    load: () => favoritesActions.load()(dispatch),
    setMenu: (target, positionX, positionY) => dispatch(appActions.setMenu({ ...target, caller: 'FAVORITES' }, positionX, positionY)),
  }
}

Favorites.propTypes = {
  isLoading: PropTypes.bool,
  update: PropTypes.bool,
  songs: PropTypes.array,
  albums: PropTypes.array,
  artists: PropTypes.array,
  genres: PropTypes.array,
  showMenu: PropTypes.bool,
  targetMenu: PropTypes.object,
  menuPositionX: PropTypes.number,
  menuPositionY: PropTypes.number,
  load: PropTypes.func,
  setMenu: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(Favorites);