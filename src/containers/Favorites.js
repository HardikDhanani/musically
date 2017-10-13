import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as favoritesActions from '../redux/actions/favoritesActions';
import * as appActions from '../redux/actions/appActions';

import { StyleSheet, StatusBar, FlatList, ScrollView, View, Text, Dimensions, TouchableOpacity } from 'react-native';

import Header from '../components/Header';
import HeaderTitle from '../components/HeaderTitle';
import SongCard from '../components/SongCard';
import AlbumCard from '../components/AlbumCard';
import ArtistCard from '../components/ArtistCard';
import GenreCard from '../components/GenreCard';
import FloatMenu from '../components/FloatMenu';
import PlayerFooter from './PlayerFooter';
import ThreeColumnContainer from '../components/ThreeColumnContainer';

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
    this._groupItems = this._groupItems.bind(this);
    this._keyExtractor = this._keyExtractor.bind(this);
    this._renderMenu = this._renderMenu.bind(this);
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
        <Header style={styles.header}>
          <View style={styles.left}>
            <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.goBack()}>
              <Text style={styles.buttonText}>{'<<'}</Text>
            </TouchableOpacity>
          </View>
          <View style={{ alignSelf: 'center', flex: 1 }}>
            <HeaderTitle>Favorites</HeaderTitle>
          </View>
          <View style={[styles.right, styles.row]}>
            <TouchableOpacity style={styles.button} onPress={() => this.props.setMenu({ target: 'MENU' })}>
              <Text style={styles.buttonText}>{'+'}</Text>
            </TouchableOpacity>
          </View>
        </Header>
        <View style={[styles.body, { height: this._getHeight() }]}>
          {
            this.props.mustCompleteCriteria ?
              <Text style={[styles.itemText, { fontStyle: 'italic', marginTop: 20 }]}>{'Enter some text to search...'}</Text> :
              <ScrollView>
                {this.props.songs.length ? this._renderSongs() : null}
                {this.props.albums.length ? this._renderAlbums() : null}
                {this.props.artists.length ? this._renderArtists() : null}
                {this.props.genres.length ? this._renderGenres() : null}
              </ScrollView>
          }
        </View>
        {this._renderMenu()}
        <PlayerFooter navigation={this.props.navigation} />
      </View>
    );
  }

  _getHeight() {
    let footerHeight = 60;
    let headerHeight = Header.currentHeight;
    let statusBarHeight = StatusBar.currentHeight;
    let windowHeight = Dimensions.get('window').height;

    return windowHeight - (headerHeight + footerHeight + statusBarHeight);
  }

  _renderSongs() {
    return (
      <View>
        <View style={styles.sectionTitle}>
          <Text style={styles.sectionTitleText}>{'Songs'}</Text>
        </View>
        <FlatList
          getItemLayout={(data, index) => ({ length: 56, offset: 56 * index, index })}
          data={this.props.songs}
          renderItem={this._renderSong}
          keyExtractor={(item, index) => item.id} />
      </View>
    );
  }

  _renderAlbums() {
    return (
      <View>
        <View style={styles.sectionTitle}>
          <Text style={styles.sectionTitleText}>{'Albums'}</Text>
        </View>
        <FlatList
          getItemLayout={(data, index) => ({ length: 160, offset: 160 * index, index })}
          data={this._groupItems(this.props.albums)}
          renderItem={album => this._renderItem(album, this._renderAlbum)}
          keyExtractor={this._keyExtractor} />
      </View>
    );
  }

  _renderArtists() {
    return (
      <View>
        <View style={styles.sectionTitle}>
          <Text style={styles.sectionTitleText}>{'Artists'}</Text>
        </View>
        <FlatList
          getItemLayout={(data, index) => ({ length: 160, offset: 160 * index, index })}
          data={this._groupItems(this.props.artists)}
          renderItem={artist => this._renderItem(artist, this._renderArtist)}
          keyExtractor={this._keyExtractor} />
      </View>
    );
  }

  _renderGenres() {
    return (
      <View>
        <View style={styles.sectionTitle}>
          <Text style={styles.sectionTitleText}>{'Genres'}</Text>
        </View>
        <FlatList
          getItemLayout={(data, index) => ({ length: 160, offset: 160 * index, index })}
          data={this._groupItems(this.props.genres)}
          renderItem={genre => this._renderItem(genre, this._renderGenre)}
          keyExtractor={this._keyExtractor} />
      </View>
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

  _keyExtractor(item, index) {
    return index;
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
      (
        <TouchableOpacity key={1} style={styles.floatMenuOption}>
          <Text style={styles.floatMenuOptionText}>{'Sort Order'}</Text>
          <Text style={styles.floatMenuOptionText}>{'>'}</Text>
        </TouchableOpacity>
      ),
      (
        <TouchableOpacity key={2} style={styles.floatMenuOption}>
          <Text style={styles.floatMenuOptionText}>{'View Mode'}</Text>
          <Text style={styles.floatMenuOptionText}>{'>'}</Text>
        </TouchableOpacity>
      ),
      (
        <TouchableOpacity key={3} style={styles.floatMenuOption}>
          <Text style={styles.floatMenuOptionText}>{'Rescan Library'}</Text>
        </TouchableOpacity>
      ),
      (
        <TouchableOpacity key={4} style={styles.floatMenuOption}>
          <Text style={styles.floatMenuOptionText}>{'Playlist Queue'}</Text>
        </TouchableOpacity>
      )
    ];
  }

  _getArtistMenu() {
    return [
      (
        <TouchableOpacity key={1} style={styles.floatMenuOption}>
          <Text style={styles.floatMenuOptionText}>{'Play'}</Text>
        </TouchableOpacity>
      ),
      (
        <TouchableOpacity key={2} style={styles.floatMenuOption}>
          <Text style={styles.floatMenuOptionText}>{'Add to playlist'}</Text>
        </TouchableOpacity>
      ),
      (
        <TouchableOpacity key={3} style={styles.floatMenuOption}>
          <Text style={styles.floatMenuOptionText}>{'Add to queue'}</Text>
        </TouchableOpacity>
      )
    ]
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4c4c4c',
  },
  header: {
    backgroundColor: '#2E2E2E'
  },
  body: {
    alignItems: 'center',
    alignSelf: 'center',
  },
  left: {
    flex: 1,
    alignSelf: 'center',
    alignItems: 'flex-start',
  },
  right: {
    flex: 1,
    alignSelf: 'center',
    alignItems: 'flex-end',
  },
  button: {
    height: Header.currentHeight * 0.7,
    width: Header.currentHeight * 0.7,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
  },
  sectionTitle: {
    width: Dimensions.get('window').width,
    height: Header.currentHeight * 0.7,
    backgroundColor: '#4c4c4c',
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    justifyContent: 'center',
    paddingLeft: 10,
    marginBottom: 5
  },
  sectionTitleText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  },
  floatMenuOption: {
    flexDirection: 'row',
    height: Header.currentHeight * 0.8,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10
  },
  floatMenuOptionText: {
    fontSize: 15,
    color: 'white'
  },
  title: {
    color: 'white',
    alignSelf: 'center',
    justifyContent: 'flex-end',
  },
});

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
    setMenu: (target, positionX, positionY) => dispatch(appActions.setMenu(target, positionX, positionY)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Favorites);