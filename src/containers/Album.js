import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import EStyleSheet from 'react-native-extended-stylesheet';

import * as albumActions from '../redux/actions/albumActions';
import * as appActions from '../redux/actions/appActions';
import * as favoritesActions from '../redux/actions/favoritesActions';
import * as playerActions from '../redux/actions/playerActions';

import {
  View,
  Text
} from 'react-native';
import ContainerView from '../components/ContainerView';
import Header from '../components/Header';
import SongCard from '../components/SongCard';
import SongMenu from '../components/SongMenu';
import HeaderMenu from '../components/HeaderMenu';
import FloatMenuOption from '../components/FloatMenuOption';
import PlayerFooter from './PlayerFooter';

const styles = EStyleSheet.create({
  container: {
    backgroundColor: '$bodyBackgroundColor'
  },
  text: {
    color: '$textColor'
  },
  coverContentTitle: {
    color: '$floatMenuOptionTextColor',
    fontSize: '$titleFontSize'
  },
  coverContentText: {
    color: '$textColor'
  }
});

class Album extends Component {
  constructor(props) {
    super(props);

    this._renderSong = this._renderSong.bind(this);
    this._renderCoverContent = this._renderCoverContent.bind(this);
    this._renderTargetMenu = this._renderTargetMenu.bind(this);
    this._getSections = this._getSections.bind(this);
    this._playSongs = this._playSongs.bind(this);
    this._getAlbumMenu = this._getAlbumMenu.bind(this);
    this._getSongMenu = this._getSongMenu.bind(this);
    this._addToQueue = this._addToQueue.bind(this);
  }

  componentDidMount() {
    const { album, albumName, artistName } = this.props.navigation.state.params;
    this.props.load(album || albumName, artistName);
  }

  render() {
    let songs = this.props.album ? this.props.album.songs : [];
    let initialSong = songs.length > 0 ? songs[0] : null;

    return (
      <ContainerView
        title={''}
        onBackPress={() => this.props.navigation.goBack()}
        onSearchPress={() => this.props.navigation.navigate('Search', {})}
        onLikePress={() => this.props.like(this.props.album)}
        onPlayPress={() => this._playSongs(initialSong, songs, false)}
        onMenuPress={() => this.props.setMenu({ type: 'MENU' })}
        coverContent={this._renderCoverContent()}
        sections={this._getSections()}
        source={require('../images/music.png')}
        imageUri={this.props.album ? this.props.album.cover : null}
        showMenu={this.props.showMenu && (!this.props.targetMenu ? undefined : this.props.targetMenu.caller) === 'ALBUM'}
        menuContent={this._renderTargetMenu()}
        menuPositionX={this.props.menuPositionX}
        menuPositionY={this.props.menuPositionY}
        like={this.props.isFavorite}
        footer={(<PlayerFooter navigation={this.props.navigation} />)}>
      </ContainerView>
    );
  }

  _renderCoverContent() {
    let album = this.props.album ? this.props.album.album : null;
    let artist = this.props.album ? this.props.album.artist : null;
    let songs = this.props.album ? this.props.album.songs : [];

    return (
      <View>
        <Text style={styles.coverContentTitle}>{album}</Text>
        <Text style={styles.coverContentText}>{artist}</Text>
        <Text style={styles.coverContentText}>{songs.length + ' songs'}</Text>
      </View>
    );
  }

  _renderSong(song) {
    let targetMenu = {
      type: 'SONG',
      payload: song.item
    };

    return (
      <SongCard
        styles={{ container: styles.container, text: styles.text }}
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

  _renderTargetMenu() {
    if (!this.props.showMenu || (!this.props.targetMenu ? undefined : this.props.targetMenu.caller) !== 'ALBUM')
      return null;

    switch (this.props.targetMenu.type.toLowerCase()) {
      case 'song':
        return this._getSongMenu(this.props.targetMenu.payload);
      default:
        return this._getAlbumMenu();
    }
  }

  _getSections() {
    return [{
      data: this.props.album ? this.props.album.songs : [],
      renderItem: this._renderSong,
      title: 'TRACKS'
    }];
  }

  _playSongs(initialSong, queue, closeMenu = false) {
    if (closeMenu)
      this.props.setMenu(null, 0, 0);

    this.props.navigation.navigate('Player', { queue, initialSong, reset: true });
  }

  _addToQueue(queue) {
    this.props.setMenu(null, 0, 0);
    this.props.addToQueue(queue);
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

  _getAlbumMenu() {
    return (
      <HeaderMenu onPress={() => this.props.setMenu({ type: this.props.targetMenu.type })} positionX={this.props.menuPositionX} positionY={this.props.menuPositionY} />
    );
  }
}

const mapStateToProps = state => {
  return {
    album: state.album.album,
    isFavorite: state.album.isFavorite,
    showMenu: state.app.showMenu,
    targetMenu: state.app.targetMenu,
    menuPositionX: state.app.menuPositionX,
    menuPositionY: state.app.menuPositionY,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    load: (album, artist) => albumActions.load(album, artist)(dispatch),
    setMenu: (target, positionX, positionY) => dispatch(appActions.setMenu({ ...target, caller: 'ALBUM' }, positionX, positionY)),
    like: (album) => dispatch(favoritesActions.like('album', album)),
    addToQueue: (queue) => playerActions.addToQueue(queue)(dispatch),
  }
}

Album.propTypes = {
  album: PropTypes.object,
  targetMenu: PropTypes.object,
  isFavorite: PropTypes.bool,
  showMenu: PropTypes.bool,
  menuPositionX: PropTypes.number,
  menuPositionY: PropTypes.number,
  load: PropTypes.func,
  setMenu: PropTypes.func,
  like: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(Album);