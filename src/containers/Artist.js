import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import EStyleSheet from 'react-native-extended-stylesheet';

import * as artistActions from '../redux/actions/artistActions';
import * as appActions from '../redux/actions/appActions';
import * as favoritesActions from '../redux/actions/favoritesActions';

import {
  View,
  Text
} from 'react-native';
import HeaderMenu from '../components/HeaderMenu';
import SongMenu from '../components/SongMenu';
import ContainerView from '../components/ContainerView';
import Header from '../components/Header';
import SongCard from '../components/SongCard';
import AlbumCard from '../components/AlbumCard';
import FloatMenuOption from '../components/FloatMenuOption';
import PlayerFooter from './PlayerFooter';
import ThreeColumnContainer from '../components/ThreeColumnContainer';

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

class Artist extends Component {
  constructor(props) {
    super(props);

    this._renderSong = this._renderSong.bind(this);
    this._renderAlbum = this._renderAlbum.bind(this);
    this._renderTargetMenu = this._renderTargetMenu.bind(this);
    this._renderCoverContent = this._renderCoverContent.bind(this);
    this._getSections = this._getSections.bind(this);
    this._playSongs = this._playSongs.bind(this);
    this._groupItems = this._groupItems.bind(this);
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
        onPlayPress={this._playSongs}
        coverContent={this._renderCoverContent()}
        sections={this._getSections()}
        source={require('../images/music.png')}
        imageUri={this.props.artist ? this.props.artist.cover : null}
        showMenu={this.props.showMenu}
        menuContent={this._renderTargetMenu()}
        like={this.props.isFavorite}
        footer={(<PlayerFooter navigation={this.props.navigation} />)}>
      </ContainerView>
    );
  }

  _renderCoverContent() {
    let artist = this.props.artist ? this.props.artist.artist : null;
    let albums = this.props.artist ? this.props.artist.albums : [];
    let songs = albums ? [].concat.apply([], albums.map(a => a.songs)) : [];

    return (
      <View>
        <Text style={styles.coverContentTitle}>{artist}</Text>
        <Text style={styles.coverContentText}>{albums.length + ' albums'}</Text>
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

  _renderTargetMenu() {
    if (!this.props.showMenu)
      return null;

    switch (this.props.targetMenu.type.toLowerCase()) {
      case 'song':
      case 'album':
        return <SongMenu onPress={() => this.props.setMenu({ type: this.props.targetMenu.type })} positionX={this.props.menuPositionX} positionY={this.props.menuPositionY} />;

      default:
        return <HeaderMenu onPress={() => this.props.setMenu({ type: this.props.targetMenu.type })} positionX={this.props.menuPositionX} positionY={this.props.menuPositionY} />;
    }
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
        renderItem: items => (<ThreeColumnContainer items={items.item} renderItem={this._renderAlbum} />),
        title: 'ALBUMS'
      },
    ];
  }

  _groupItems(items) {
    let grupedItems = [];

    for (let i = 0; i < items.length; i += 3) {
      grupedItems.push(items.slice(i, 3 + i));
    }

    return grupedItems;
  }

  _playSongs(initialSong) {
    let albums = this.props.artist ? this.props.artist.albums.map(a => a.songs) : [];
    let queue = albums ? [].concat.apply([], albums) : [];

    this.props.navigation.navigate('Player', { queue, initialSong });
  }
}

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

Artist.propTypes = {
  artist: PropTypes.object,
  targetMenu: PropTypes.object,
  isFavorite: PropTypes.bool,
  showMenu: PropTypes.bool,
  menuPositionX: PropTypes.number,
  menuPositionY: PropTypes.number,
  load: PropTypes.func,
  setMenu: PropTypes.func,
  like: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(Artist);