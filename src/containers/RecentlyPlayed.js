import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';

import * as recentlyPlayedActions from '../redux/actions/recentlyPlayedActions';

import {
  FlatList,
  View,
  BackHandler
} from 'react-native';
import Container from '../components/common/containers/Container';
import RecentlyPlayedHeader from '../components/recentlyPlayed/RecentlyPlayedHeader';
import RecentlyPlayedDeleteMode from '../components/recentlyPlayed/RecentlyPlayedDeleteMode';
import Body from '../components/Body';
import SongCard from '../components/SongCard';
import PlayerFooter from './PlayerFooter';
import ModalForm from '../components/common/forms/ModalForm';
import ModalFormTouchable from '../components/common/buttons/ModalFormTouchable';

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '$appBackgroundColor',
    width: '$appWidth'
  }
});

class RecentlyPlayed extends Component {
  constructor(props) {
    super(props);

    this._renderViewMode = this._renderViewMode.bind(this);
    this._renderDeleteMode = this._renderDeleteMode.bind(this);
    this._renderSong = this._renderSong.bind(this);
    this._renderMenu = this._renderMenu.bind(this);
    this._playSongs = this._playSongs.bind(this);
    this._addToPlaylist = this._addToPlaylist.bind(this);
    this._addToQueue = this._addToQueue.bind(this);
    this._removeSong = this._removeSong.bind(this);
    this._backHandler = this._backHandler.bind(this);
  }

  componentWillMount() {
    this.props.load();
    BackHandler.addEventListener('hardwareBackPress', this._backHandler);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this._backHandler);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.songs !== this.props.songs
      || nextProps.showMenu !== this.props.showMenu
      || nextProps.playing !== this.props.playing
      || nextProps.songsDelete !== this.props.songsDelete
      || nextProps.deleteMode !== this.props.deleteMode
      || nextProps.selectedAll !== this.props.selectedAll
      || nextProps.selected !== this.props.selected
      || nextProps.showConfirmation !== this.props.showConfirmation;
  }

  render() {
    if (this.props.deleteMode) {
      return this._renderDeleteMode();
    }

    return this._renderViewMode();
  }

  _renderViewMode() {
    return (
      <Container fillStatusBar={false}>
        <RecentlyPlayedHeader
          title={this.props.dictionary.getWord('recently')}
          onBackPress={() => this.props.navigation.goBack()}
          onSettingsPress={() => this.props.navigation.navigate('RecentlyPlayedSettings')}
          onDeletePress={() => this.props.setDeleteModeOn()} />
        <Body>
          <FlatList
            extraData={this.props.songs.map(s => s)}
            data={this.props.songs}
            showsVerticalScrollIndicator={false}
            renderItem={this._renderSong}
            keyExtractor={(item, index) => item.id}
            style={styles.container} />
        </Body>
        {this._renderMenu()}
        <PlayerFooter navigation={this.props.navigation} />
      </Container>
    );
  }

  _renderDeleteMode() {
    return (
      <RecentlyPlayedDeleteMode
        data={this.props.songsDelete}
        selected={this.props.selected}
        selectedAll={this.props.selectedAll}
        showConfirmation={this.props.showConfirmation}
        dictionary={this.props.dictionary}
        onBackPress={this.props.setDeleteModeOff}
        onSelectAllPress={this.props.onSelectAllPress}
        onDeletePress={this.props.showDeleteSongsConfirmation}
        onSelecteSong={(song) => this.props.selectSong(song.id)}
        onCancelPress={this.props.deleteSelectedSongsCancel}
        onConfirmPress={() => this.props.deleteSelectedSongs(this.props.songsDelete)} />
    );
  }

  _renderSong(song) {
    let targetMenu = {
      type: 'SONG',
      payload: song.item
    };

    let isPlaying = this.props.playing && this.props.currentSong.id === song.item.id;

    return (
      <SongCard
        id={song.item.id}
        name={song.item.title}
        artist={song.item.artist}
        isFavorite={song.item.isFavorite}
        isPlaying={isPlaying}
        onOptionPress={() => this.props.setMenu(targetMenu)}
        onPlayPress={() => this._playSongs([song.item])}
        onLikePress={() => this.props.like('song', song.item)} />
    );
  }

  _renderMenu() {
    if (!this.props.showMenu || (!this.props.targetMenu ? undefined : this.props.targetMenu.caller) !== 'RECENTLY_PLAYED')
      return null;

    return (
      <ModalForm
        title={this.props.targetMenu.payload.title}
        onCancelPress={() => this.props.setMenu()}>
        <ModalFormTouchable
          text={this.props.dictionary.getWord('remove')}
          onPress={() => this._removeSong(this.props.targetMenu.payload)} />
        <ModalFormTouchable
          text={this.props.dictionary.getWord('add_to_playlist')}
          onPress={() => this._addToPlaylist(this.props.targetMenu.payload)} />
        <ModalFormTouchable
          text={this.props.dictionary.getWord('add_to_queue')}
          onPress={() => this._addToQueue([this.props.targetMenu.payload])} />
        <ModalFormTouchable
          text={this.props.dictionary.getWord('file_detail')}
          onPress={() => { }} />
      </ModalForm>
    );
  }

  _playSongs(songs) {

  }

  _addToPlaylist(song) {
    this.props.setMenu(null);
    this.props.navigation.navigate('PlaylistSelector', { song });
  }

  _addToQueue(songs) {
    this.props.setMenu(null);
    this.props.addToQueue(songs);
  }

  _removeSong(song) {
    this.props.setMenu(null);
    this.props.removeSong(song);
  }

  _backHandler() {
    if (this.props.deleteMode) {
      this.props.setDeleteModeOff();
      return true;
    }

    return false;
  }
}

