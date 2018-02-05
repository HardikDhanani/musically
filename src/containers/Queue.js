import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import EStyleSheet from 'react-native-extended-stylesheet';
import SortableListView from 'react-native-sortable-listview';

import * as queueActions from '../redux/actions/queueActions';

import {
  BackHandler,
  TouchableOpacity
} from 'react-native';
import Container from '../components/Container';
import QueueHeader from '../components/queue/QueueHeader';
import DeleteModeQueue from '../components/queue/DeleteModeQueue';
import Body from '../components/Body';
import SongCard from '../components/SongCard';
import PlayerFooter from './PlayerFooter';
import ModalForm from '../components/common/forms/ModalForm';
import ModalFormTouchable from '../components/common/buttons/ModalFormTouchable';
import Text from '../components/common/Text';
import BodyActivityIndicator from '../components/common/BodyActivityIndicator';

const styles = EStyleSheet.create({
  listContainer: {
    width: '$appWidth'
  },
  deleteSongContainer: {
    flexDirection: 'row',
    width: '$appWidth',
    height: '$headerHeight',
    backgroundColor: '$headerBackgroundColor',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10
  },
  durationContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '$headerHeight * 0.7',
    width: '$headerHeight * 0.7'
  },
  button: {
    color: '$headerColor',
    backgroundColor: 'transparent',
    fontSize: '$headerIconSize',
  },
  icon: {
    color: '$elementActive',
    backgroundColor: 'transparent',
    fontSize: '$headerIconSize'
  },
  deleteFormContainer: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    alignItems: 'center'
  }
});

class SorteableItem extends Component {
  render() {
    return (
      <SongCard
        {...this.props.sortHandlers}
        styles={{ container: styles.item, text: styles.itemText }}
        id={this.props.song.id}
        name={this.props.song.title}
        artist={this.props.song.artist}
        duration={this.props.song.duration}
        isFavorite={this.props.song.isFavorite}
        isPlaying={this.props.isPlaying}
        onOptionPress={this.props.onOptionPress}
        onPlayPress={this.props.onPlayPress}
        onLikePress={this.props.onLikePress} />
    );
  }
}

class Queue extends Component {
  constructor(props) {
    super(props);

    this._renderDeleteMode = this._renderDeleteMode.bind(this);
    this._renderViewMode = this._renderViewMode.bind(this);
    this._renderSong = this._renderSong.bind(this);
    this._renderMenu = this._renderMenu.bind(this);
    this._removeFromQueue = this._removeFromQueue.bind(this);
    this._navigateTo = this._navigateTo.bind(this);
    this._renderList = this._renderList.bind(this);
    this._backHandler = this._backHandler.bind(this);
    this._addToPlaylist = this._addToPlaylist.bind(this);
    this._playSong = this._playSong.bind(this);
  }

