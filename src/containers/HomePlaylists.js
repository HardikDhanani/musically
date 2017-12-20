import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import EStyleSheet from 'react-native-extended-stylesheet';

import * as appActions from '../redux/actions/appActions';
import * as playerActions from '../redux/actions/playerActions';
import * as homeActions from '../redux/actions/homeActions';

import {
  ActivityIndicator,
  FlatList,
  View,
  Text
} from 'react-native';
import Body from '../components/Body';
import PlaylistCard from '../components/PlaylistCard';
import PlaylistMenu from '../components/PlaylistMenu';
import AddPlaylistButton from '../components/common/buttons/AddPlaylistButton';
import ConfirmationForm from '../components/ConfirmationForm';
import NewPlaylist from '../components/NewPlaylist';

const styles = EStyleSheet.create({
  addButton: {
    position: 'absolute',
    right: 25
  }
});

class HomePlaylists extends Component {
  constructor(props) {
    super(props);

    this._renderPlaylist = this._renderPlaylist.bind(this);
    this._renderMenu = this._renderMenu.bind(this);
    this._getPlaylistMenu = this._getPlaylistMenu.bind(this);
    this._playSongs = this._playSongs.bind(this);
    this._addToQueue = this._addToQueue.bind(this);
    this._showNewPlaylistForm = this._showNewPlaylistForm.bind(this);
    this._showDeletePlaylistConfirmation = this._showDeletePlaylistConfirmation.bind(this);
  }

  render() {
    return (
      <View>
        <Body hasPaginationHeader={true}>
          {
            !this.props.isReady ?
              <ActivityIndicator animating={true} size='large' /> :
              <FlatList data={this.props.playlists} renderItem={this._renderPlaylist} keyExtractor={(item, index) => item.id} />
          }
        </Body>
        <AddPlaylistButton hide={this.props.selectedSection !== 'playlists'} bottom={100} style={styles.addButton} onPress={this.props.createNewPlaylistForm} />
        {this._renderMenu()}
        {this._showNewPlaylistForm()}
        {this._showDeletePlaylistConfirmation()}
      </View>
    );
  }

  _renderPlaylist(playlist) {
    let targetMenu = {
      type: 'PLAYLIST',
      payload: playlist.item
    };

    let name = playlist.item.name;
    switch (name.toLowerCase()) {
      case 'most played':
        name = this.props.dictionary.getWord('mostPlayed');
        break;
      case 'favorites':
        name = this.props.dictionary.getWord('favorites');
        break;
      case 'recently played':
        name = this.props.dictionary.getWord('recentlyPlayed');
        break;
      default:
        break;
    }

    return (
      <PlaylistCard
        styles={{ container: { backgroundColor: '#f1f1f1' }, text: { color: 'gray' } }}
        key={playlist.index}
        id={playlist.item.id}
        name={name}
        songs={playlist.item.songs}
        onOptionPressed={measures => this.props.setMenu(targetMenu, measures.absoluteX, measures.absoluteY)}
        onPress={() => this.props.navigation.navigate('Playlist', { playlistId: playlist.item.id })}
      />
    );
  }

  _renderMenu() {
    if (!this.props.showMenu || (!this.props.targetMenu ? undefined : this.props.targetMenu.caller) !== 'HOME_PLAYLISTS')
      return null;

    switch (this.props.targetMenu.type.toLowerCase()) {
      case 'playlist':
        return this._getPlaylistMenu(this.props.targetMenu.payload);
      default:
        return null;
    }
  }

  _getPlaylistMenu(playlist) {
    let initialSong = playlist.songs[0];
    let queue = playlist.songs;
    let showDelete = !(playlist.name.toLowerCase() === 'favorites' || playlist.name.toLowerCase() === 'most played')

    return (
      <PlaylistMenu
        positionX={this.props.menuPositionX}
        positionY={this.props.menuPositionY}
        showDelete={showDelete}
        onDeletePress={() => {
          this.props.setMenu(null, 0, 0);
          this.props.deletePlaylist(playlist);
        }}
        onPlayPress={() => this._playSongs(queue, true)}
        onAddToQueuePress={() => this._addToQueue(queue)}
        onPress={() => this.props.setMenu(null, 0, 0)} />
    );
  }

