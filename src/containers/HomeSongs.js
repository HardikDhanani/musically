import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import EStyleSheet from 'react-native-extended-stylesheet';

import * as appActions from '../redux/actions/appActions';
import * as playerActions from '../redux/actions/playerActions';
import * as homeActions from '../redux/actions/homeActions';
import playlists from '../redux/selectors/playlists';

import {
  ActivityIndicator,
  FlatList,
  View
} from 'react-native';
import Body from '../components/Body';
import SongCard from '../components/SongCard';
import ModalForm from '../components/common/forms/ModalForm';
import ModalFormWithAction from '../components/common/forms/ModalFormWithAction';
import ModalFormTouchable from '../components/common/buttons/ModalFormTouchable';
import Touchable from '../components/common/buttons/Touchable';
import Text from '../components/common/Text';
import PlaylistSelector from '../components/PlaylistSelector';
import NewPlaylist from '../components/NewPlaylist';
import Icon from 'react-native-vector-icons/MaterialIcons';

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '$bodyBackgroundColor',
    width: '$appWidth'
  },
  confirmationContainer: {
    alignItems: 'center',
    height: '$modalFormHeight'
  },
  checkContainer: {
    height: '$headerHeight',
    width: '$headerHeight',
    backgroundColor: '$appMainColor',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '$headerHeight',
    marginBottom: 20,
    elevation: 5
  },
  check: {
    color: 'white',
    fontSize: 24
  },
  textBold: {
    fontSize: '$titleFontSize',
    fontWeight: 'bold',
    color: '$textMainColor'
  },
  text: {
    fontSize: '$titleFontSize',
    color: '$textMainColor'
  }
});

class HomeSongs extends Component {
  constructor(props) {
    super(props);

    this._renderSong = this._renderSong.bind(this);
    this._renderMenu = this._renderMenu.bind(this);
    this._addToQueue = this._addToQueue.bind(this);
    this._addToPlaylist = this._addToPlaylist.bind(this);
    this._renderAddToPlaylistForm = this._renderAddToPlaylistForm.bind(this);
    this._renderConfirmationSuccessMessage = this._renderConfirmationSuccessMessage.bind(this);
    this._renderAddNewPlaylistForm = this._renderAddNewPlaylistForm.bind(this);
  }

  render() {
    return (
      <Body hasPaginationHeader={true}>
        {
          !this.props.isReady ?
            <ActivityIndicator animating={true} size='large' /> :
            <FlatList
              data={this.props.songs}
              renderItem={this._renderSong}
              keyExtractor={(item, index) => index}
              initialNumToRender={10}
              style={styles.container} />
        }
        {this._renderMenu()}
        {this._renderAddToPlaylistForm()}
        {this._renderConfirmationSuccessMessage()}
        {this._renderAddNewPlaylistForm()}
      </Body>
    );
  }

  _renderSong(song) {
    let targetMenu = {
      type: 'SONG',
      payload: song.item
    };

    let isPlaying = this.props.playing && this.props.currentSong.is === song.item.id;

    return (
      <SongCard
        key={song.index}
        id={song.item.id}
        name={song.item.title}
        artist={song.item.artist}
        isFavorite={song.item.isFavorite}
        isPlaying={isPlaying}
        onOptionPressed={() => this.props.setMenu(targetMenu)}
        onPlayPress={() => this._playSongs([song.item])} />
    );
  }

  _renderMenu() {
    if (!this.props.showMenu || (!this.props.targetMenu ? undefined : this.props.targetMenu.caller) !== 'HOME_SONG')
      return null;

    return (
      <ModalForm
        onCancelPress={() => this.props.setMenu()}>
        <ModalFormTouchable
          text={this.props.dictionary.getWord('add_to_playlist')}
          onPress={() => this._addToPlaylist(this.props.targetMenu.payload)} />
        <ModalFormTouchable
          text={this.props.dictionary.getWord('add_to_queue')}
          onPress={() => this._addToQueue([this.props.targetMenu.payload])} />
      </ModalForm>
    );
  }