const mapStateToProps = state => {
  return {
    dictionary: state.app.dictionary,
    songs: state.recentlyPlayed.songs,
    songsDelete: state.recentlyPlayed.songsDelete,
    deleteMode: state.recentlyPlayed.deleteMode,
    selectedAll: state.recentlyPlayed.selectedAll,
    selected: state.recentlyPlayed.selected,
    showConfirmation: state.recentlyPlayed.showConfirmation,
    showMenu: state.app.showMenu,
    targetMenu: state.app.targetMenu,
    playing: state.player.playing,
    currentSong: state.player.currentSong
  }
}

const mapDispatchToProps = dispatch => {
  return {
    load: () => recentlyPlayedActions.load()(dispatch),
    setMenu: (target) => recentlyPlayedActions.setMenu(target)(dispatch),
    like: (type, song) => recentlyPlayedActions.like(type, song)(dispatch),
    addToQueue: (queue) => recentlyPlayedActions.addToQueue(queue)(dispatch),
    removeSong: (song) => recentlyPlayedActions.removeSong(song)(dispatch),
    setDeleteModeOn: () => recentlyPlayedActions.setDeleteModeOn()(dispatch),
    setDeleteModeOff: () => recentlyPlayedActions.setDeleteModeOff()(dispatch),
    selectSong: (songId) => recentlyPlayedActions.selectSong(songId)(dispatch),
    onSelectAllPress: () => recentlyPlayedActions.onSelectAllPress()(dispatch),
    showDeleteSongsConfirmation: () => recentlyPlayedActions.showDeleteSongsConfirmation()(dispatch),
    deleteSelectedSongsCancel: () => recentlyPlayedActions.deleteSelectedSongsCancel()(dispatch),
    deleteSelectedSongs: (songs) => recentlyPlayedActions.deleteSelectedSongs(songs)(dispatch)
  }
}

RecentlyPlayed.propTypes = {
  dictionary: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
  songs: PropTypes.array.isRequired,
  songsDelete: PropTypes.array.isRequired,
  deleteMode: PropTypes.bool.isRequired,
  showConfirmation: PropTypes.bool.isRequired,
  showMenu: PropTypes.bool.isRequired,
  targetMenu: PropTypes.object,
  playing: PropTypes.bool.isRequired,
  currentSong: PropTypes.object,
  selectedAll: PropTypes.bool.isRequired,
  selected: PropTypes.number.isRequired,
  load: PropTypes.func.isRequired,
  setMenu: PropTypes.func.isRequired,
  like: PropTypes.func.isRequired,
  addToQueue: PropTypes.func.isRequired,
  removeSong: PropTypes.func.isRequired,
  setDeleteModeOn: PropTypes.func.isRequired,
  setDeleteModeOff: PropTypes.func.isRequired,
  selectSong: PropTypes.func.isRequired,
  onSelectAllPress: PropTypes.func.isRequired,
  showDeleteSongsConfirmation: PropTypes.func.isRequired,
  deleteSelectedSongsCancel: PropTypes.func.isRequired,
  deleteSelectedSongs: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(RecentlyPlayed);