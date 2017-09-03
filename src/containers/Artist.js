import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as artistActions from '../redux/actions/artistActions';
import * as appActions from '../redux/actions/appActions';
import * as favoritesActions from '../redux/actions/favoritesActions';

import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

import ContainerView from '../components/ContainerView';
import Header from '../components/Header';
import SongCard from '../components/SongCard';
import AlbumCard from '../components/AlbumCard';
import PlayerFooter from './PlayerFooter';

class Artist extends Component {
  constructor(props) {
    super(props);

    this._renderSong = this._renderSong.bind(this);
    this._coverContent = this._coverContent.bind(this);
    this._getSections = this._getSections.bind(this);
    this._getTargetMenu = this._getTargetMenu.bind(this);
    this._getMenu = this._getMenu.bind(this);
    this._playSongs = this._playSongs.bind(this);
    this._groupItems = this._groupItems.bind(this);
    this._renderAlbum = this._renderAlbum.bind(this);
    this._renderItem = this._renderItem.bind(this);
  }

  componentDidMount() {
    const { artist, artistName } = this.props.navigation.state.params;
    this.props.load(artist || artistName);
  }

  render() {
    return (
      <ContainerView
        title={''}
        onBackPress={() => this.props.navigation.goBack()}
        onSearchPress={() => this.props.navigation.navigate('Search', {})}
        onLikePress={() => this.props.like(this.props.artist)}
        onMenuPress={() => this.props.setMenu({ target: 'MENU' })}
        onPlayPress={() => this._playSongs()}
        coverContent={this._coverContent()}
        sections={this._getSections()}
        source={require('../images/music.png')}
        imageUri={this.props.artist ? this.props.artist.cover : null}
        showMenu={this.props.showMenu}
        menuContent={this._getTargetMenu()}
        menuPositionX={this.props.menuPositionX}
        menuPositionY={this.props.menuPositionY}
        like={this.props.isFavorite}
        footer={(<PlayerFooter navigation={this.props.navigation} />)}>
      </ContainerView>
    );
  }

  _coverContent() {
    let artist = this.props.artist ? this.props.artist.artist : null;
    let albums = this.props.artist ? this.props.artist.albums : [];
    let songs = albums ? [].concat.apply([], albums.map(a => a.songs)) : [];

    return (
      <View>
        <Text style={[styles.coverText, { color: 'white', fontSize: 17 }]}>{artist}</Text>
        <Text style={[styles.coverText, { color: 'gray' }]}>{albums.length + ' albums'}</Text>
        <Text style={[styles.coverText, { color: 'gray' }]}>{songs.length + ' songs'}</Text>
      </View>
    );
  }

  _getSections() {
    let albums = this.props.artist ? this.props.artist.albums : []
    let albumsSongs = albums ? albums.map(a => a.songs) : [];
    let songs = albumsSongs ? [].concat.apply([], albumsSongs) : [];

    return [
      {
        data: songs,
        renderItem: this._renderSong,
        title: 'TRACKS'
      },
      {
        data: this._groupItems(albums),
        renderItem: items => this._renderItem(items, this._renderAlbum),
        title: 'ALBUMS'
      },
    ];
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
        onOptionPressed={measures => this.props.setMenu(targetMenu, measures.absoluteX, measures.absoluteY)}
        onPress={() => this._playSongs(song.item)}
      />
    );
  }

  _renderAlbum(album) {
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

  _renderItem(items, renderCard) {
    return (
      <View style={{ flexDirection: 'row', flex: 1 }}>
        {items.item[0] ? renderCard(items.item[0]) : null}
        {items.item[1] ? renderCard(items.item[1]) : null}
        {items.item[2] ? renderCard(items.item[2]) : null}
      </View>
    );
  }

  _groupItems(items) {
    let grupedItems = [];
    for (let i = 0; i < items.length; i += 3) {
      grupedItems.push(items.slice(i, 3 + i));
    }
    return grupedItems;
  }

  _getTargetMenu() {
    if (!this.props.showMenu)
      return null;

    switch (this.props.targetMenu.type) {
      case 'SONG':
      case 'ALBUM':
        return this._getSongMenu();

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

  _getSongMenu() {
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

  _playSongs(initialSong) {
    let albums = this.props.artist ? this.props.artist.albums.map(a => a.songs) : [];
    let queue = albums ? [].concat.apply([], albums) : [];

    this.props.navigation.navigate('Player', { queue, initialSong });
  }
}

const styles = StyleSheet.create({
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
  }
});

const mapStateToProps = state => {
  return {
    artist: state.artist.artist,
    isFavorite: state.artist.isFavorite,
    showMenu: state.app.showMenu,
    targetMenu: state.app.targetMenu,
    menuPositionX: state.app.menuPositionX,
    menuPositionY: state.app.menuPositionY,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    load: (artist) => artistActions.load(artist)(dispatch),
    setMenu: (target, positionX, positionY) => dispatch(appActions.setMenu(target, positionX, positionY)),
    like: (artist) => dispatch(favoritesActions.like('artist', artist)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Artist);