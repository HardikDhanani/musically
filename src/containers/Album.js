import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import EStyleSheet from 'react-native-extended-stylesheet';

import * as albumActions from '../redux/actions/albumActions';
import * as appActions from '../redux/actions/appActions';
import * as favoritesActions from '../redux/actions/favoritesActions';

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
        onMenuPress={() => this.props.setMenu({ type: 'MENU' })}
        onPlayPress={() => this._playSongs()}
        coverContent={this._renderCoverContent()}
        sections={this._getSections()}
        source={require('../images/music.png')}
        imageUri={this.props.album ? this.props.album.cover : null}
        showMenu={this.props.showMenu}
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
    if (!this.props.showMenu)
      return null;

    switch (this.props.targetMenu.type) {
      case 'SONG':
        return <SongMenu onPress={() => this.props.setMenu({ type: 'MENU' })} positionX={this.props.menuPositionX} positionY={this.props.menuPositionY} />;

      default:
        return <HeaderMenu onPress={() => this.props.setMenu({ type: 'MENU' })} positionX={this.props.menuPositionX} positionY={this.props.menuPositionY} />;
    }
  }

  _getSections() {
    return [{
      data: this.props.album ? this.props.album.songs : [],
      renderItem: this._renderSong,
      title: 'TRACKS'
    }];
  }

  _playSongs(initialSong) {
    let queue = this.props.album ? this.props.album.songs : [];

    this.props.navigation.navigate('Player', { queue, initialSong });
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
    setMenu: (target, positionX, positionY) => dispatch(appActions.setMenu(target, positionX, positionY)),
    like: (album) => dispatch(favoritesActions.like('album', album)),
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