  componentWillMount() {
    this.props.load();
    BackHandler.addEventListener('hardwareBackPress', this._backHandler);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this._backHandler);
  }

  render() {
    if (this.props.deleteMode) {
      return this._renderDeleteMode();
    }

    return this._renderViewMode();
  }

  _renderDeleteMode() {
    return (
      <DeleteModeQueue
        data={this.props.queueDelete}
        selected={this.props.selected}
        selectedAll={this.props.selectedAll}
        showConfirmation={this.props.showConfirmation}
        dictionary={this.props.dictionary}
        onBackPress={this.props.setDeleteModeOff}
        onSelectAllPress={this.props.onSelectAllPress}
        onDeletePress={this.props.showDeleteSongsConfirmation}
        onSelecteSong={(song) => this.props.selectSong(song.id)}
        onCancelPress={this.props.deleteSelectedSongsCancel}
        onConfirmPress={() => this.props.deleteSelectedSongs(this.props.queueDelete)} />
    );
  }

  _renderViewMode() {
    return (
      <Container fillStatusBar={false}>
        <QueueHeader
          title={this.props.dictionary.getWord('queue')}
          onBackPress={() => this.props.navigation.goBack()}
          onDeletePress={() => this.props.setDeleteModeOn()} />
        <Body>
          {
            this.props.isLoading ?
              <BodyActivityIndicator /> :
              this._renderList()
          }
        </Body>
        {this._renderMenu()}
        <PlayerFooter navigation={this.props.navigation} />
      </Container>
    );
  }

  _renderList() {
    if (this.props.deleteMode) {
      return null;
    }

    return (
      <SortableListView
        style={styles.listContainer}
        data={this.props.queue}
        onRowMoved={e => {
          this.props.moveSong(e.row.data.id, e.from, e.to);
        }}
        renderRow={this._renderSong}
        activeOpacity={0.5}
        disableAnimatedScrolling={false} />
    );
  }

  _renderSong(song) {
    let isPlaying = this.props.playing && this.props.currentSong.id === song.id;

    let targetMenu = {
      type: 'SONG',
      payload: song
    };

    return (
      <SorteableItem
        song={song}
        targetMenu={targetMenu}
        isPlaying={isPlaying}
        onOptionPress={() => this.props.setMenu(targetMenu)}
        onPlayPress={() => this._playSong(song)}
        onLikePress={() => this.props.like('song', song)} />
    );
  }

  _renderMenu() {
    if (!this.props.showMenu || (!this.props.targetMenu ? undefined : this.props.targetMenu.caller) !== 'QUEUE')
      return null;

    return (
      <ModalForm
        title={this.props.targetMenu.payload.title}
        onCancelPress={() => this.props.setMenu()}>
        <ModalFormTouchable
          text={this.props.dictionary.getWord('add_to_playlist')}
          onPress={() => this._addToPlaylist(this.props.targetMenu.payload)} />
        <ModalFormTouchable
          text={this.props.dictionary.getWord('remove_from_queue')}
          onPress={() => this._removeFromQueue(this.props.targetMenu.payload)} />
        <ModalFormTouchable
          text={this.props.dictionary.getWord('file_detail')}
          onPress={() => { }} />
      </ModalForm>
    );
  }

  _navigateTo(route, params) {
    this.props.setMenu(null);
    this.props.navigation.navigate(route, params);
  }

  _removeFromQueue(song) {
    this.props.setMenu(null);
    this.props.removeFromQueue(song);
  }

  _addToPlaylist(song) {
    this.props.setMenu(null);
    this.props.navigation.navigate('PlaylistSelector', { song })
  }

  _playSong(song) {
    this.props.setMenu(null);
    this.props.playSong(song);
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
    queue: state.queue.queue,
    queueDelete: state.queue.queueDelete,
    deleteMode: state.queue.deleteMode,
    selectedAll: state.queue.selectedAll,
    selected: state.queue.selected,
    isLoading: state.queue.isLoading,
    showConfirmation: state.queue.showConfirmation,
    showMenu: state.app.showMenu,
    targetMenu: state.app.targetMenu,
    playing: state.player.playing,
    currentSong: state.player.currentSong
  }
}

const mapDispatchToProps = dispatch => {
  return {
    load: () => dispatch(queueActions.load()),
    removeFromQueue: song => queueActions.removeFromQueue(song)(dispatch),
    setMenu: (target) => queueActions.setMenu(target)(dispatch),
    moveSong: (songId, from, to) => queueActions.moveSong(songId, from, to)(dispatch),
    selectSong: (songId) => dispatch(queueActions.selectSong(songId)),
    setDeleteModeOn: () => dispatch(queueActions.setDeleteModeOn()),
    setDeleteModeOff: () => dispatch(queueActions.setDeleteModeOff()),
    onSelectAllPress: () => dispatch(queueActions.onSelectAllPress()),
    showDeleteSongsConfirmation: () => dispatch(queueActions.showDeleteSongsConfirmation()),
    deleteSelectedSongsCancel: () => dispatch(queueActions.deleteSelectedSongsCancel()),
    deleteSelectedSongs: (queue) => queueActions.deleteSelectedSongs(queue)(dispatch),
    playSong: (song) => queueActions.playSong(song)(dispatch),
    like: (type, item) => queueActions.like(type, item)(dispatch)
  }
}

Queue.propTypes = {
  dictionary: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
  queue: PropTypes.array.isRequired,
  queueDelete: PropTypes.array.isRequired,
  deleteMode: PropTypes.bool.isRequired,
  selectedAll: PropTypes.bool.isRequired,
  selected: PropTypes.number.isRequired,
  isLoading: PropTypes.bool.isRequired,
  showConfirmation: PropTypes.bool.isRequired,
  showMenu: PropTypes.bool.isRequired,
  targetMenu: PropTypes.object,
  load: PropTypes.func.isRequired,
  removeFromQueue: PropTypes.func.isRequired,
  setMenu: PropTypes.func.isRequired,
  moveSong: PropTypes.func.isRequired,
  selectSong: PropTypes.func.isRequired,
  setDeleteModeOn: PropTypes.func.isRequired,
  setDeleteModeOff: PropTypes.func.isRequired,
  onSelectAllPress: PropTypes.func.isRequired,
  showDeleteSongsConfirmation: PropTypes.func.isRequired,
  deleteSelectedSongsCancel: PropTypes.func.isRequired,
  deleteSelectedSongs: PropTypes.func.isRequired,
  playSong: PropTypes.func.isRequired,
  like: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Queue);