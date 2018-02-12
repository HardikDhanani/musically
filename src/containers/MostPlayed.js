import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';

import * as mostPlayedActions from '../redux/actions/mostPlayedActions';

import {
  FlatList,
  View,
  BackHandler
} from 'react-native';
import Container from '../components/common/containers/Container';
import MostPlayedHeader from '../components/mostPlayed/MostPlayedHeader';
import MostPlayedDeleteMode from '../components/mostPlayed/MostPlayedDeleteMode';
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

class MostPlayed extends Component {
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
        <MostPlayedHeader
          title={this.props.dictionary.getWord('mostPlayed')}
          onBackPress={() => this.props.navigation.goBack()}
          onSettingsPress={() => this.props.navigation.navigate('MostPlayedSettings')}
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
      <MostPlayedDeleteMode
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
        name={'(' + song.item.reproductions + ') ' + song.item.title}
        artist={song.item.artist}
        isFavorite={song.item.isFavorite}
        isPlaying={isPlaying}
        onOptionPress={() => this.props.setMenu(targetMenu)}
        onPlayPress={() => this._playSongs([song.item])}
        onLikePress={() => this.props.like('song', song.item)}/>
    );
  }

  _renderMenu() {
    if (!this.props.showMenu || (!this.props.targetMenu ? undefined : this.props.targetMenu.caller) !== 'MOST_PLAYED')
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
    songs: state.mostPlayed.songs,
    songsDelete: state.mostPlayed.songsDelete,
    deleteMode: state.mostPlayed.deleteMode,
    selectedAll: state.mostPlayed.selectedAll,
    selected: state.mostPlayed.selected,
    showConfirmation: state.mostPlayed.showConfirmation,
    showMenu: state.app.showMenu,
    targetMenu: state.app.targetMenu,
    playing: state.player.playing,
    currentSong: state.player.currentSong
  }
}

const mapDispatchToProps = dispatch => {
  return {
    load: () => mostPlayedActions.load()(dispatch),
    setMenu: (target) => mostPlayedActions.setMenu(target)(dispatch),
    like: (type, song) => mostPlayedActions.like(type, song)(dispatch),
    addToQueue: (queue) => mostPlayedActions.addToQueue(queue)(dispatch),
    removeSong: (song) => mostPlayedActions.removeSong(song)(dispatch),
    setDeleteModeOn: () => mostPlayedActions.setDeleteModeOn()(dispatch),
    setDeleteModeOff: () => mostPlayedActions.setDeleteModeOff()(dispatch),
    selectSong: (songId) => mostPlayedActions.selectSong(songId)(dispatch),
    onSelectAllPress: () => mostPlayedActions.onSelectAllPress()(dispatch),
    showDeleteSongsConfirmation: () => mostPlayedActions.showDeleteSongsConfirmation()(dispatch),
    deleteSelectedSongsCancel: () => mostPlayedActions.deleteSelectedSongsCancel()(dispatch),
    deleteSelectedSongs: (songs) => mostPlayedActions.deleteSelectedSongs(songs)(dispatch)
  }
}

MostPlayed.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(MostPlayed);