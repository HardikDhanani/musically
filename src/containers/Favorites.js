import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import * as favoritesActions from '../redux/actions/favoritesActions';

import {
  ScrollView,
  View
} from 'react-native';
import RowCoverCard from '../components/common/cards/RowCoverCard';
import Container from '../components/Container';
import FavoritesHeader from '../components/favorites/FavoritesHeader';
import Body from '../components/Body';
import SongCard from '../components/SongCard';
import PlayerFooter from './PlayerFooter';
import GroupSection from '../components/GroupSection';
import ModalForm from '../components/common/forms/ModalForm';
import ModalFormTouchable from '../components/common/buttons/ModalFormTouchable';

class Favorites extends Component {
  constructor(props) {
    super(props);

    this._renderSongs = this._renderSongs.bind(this);
    this._renderSong = this._renderSong.bind(this);
    this._renderArtists = this._renderArtists.bind(this);
    this._renderArtist = this._renderArtist.bind(this);
    this._renderAlbums = this._renderAlbums.bind(this);
    this._renderAlbum = this._renderAlbum.bind(this);
    this._renderMenu = this._renderMenu.bind(this);
    this._playSongs = this._playSongs.bind(this);
    this._addToPlaylist = this._addToPlaylist.bind(this);
    this._addToQueue = this._addToQueue.bind(this);
  }

  componentWillMount() {
    this.props.load();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.update != this.props.update && nextProps.update) {
      this.props.load();
    }
  }

  render() {
    return (
      <Container fillStatusBar={false}>
        <FavoritesHeader
          title={this.props.dictionary.getWord('favorites')}
          onBackPress={() => this.props.navigation.goBack()} />
        <Body>
          <ScrollView>
            {this.props.songs.length ? this._renderSongs() : null}
            {this.props.albums.length ? this._renderAlbums() : null}
            {this.props.artists.length ? this._renderArtists() : null}
          </ScrollView>
        </Body>
        {this._renderMenu()}
        <PlayerFooter navigation={this.props.navigation} />
      </Container>
    );
  }

  _renderSongs() {
    return (
      <GroupSection
        title={this.props.dictionary.getWord('songs')}
        data={this.props.songs}
        renderItem={song => this._renderSong(song.item)}
        keyExtractor={(item, index) => item.id}
        numColumns={1} />
    );
  }

  _renderAlbums() {
    return (
      <GroupSection
        title={this.props.dictionary.getWord('albums')}
        data={this.props.albums}
        renderItem={album => this._renderAlbum(album.item)}
        keyExtractor={(item, index) => index}
        numColumns={2} />
    );
  }

  _renderArtists() {
    return (
      <GroupSection
        title={this.props.dictionary.getWord('artists')}
        data={this.props.artists}
        renderItem={artist => this._renderArtist(artist.item)}
        keyExtractor={(item, index) => index}
        numColumns={2} />
    );
  }

  _renderSong(song) {
    let targetMenu = {
      type: 'SONG',
      payload: song
    };

    return (
      <SongCard
        id={song.id}
        name={song.title}
        artist={song.artist}
        isFavorite={song.isFavorite}
        isPlaying={false}
        onOptionPress={() => this.props.setMenu(targetMenu)}
        onPlayPress={() => this._playSongs([song])}
        onLikePress={() => this.props.like('song', song)} />
    );
  }

  _renderAlbum(album) {
    return (
      <RowCoverCard
        title={album.album}
        detail={album.artist + ' - ' + album.songs.length + ' ' + this.props.dictionary.getWord('songs')}
        cover={album.cover}
        isFavorite={album.isFavorite}
        onPress={() => this.props.navigation.navigate('Album', { album })}
        onLikePress={() => this.props.like('album', album)} />
    );
  }

  _renderArtist(artist) {
    let albums = artist.albums.length;
    let songs = artist.albums.reduce(((sum, album) => sum + album.songs.length), 0);

    return (
      <RowCoverCard
        title={artist.artist}
        detail={albums + ' ' + this.props.dictionary.getWord('albums') + ' - ' + songs + ' ' + this.props.dictionary.getWord('songs')}
        cover={artist.cover}
        isFavorite={artist.isFavorite}
        onPress={() => this.props.navigation.navigate('Artist', { artist })}
        onLikePress={() => this.props.like('artist', artist)} />
    );
  }

  _renderMenu() {
    if (!this.props.showMenu || (!this.props.targetMenu ? undefined : this.props.targetMenu.caller) !== 'FAVORITES')
      return null;

    return (
      <ModalForm
        title={this.props.targetMenu.payload.title}
        onCancelPress={() => this.props.setMenu()}>
        <ModalFormTouchable
          text={this.props.dictionary.getWord('add_to_playlist')}
          onPress={() => this._addToPlaylist(this.props.targetMenu.payload)} />
        <ModalFormTouchable
          text={this.props.dictionary.getWord('add_to_queue')}
          onPress={() => this._addToQueue([this.props.targetMenu.payload])} />
        <ModalFormTouchable
          text={this.props.dictionary.getWord('file_detail')}
          onPress={() => { }} />
      </ModalForm>
    );
  }

  _playSongs(songs) {

  }

  _addToPlaylist(song) {
    this.props.setMenu(null);
    this.props.navigation.navigate('PlaylistSelector', { song });
  }

  _addToQueue(songs) {
    this.props.setMenu(null);
    this.props.addToQueue(songs);
  }
}

const mapStateToProps = state => {
  return {
    dictionary: state.app.dictionary,
    isLoading: state.favorites.isLoading,
    update: state.favorites.update,
    songs: state.favorites.songs,
    albums: state.favorites.albums,
    artists: state.favorites.artists,
    showMenu: state.app.showMenu,
    targetMenu: state.app.targetMenu
  }
}

const mapDispatchToProps = dispatch => {
  return {
    load: () => favoritesActions.load()(dispatch),
    setMenu: (target) => favoritesActions.setMenu(target)(dispatch),
    like: (type, song) => favoritesActions.like(type, song)(dispatch),
    addToQueue: (queue) => favoritesActions.addToQueue(queue)(dispatch)
  }
}

Favorites.propTypes = {
  dictionary: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  update: PropTypes.bool.isRequired,
  songs: PropTypes.array.isRequired,
  albums: PropTypes.array.isRequired,
  artists: PropTypes.array.isRequired,
  showMenu: PropTypes.bool.isRequired,
  targetMenu: PropTypes.object,
  load: PropTypes.func.isRequired,
  setMenu: PropTypes.func.isRequired,
  like: PropTypes.func.isRequired,
  addToQueue: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(Favorites);