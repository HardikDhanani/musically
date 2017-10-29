import React, { Component } from 'react';
import {
  ScrollView,
  View,
  Text
} from 'react-native';
import { connect } from 'react-redux';
import * as searchActions from '../redux/actions/searchActions';
import * as appActions from '../redux/actions/appActions';

import StyleManager from '../styles/StyleManager';

import Header from '../components/Header';
import Body from '../components/Body';
import SearchHeader from '../components/SearchHeader';
import GroupSection from '../components/GroupSection';
import SongCard from '../components/SongCard';
import AlbumCard from '../components/AlbumCard';
import ArtistCard from '../components/ArtistCard';
import GenreCard from '../components/GenreCard';
import FloatMenu from '../components/FloatMenu';
import FloatMenuOption from '../components/FloatMenuOption';
import PlayerFooter from './PlayerFooter';
import ThreeColumnContainer from '../components/ThreeColumnContainer';

class Search extends Component {
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
    this._groupItems = this._groupItems.bind(this);
    this._renderMenu = this._renderMenu.bind(this);
    this._playSongs = this._playSongs.bind(this);

    this._container = StyleManager.getStyle('SearchContainer');
    this._messageText = StyleManager.getStyle('SearchMessageText');
    this._songCardContainer = StyleManager.getStyle('SearchSongCardContainer');
    this._songCardItemText = StyleManager.getStyle('SearchSongCardItemText');
  }

  render() {
    return (
      <View style={this._container}>
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
              <Text style={this._messageText}>{'Enter some text to search...'}</Text> :
              <ScrollView>
                {this.props.songs.length ? this._renderSongs() : null}
                {this.props.albums.length ? this._renderAlbums() : null}
                {this.props.artists.length ? this._renderArtists() : null}
                {this.props.genres.length ? this._renderGenres() : null}
              </ScrollView>
          }
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
          styles={{ container: this._songCardContainer, text: this._songCardItemText }}
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

  _groupItems(items) {
    let grupedItems = [];
    for (let i = 0; i < items.length; i += 3) {
      grupedItems.push(items.slice(i, 3 + i));
    }
    return grupedItems;
  }

  _renderItem(items, renderCard) {
    return (
      <ThreeColumnContainer items={items.item} renderItem={renderCard} />
    );
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

  _renderMenu() {
    if (!this.props.showMenu)
      return null;

    return (
      <FloatMenu positionY={this.props.menuPositionY} positionX={this.props.menuPositionX} onPress={() => this.props.setMenu(null, 0, 0)}>
        {this._getTargetMenu(this.props.targetMenu.type)}
      </FloatMenu>
    );
  }

  _getTargetMenu(target) {
    switch (target) {
      case 'ARTIST':
      case 'ALBUM':
      case 'GENRE':
      case 'SONG':
        return this._getArtistMenu();

      default:
        return this._getMenu();
    }
  }

  _getMenu() {
    return [
      (<FloatMenuOption key={1} text={'Sort Order'} haveContent={true} />),
      (<FloatMenuOption key={2} text={'View Mode'} haveContent={true} />),
      (<FloatMenuOption key={3} text={'Rescan Library'} />),
      (<FloatMenuOption key={4} text={'Playlist Queue'} />)
    ];
  }

  _getArtistMenu() {
    return [
      (<FloatMenuOption key={1} text={'Play'} />),
      (<FloatMenuOption key={2} text={'Add to playlist'} />),
      (<FloatMenuOption key={3} text={'Add to queue'} />)
    ]
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
    targetMenu: state.app.targetMenu,
    menuPositionX: state.app.menuPositionX,
    menuPositionY: state.app.menuPositionY,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    search: text => searchActions.search(text)(dispatch),
    setMenu: (target, positionX, positionY) => dispatch(appActions.setMenu(target, positionX, positionY)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Search);