import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import EStyleSheet from 'react-native-extended-stylesheet';

import * as genreActions from '../redux/actions/genreActions';
import * as appActions from '../redux/actions/appActions';
import * as favoritesActions from '../redux/actions/favoritesActions';

import {
  View,
  Text
} from 'react-native';
import ContainerView from '../components/ContainerView';
import SongCard from '../components/SongCard';
import AlbumCard from '../components/AlbumCard';
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

class Genre extends Component {
  constructor(props) {
    super(props);

    this._renderSong = this._renderSong.bind(this);
    this._renderCoverContent = this._renderCoverContent.bind(this);
    this._renderAlbum = this._renderAlbum.bind(this);
    this._renderItem = this._renderItem.bind(this);
    this._renderMenu = this._renderMenu.bind(this);
    this._getSections = this._getSections.bind(this);
    this._playSongs = this._playSongs.bind(this);
    this._groupItems = this._groupItems.bind(this);
  }

  componentDidMount() {
    const { genre } = this.props.navigation.state.params;
    this.props.load(genre);
  }

  render() {
    return (
      <ContainerView
        title={''}
        onBackPress={() => this.props.navigation.goBack()}
        onSearchPress={() => this.props.navigation.navigate('Search', {})}
        onLikePress={() => this.props.like(this.props.genre)}
        onPlayPress={() => this._playSongs()}
        coverContent={this._renderCoverContent()}
        sections={this._getSections()}
        source={require('../images/music.png')}
        showMenu={this.props.showMenu}
        menuContent={this._renderMenu()}
        menuPositionX={this.props.menuPositionX}
        menuPositionY={this.props.menuPositionY}
        like={this.props.isFavorite}
        footer={(<PlayerFooter navigation={this.props.navigation} />)}>
      </ContainerView>
    );
  }

  _renderCoverContent() {
    let genre = this.props.genre ? this.props.genre.genre : null;
    let albums = this.props.genre ? this.props.genre.albums : [];
    let songs = albums ? [].concat.apply([], albums.map(a => a.songs)) : [];

    return (
      <View>
        <Text style={styles.coverContentTitle}>{genre}</Text>
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
        name={song.item.name}
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
        onPress={() => this.props.navigation.navigate('Album', album)}
        id={album.id}
        name={album.album}
        artist={album.artist}
        songs={album.songs.length}
        source={require('../images/music.png')}
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

  _renderMenu() {
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

  _groupItems(items) {
    let grupedItems = [];

    for (let i = 0; i < items.length; i += 3) {
      grupedItems.push(items.slice(i, 3 + i));
    }

    return grupedItems;
  }

  _getSections() {
    let albums = this.props.genre ? this.props.genre.albums : []
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

  _playSongs(initialSong) {
    let albums = this.props.genre ? this.props.genre.albums.map(a => a.songs) : [];
    let queue = albums ? [].concat.apply([], albums) : [];

    this.props.navigation.navigate('Player', { queue, initialSong });
  }
}

const mapStateToProps = state => {
  return {
    genre: state.genre.genre,
    isFavorite: state.genre.isFavorite,
    showMenu: state.app.showMenu,
    targetMenu: state.app.targetMenu,
    menuPositionX: state.app.menuPositionX,
    menuPositionY: state.app.menuPositionY,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    load: (artist) => genreActions.load(artist)(dispatch),
    setMenu: (target, positionX, positionY) => dispatch(appActions.setMenu(target, positionX, positionY)),
    like: (genre) => dispatch(favoritesActions.like('genre', genre)),
  }
}

Genre.propTypes = {
  genre: PropTypes.object,
  targetMenu: PropTypes.object,
  isFavorite: PropTypes.bool,
  showMenu: PropTypes.bool,
  menuPositionX: PropTypes.number,
  menuPositionY: PropTypes.number,
  load: PropTypes.func,
  setMenu: PropTypes.func,
  like: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(Genre);