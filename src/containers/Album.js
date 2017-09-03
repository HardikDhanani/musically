import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as albumActions from '../redux/actions/albumActions';
import * as appActions from '../redux/actions/appActions';
import * as favoritesActions from '../redux/actions/favoritesActions';

import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Swiper from 'react-native-swiper';

import ContainerView from '../components/ContainerView';

import Header from '../components/Header';
import SongCard from '../components/SongCard';
import PlayerFooter from './PlayerFooter';

class Album extends Component {
  constructor(props) {
    super(props);

    this._renderSong = this._renderSong.bind(this);
    this._coverContent = this._coverContent.bind(this);
    this._getSections = this._getSections.bind(this);
    this._getTargetMenu = this._getTargetMenu.bind(this);
    this._getMenu = this._getMenu.bind(this);
    this._playSongs = this._playSongs.bind(this);
  }

  componentDidMount() {
    const { album, albumName, artistName } = this.props.navigation.state.params;
    this.props.load(album || albumName, artistName);
  }

  render() {
    return (
      <ContainerView
        title={''}
        onBackPress={() => this.props.navigation.goBack()}
        onSearchPress={() => this.props.navigation.navigate('Search', {})}
        onLikePress={() => this.props.like(this.props.album)}
        onMenuPress={() => this.props.setMenu({ target: 'MENU' })}
        onPlayPress={() => this._playSongs()}
        coverContent={this._coverContent()}
        sections={this._getSections()}
        source={require('../images/music.png')}
        imageUri={this.props.album ? this.props.album.cover : null}
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
    let album = this.props.album ? this.props.album.album : null;
    let artist = this.props.album ? this.props.album.artist : null;
    let songs = this.props.album ? this.props.album.songs : [];

    return (
      <View>
        <Text style={[styles.coverText, { color: 'white', fontSize: 17 }]}>{album}</Text>
        <Text style={[styles.coverText, { color: 'gray' }]}>{artist}</Text>
        <Text style={[styles.coverText, { color: 'gray' }]}>{songs.length + ' songs'}</Text>
      </View>
    );
  }

  _getSections() {
    return [{
      data: this.props.album ? this.props.album.songs : [],
      renderItem: this._renderSong,
      title: 'TRACKS'
    }];
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

  _getTargetMenu() {
    if (!this.props.showMenu)
      return null;

    switch (this.props.targetMenu.type) {
      case 'SONG':
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
    let queue = this.props.album ? this.props.album.songs : [];

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
    setMenu: (target, positionX, positionY) => dispatch(appActions.setMenu(target, positionX, positionY)),
    like: (album) => dispatch(favoritesActions.like('album', album)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Album);