  _playSongs(queue, closeMenu = false) {
    if (closeMenu)
      this.props.setMenu(null, 0, 0);

    this.props.navigation.navigate('Player', { queue, reset: true });
  }

  _addToQueue(queue) {
    this.props.setMenu(null, 0, 0);
    this.props.addToQueue(queue);
  }

  _showNewPlaylistForm() {
    if (this.props.showNewPlaylistForm)
      return (
        <NewPlaylist onCancelPress={this.props.closeNewPlaylistForm} onConfirmPress={this.props.newPlaylistConfirmed} />
      );

    return null;
  }

  _showDeletePlaylistConfirmation() {
    if (!this.props.showDeletePlaylistConfirmation)
      return null;

    return (
      <ConfirmationForm
        title={this.props.confirmationTitle}
        onCancelPress={this.props.deletePlaylistCancel}
        onConfirmPress={() => this.props.deletePlaylistConfirm(this.props.playlistToDelete)}>
        <Text style={styles.confirmationText}>{this.props.confirmationDetail}</Text>
      </ConfirmationForm>
    );
  }
}

const mapStateToProps = state => {
  return {
    isReady: state.app.homePlaylistsReady,
    playlists: state.app.playlists,
    showMenu: state.app.showMenu,
    targetMenu: state.app.targetMenu,
    menuPositionX: state.app.menuPositionX,
    menuPositionY: state.app.menuPositionY,
    dictionary: state.app.dictionary,
    selectedSection: state.home.selectedSection,
    showNewPlaylistForm: state.home.showNewPlaylistForm,
    playlistToDelete: state.home.playlistToDelete,
    showDeletePlaylistConfirmation: state.home.showDeletePlaylistConfirmation,
    confirmationTitle: state.home.confirmationTitle,
    confirmationDetail: state.home.confirmationDetail,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setMenu: (target, positionX, positionY) => dispatch(appActions.setMenu({ ...target, caller: 'HOME_PLAYLISTS' }, positionX, positionY)),
    deletePlaylist: (playlist) => dispatch(homeActions.deletePlaylist(playlist)),
    addToQueue: (queue) => playerActions.addToQueue(queue)(dispatch),
    createNewPlaylistForm: () => dispatch(homeActions.createNewPlaylistForm()),
    closeNewPlaylistForm: () => dispatch(homeActions.closeNewPlaylistForm()),
    newPlaylistConfirmed: (playlistName) => homeActions.newPlaylistConfirmed(playlistName)(dispatch),
    deletePlaylistCancel: () => dispatch(homeActions.deletePlaylistCancel()),
    deletePlaylistConfirm: (playlist) => dispatch(homeActions.deletePlaylistConfirm(playlist)),
  }
}

HomePlaylists.propTypes = {
  isReady: PropTypes.bool,
  playlists: PropTypes.array,
  showMenu: PropTypes.bool,
  targetMenu: PropTypes.any,
  navigation: PropTypes.any.isRequired,
  menuPositionX: PropTypes.number,
  menuPositionY: PropTypes.number,
  selectedSection: PropTypes.string,
  showNewPlaylistForm: PropTypes.bool,
  setMenu: PropTypes.func,
  deletePlaylist: PropTypes.func,
  addToQueue: PropTypes.func,
  createNewPlaylistForm: PropTypes.func,
  closeNewPlaylistForm: PropTypes.func,
  newPlaylistConfirmed: PropTypes.func,
  deletePlaylistCancel: PropTypes.func,
  deletePlaylistConfirm: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePlaylists);