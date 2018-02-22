import React, { Component } from 'react';
import { connect } from 'react-redux';
import EStyleSheet from 'react-native-extended-stylesheet';

import * as searchActions from '../redux/actions/searchActions';
import * as appActions from '../redux/actions/appActions';

import {
  ScrollView,
  View
} from 'react-native';
import Container from '../components/common/containers/Container';
import Body from '../components/Body';
import Text from '../components/common/Text';
import SearchHeader from '../components/SearchHeader';
import GroupSection from '../components/GroupSection';
import SongCard from '../components/SongCard';
import RowCoverCard from '../components/common/cards/RowCoverCard';
import PlayerFooter from './PlayerFooter';

const styles = EStyleSheet.create({
  text: {
    marginTop: 20
  }
});

class Search extends Component {
  constructor(props) {
    super(props);

    this._renderSongs = this._renderSongs.bind(this);
    this._renderSong = this._renderSong.bind(this);
    this._renderArtists = this._renderArtists.bind(this);
    this._renderPlaylists = this._renderPlaylists.bind(this);
    this._renderArtist = this._renderArtist.bind(this);
    this._renderAlbums = this._renderAlbums.bind(this);
    this._renderAlbum = this._renderAlbum.bind(this);
    this._renderPlaylist = this._renderPlaylist.bind(this);
    this._getDefaultCover = this._getDefaultCover.bind(this);
  }

  render() {
    return (
      <Container fillStatusBar={false}>
        <SearchHeader
          placeholder={this.props.dictionary.getWord('find_music')}
          onBackPress={() => this.props.navigation.goBack()}
          search={text => this.props.search(text)}
          deleteSearch={() => this.props.search(null)}
          criteria={this.props.criteria}
        />
        <Body>
          {
            this.props.mustCompleteCriteria ?
              <Text style={styles.text}>{this.props.dictionary.getWord('start_typing_something')}</Text> :
              <ScrollView>
                {this.props.songs.length ? this._renderSongs() : null}
                {this.props.albums.length ? this._renderAlbums() : null}
                {this.props.artists.length ? this._renderArtists() : null}
                {this.props.playlists.length ? this._renderPlaylists() : null}
              </ScrollView>
          }
        </Body>
        <PlayerFooter navigation={this.props.navigation} />
      </Container>
    );
  }

  _renderSongs() {
    return (
      <GroupSection
        title={this.props.dictionary.getWord('songs')}
        data={this.props.songs}
        renderItem={({ item }) => this._renderSong(item)}
        keyExtractor={(item, index) => item.id} />
    );
  }

  _renderAlbums() {
    return (
      <GroupSection
        title={'Albums'}
        getItemLayout={(data, index) => ({ length: 160, offset: 160 * index, index })}
        data={this.props.albums}
        renderItem={({ item }) => this._renderAlbum(item)}
        keyExtractor={(item, index) => index} />
    );
  }

  _renderArtists() {
    return (
      <GroupSection
        title={this.props.dictionary.getWord('artists')}
        data={this.props.artists}
        renderItem={({ item }) => this._renderArtist(item)}
        keyExtractor={(item, index) => index} />
    );
  }

  _renderPlaylists() {
    return (
      <GroupSection
        title={this.props.dictionary.getWord('playlists')}
        data={this.props.playlists}
        renderItem={({ item }) => this._renderPlaylist(item)}
        keyExtractor={(item, index) => index} />
    );
  }

  _renderSong(song) {
    return (
      <SongCard
        id={song.id}
        name={song.title}
        artist={song.artist}
        duration={song.duration}
        onPress={() => this.props.navigation.navigate('Player', { queue: [song] })}
      />
    );
  }

  _renderAlbum(album) {
    return (
      <RowCoverCard
        title={album.album !== 'null' ? album.album : this.props.dictionary.getWord('unknown_album')}
        detail={album.artist + ' - ' + album.songs.length + ' ' + this.props.dictionary.getWord('songs')}
        cover={album.cover}
        showFavoriteButton={false}
        onPress={() => this.props.navigation.navigate('Album', { album })} />
    );
  }

  _renderArtist(artist) {
    let songsCount = artist.albums.reduce(((sum, array) => sum + array.songs.length), 0);

    return (
      <RowCoverCard
        title={artist.artist !== 'null' ? artist.artist : this.props.dictionary.getWord('unknown_artist')}
        detail={artist.albums.length + ' ' + this.props.dictionary.getWord('albums') + ' - ' + songsCount + ' ' + this.props.dictionary.getWord('songs')}
        cover={artist.cover}
        showFavoriteButton={false}
        onPress={() => this.props.navigation.navigate('Artist', { artist })}
        onLikePress={() => this.props.like('artist', artist)} />
    );
  }

  _renderPlaylist(playlist) {
    let detail = playlist.songs.length + ' ' + this.props.dictionary.getWord('songs');

    return (
      <RowCoverCard
        showFavoriteButton={false}
        title={playlist.name}
        detail={detail}
        cover={this._getDefaultCover(playlist.songs)}
        showFavoriteButton={false}
        onPress={() => this.props.navigation.navigate('Playlist', { playlistId: playlist.id })} />
    );
  }

  _getDefaultCover(songs) {
    for (let i = 0; i < songs.length; i++) {
      if (songs[i].cover) {
        return songs[i].cover;
      }
    }

    return null;
  }
}

const mapStateToProps = state => {
  return {
    dictionary: state.app.dictionary,
    criteria: state.search.criteria,
    result: state.search.result,
    isSearching: state.search.isSearching,
    mustCompleteCriteria: state.search.mustCompleteCriteria,
    songs: state.search.songs,
    albums: state.search.albums,
    artists: state.search.artists,
    playlists: state.search.playlists
  }
}

const mapDispatchToProps = dispatch => {
  return {
    search: text => searchActions.search(text)(dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Search);