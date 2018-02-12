import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as searchActions from '../redux/actions/searchActions';
import * as appActions from '../redux/actions/appActions';

import {
  ScrollView,
  View,
  Text
} from 'react-native';
import Container from '../components/common/containers/Container';
import Body from '../components/Body';
import SearchHeader from '../components/SearchHeader';
import GroupSection from '../components/GroupSection';
import SongCard from '../components/SongCard';
import PlayerFooter from './PlayerFooter';

class Search extends Component {
  constructor(props) {
    super(props);

    this._renderSongs = this._renderSongs.bind(this);
    this._renderSong = this._renderSong.bind(this);
    this._renderArtists = this._renderArtists.bind(this);
    this._renderArtist = this._renderArtist.bind(this);
    this._renderAlbums = this._renderAlbums.bind(this);
    this._renderAlbum = this._renderAlbum.bind(this);
    this._playSongs = this._playSongs.bind(this);
  }

  render() {
    return (
      <Container>
        <SearchHeader
          onBackPress={() => this.props.navigation.goBack()}
          search={text => this.props.search(text)}
          deleteSearch={() => this.props.search(null)}
          onMorePress={() => this.props.setMenu({ target: 'MENU' })}
          criteria={this.props.criteria}
        />
        <Body>
          {
            this.props.mustCompleteCriteria ?
              <Text>{'Enter some text to search...'}</Text> :
              <ScrollView>
                {this.props.songs.length ? this._renderSongs() : null}
                {this.props.albums.length ? this._renderAlbums() : null}
                {this.props.artists.length ? this._renderArtists() : null}
              </ScrollView>
          }
        </Body>
        {this._renderMenu()}
        <PlayerFooter navigation={this.props.navigation} />
      </Container>
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
        data={this.props.albums}
        renderItem={album => () => {}}
        keyExtractor={(item, index) => index} />
    );
  }

  _renderArtists() {
    return (
      <GroupSection
        title={'Artists'}
        getItemLayout={(data, index) => ({ length: 160, offset: 160 * index, index })}
        data={this.props.artists}
        renderItem={artist => () => {}}
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

    return null;
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

    return null;
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
    criteria: state.search.criteria,
    result: state.search.result,
    isSearching: state.search.isSearching,
    mustCompleteCriteria: state.search.mustCompleteCriteria,
    songs: state.search.result.byTitle,
    albums: state.search.result.byAlbum,
    artists: state.search.result.byArtist,
    genres: state.search.result.byGenre,
    showMenu: state.app.showMenu,
    targetMenu: state.app.targetMenu
  }
}

const mapDispatchToProps = dispatch => {
  return {
    search: text => searchActions.search(text)(dispatch),
    setMenu: (target, positionX, positionY) => dispatch(appActions.setMenu({ ...target, caller: 'SEARCH' }, positionX, positionY)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Search);