  _renderAddToPlaylistForm() {
    if (!this.props.showAddToPlaylistForm)
      return null;

    return (
      <PlaylistSelector
        title={this.props.dictionary.getWord('choose_playlist')}
        addNewButtonText={this.props.dictionary.getWord('add')}
        addNewText={this.props.dictionary.getWord('add_new_playlist')}
        onAddNewPress={this.props.addNewPlaylist}
        onCancelPress={this.props.cancelAddSongToPlaylist}
        onPlaylistSelected={playlist => this.props.addSongToPlaylistConfirmed(this.props.songToAddToPlaylist, playlist)}
        playlists={this.props.playlists} />
    );
  }

  _renderConfirmationSuccessMessage() {
    if (!this.props.showAddToPlaylistConfirmationForm) {
      return null;
    }

    return (
      <ModalForm
        style={styles.confirmationContainer}
        onCancelPress={() => { }}>
        <View style={styles.checkContainer}>
          <Icon name='check' color={styles._check.color} backgroundColor={'transparent'} size={styles._check.fontSize} />
        </View>
        <Text style={styles.textBold}>{this.props.songToAddToPlaylist.title}</Text>
        <Text style={styles.text}>{'has been added to'}</Text>
        <Text style={styles.textBold}>{this.props.playlistModified.name}</Text>
      </ModalForm>
    );
  }

  _renderAddNewPlaylistForm() {
    if (!this.props.showAddNewPlaylistForm) {
      return null;
    }

    return (
      <NewPlaylist
        backgroundTransparent={true}
        title={this.props.dictionary.getWord('create_playlist')}
        createButtonText={this.props.dictionary.getWord('create').toUpperCase()}
        onPlaylistCreated={this.props.addNewPlaylist}
        onCancelPress={this.props.cancelAddNewPlaylistForm}
        defaultValue={this.props.dictionary.getWord('my_playlist')} />
    );
  }

  _addToQueue(songs) {
    this.props.setMenu(null);
    this.props.addToQueue(songs);
  }

  _addToPlaylist(song) {
    this.props.setMenu(null);
    this.props.addSongToPlaylist(song);
  }
}

const mapStateToProps = state => {
  return {
    songs: state.app.songs,
    playlists: playlists.filterForAddSong(state.app.playlists),
    showMenu: state.app.showMenu,
    targetMenu: state.app.targetMenu,
    isReady: state.app.homeSongsReady,
    currentSong: state.player.currentSong,
    playing: state.player.playing,
    dictionary: state.app.dictionary,
    showAddToPlaylistForm: state.home.showAddToPlaylistForm,
    songToAddToPlaylist: state.home.songToAddToPlaylist,
    selectedPlaylist: state.home.selectedPlaylist,
    showAddToPlaylistConfirmationForm: state.home.showAddToPlaylistConfirmationForm,
    playlistModified: state.home.playlistModified,
    showAddNewPlaylistForm: state.home.showAddNewPlaylistForm
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setMenu: (target) => dispatch(appActions.setMenu({ ...target, caller: 'HOME_SONG' })),
    addToQueue: (queue) => playerActions.addToQueue(queue)(dispatch),
    addSongToPlaylist: (song) => dispatch(homeActions.addSongToPlaylist(song)),
    cancelAddSongToPlaylist: () => dispatch(homeActions.cancelAddSongToPlaylist()),
    addSongToPlaylistConfirmed: (song, playlist) => homeActions.addSongToPlaylistConfirmed(song, playlist)(dispatch),
    addNewPlaylist: () => dispatch(homeActions.addNewPlaylist()),
    cancelAddNewPlaylistForm: () => dispatch(homeActions.cancelAddNewPlaylistForm())
  }
}

HomeSongs.propTypes = {
  isReady: PropTypes.bool.isRequired,
  songs: PropTypes.array.isRequired,
  dictionary: PropTypes.any.isRequired,
  navigation: PropTypes.any.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeSongs);