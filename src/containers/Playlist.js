import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import EStyleSheet from 'react-native-extended-stylesheet';

import * as playlistActions from '../redux/actions/playlistActions';
import * as appActions from '../redux/actions/appActions';

import {
  View,
  FlatList
} from 'react-native';
import ContainerView from '../components/ContainerView';
import Header from '../components/Header';
import HeaderLeftSection from '../components/HeaderLeftSection';
import HeaderCenterSection from '../components/HeaderCenterSection';
import HeaderRightSection from '../components/HeaderRightSection';
import HeaderTitle from '../components/HeaderTitle';
import Body from '../components/Body';
import IconButton from '../components/common/buttons/IconButton';
import Container from '../components/Container';
import SongCard from '../components/SongCard';
import PlaylistSongMenu from '../components/PlaylistSongMenu';
import PlayPlaylistButton from '../components/common/buttons/PlayPlaylistButton';
import PlayerFooter from './PlayerFooter';

const styles = EStyleSheet.create({
  button: {
    color: '$headerColor',
    backgroundColor: 'transparent',
    fontSize: '$headerIconSize'
  }
});

class Playlist extends Component {
  constructor(props) {
    super(props);

    this._playSongs = this._playSongs.bind(this);
    this._renderSong = this._renderSong.bind(this);
    this._renderMenu = this._renderMenu.bind(this);
  }

  componentDidMount() {
    const { playlistId } = this.props.navigation.state.params;
    this.props.load(playlistId);
  }

  render() {
    var queue = this.props.songs;

    return (
      <Container>
        <Header>
          <HeaderLeftSection>
            <IconButton iconName="arrow-back" onPress={() => this.props.navigation.goBack()} style={styles._button} iconSize={styles._button.fontSize} />
          </HeaderLeftSection>
          <HeaderCenterSection>
            <HeaderTitle>{this.props.name}</HeaderTitle>
          </HeaderCenterSection>
          <HeaderRightSection>
            <IconButton iconName="more-vert" onPress={() => this.props.setMenu({ type: 'MENU' })} style={styles._button} iconSize={styles._button.fontSize} />
          </HeaderRightSection>
        </Header>
        <Body>
          <FlatList initialNumToRender={10} getItemLayout={(data, index) => ({ length: 56, offset: 56 * index, index })} data={this.props.songs} renderItem={this._renderSong} keyExtractor={(item, index) => index} />
        </Body>
        <PlayPlaylistButton style={{ bottom: 80, right: 25 }} onPress={() => this._playSongs(null, queue)} />
        <PlayerFooter navigation={this.props.navigation} />
        {this._renderMenu()}
      </Container>
    );
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
        like={song.item.isFavorite}
        onOptionPressed={measures => this.props.setMenu(targetMenu, measures.absoluteX, measures.absoluteY)}
        onPress={() => this._playSongs(song.item, this.props.songs)}
      />
    );
  }

  _playSongs(initialSong, queue, closeMenu = false) {
    if (closeMenu)
      this.props.setMenu(null, 0, 0);

    this.props.navigation.navigate('Player', { queue, initialSong });
  }

  _renderMenu() {
    if (!this.props.showMenu || this.props.targetMenu.caller !== 'PLAYLIST')
      return null;

    return (
      <PlaylistSongMenu
        positionX={this.props.menuPositionX}
        positionY={this.props.menuPositionY}
        onPlayPress={() => this._playSongs(initialSong, queue, true)}
        onRemoveFromPlaylistPress={() => {
          this.props.setMenu(null, 0, 0);
          this.props.removeSong(this.props.id, this.props.targetMenu.payload.id);
        }}
        onAddToQueuePress={() => {
          this.props.setMenu(null, 0, 0);
          this._addToQueue(queue);
        }}
        onPress={() => this.props.setMenu(null, 0, 0)} />
    );
  }
}

const mapStateToProps = state => {
  return {
    id: state.playlist.id,
    name: state.playlist.name,
    songs: state.playlist.songs,
    showMenu: state.app.showMenu,
    targetMenu: state.app.targetMenu,
    menuPositionX: state.app.menuPositionX,
    menuPositionY: state.app.menuPositionY,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    load: (playlistId) => playlistActions.load(playlistId)(dispatch),
    removeSong: (playlistId, songId) => playlistActions.removeSong(playlistId, songId)(dispatch),
    setMenu: (target, positionX, positionY) => dispatch(appActions.setMenu({ ...target, caller: 'PLAYLIST' }, positionX, positionY)),
  }
}

Playlist.propTypes = {
  id: PropTypes.number,
  name: PropTypes.string,
  songs: PropTypes.array,
  showMenu: PropTypes.bool,
  targetMenu: PropTypes.any,
  menuPositionX: PropTypes.number,
  menuPositionY: PropTypes.number,
  load: PropTypes.func,
  removeSong: PropTypes.func,
  setMenu: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(Playlist);