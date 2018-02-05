import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';
import Icon from 'react-native-vector-icons/MaterialIcons';

import * as playlistSelectorActions from '../redux/actions/playlistSelectorActions';

import {
  View,
  FlatList
} from 'react-native';
import Container from '../components/Container';
import Text from '../components/common/Text';
import ModalForm from '../components/common/forms/ModalForm';
import ModalFormWithActionContainer from '../components/common/containers/ModalFormWithActionContainer';
import Touchable from '../components/common/buttons/Touchable';
import NewPlaylist from '../components/NewPlaylist';

const styles = EStyleSheet.create({
  contentContainer: {
    flex: 1
  },
  contentHeight: {
    height: '$modalFormHeight'
  },
  gradientContainer: {
    height: '$statusBarHeight',
    width: '$appWidth',
    backgroundColor: '$headerStartGradientBackgroundColor'
  },
  playlistContainer: {
    flexDirection: 'column',
    width: '$modalFormWidth',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8
  },
  playlist: {
    color: '$textMainColor',
    fontSize: '$textFontSize'
  },
  playlistDetail: {
    color: '$elementInactive',
    fontSize: '$detailFontSize',
    paddingLeft: 5
  },
  addNewContainer: {
    flexDirection: 'column',
    width: '$modalFormWidth',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8
  },
  addNew: {
    color: '$appMainColor',
    fontSize: '$textFontSize'
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

class PlaylistSelector extends Component {
  constructor(props) {
    super(props);

    this._renderPlaylist = this._renderPlaylist.bind(this);
    this._renderPlaylistSelector = this._renderPlaylistSelector.bind(this);
    this._renderAddNewPlaylistForm = this._renderAddNewPlaylistForm.bind(this);
    this._renderConfirmationSuccessMessage = this._renderConfirmationSuccessMessage.bind(this);
    this._onPlayistSelected = this._onPlayistSelected.bind(this);
  }

  componentWillMount() {
    const { song, exclude } = this.props.navigation.state.params;
    this.props.load(song, exclude);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.closeForm) {
      this.props.formClosed();
      this.props.navigation.goBack();
    }
  }

  render() {
    return (
      <Container fillStatusBar={false}>
        <View style={styles.gradientContainer} />
        {this._renderPlaylistSelector()}
        {this._renderAddNewPlaylistForm()}
        {this._renderConfirmationSuccessMessage()}
      </Container>
    );
  }

  _renderPlaylist(playlist) {
    let fontWeight = playlist.item.selected ? 'bold' : 'normal';
    let color = fontWeight === 'bold' ? styles._addNew.color : undefined;

    return (
      <Touchable onPress={() => this._onPlayistSelected(playlist.item)}>
        <View style={styles.playlistContainer}>
          <Text style={[styles.playlist, { fontWeight, color }]}>{playlist.item.name}</Text>
        </View>
      </Touchable>
    );
  }

  _renderPlaylistSelector() {
    if (this.props.showAddNewPlaylistForm || this.props.showAddToPlaylistConfirmationForm) {
      return null;
    }

    return (
      <ModalFormWithActionContainer
        backgroundTransparent={true}
        style={{ height: styles._contentHeight.height }}
        actionText={this.props.dictionary.getWord('add')}
        title={this.props.dictionary.getWord('choose_playlist')}
        onCancelPress={() => this.props.navigation.goBack()}
        onActionPress={() => this.props.addSongToPlaylistConfirmed(this.props.songToAdd, this.props.selectedPlaylist)}
        actionEnabled={this.props.selectedPlaylist !== null}>
        <FlatList
          style={styles.contentContainer}
          data={this.props.playlists}
          renderItem={this._renderPlaylist}
          keyExtractor={(item, index) => index} />
        <Touchable onPress={() => this.props.addNewPlaylist()}>
          <View style={styles.addNewContainer}>
            <Text style={styles.addNew}>{this.props.dictionary.getWord('add_new_playlist')}</Text>
          </View>
        </Touchable>
      </ModalFormWithActionContainer>
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
        onPlaylistCreated={playlistName => this.props.createNewPlaylistAndAddSong(playlistName, this.props.songToAdd)}
        onCancelPress={() => this.props.cancelAddNewPlaylistForm()}
        defaultValue={this.props.dictionary.getWord('my_playlist')} />
    );
  }

  _renderConfirmationSuccessMessage() {
    if (!this.props.showAddToPlaylistConfirmationForm) {
      return null;
    }

    return (
      <ModalForm
        backgroundTransparent={true}
        style={styles.confirmationContainer}
        onCancelPress={() => { }}>
        <View style={styles.checkContainer}>
          <Icon name='check' color={styles._check.color} backgroundColor={'transparent'} size={styles._check.fontSize} />
        </View>
        <Text style={styles.textBold}>{this.props.songToAdd.title}</Text>
        <Text style={styles.text}>{'has been added to'}</Text>
        <Text style={styles.textBold}>{this.props.playlistModified.name}</Text>
      </ModalForm>
    );
  }

  _onPlayistSelected(playlist) {
    this.props.selectPlaylist(playlist);
  }
}

const mapStateToProps = state => {
  return {
    dictionary: state.app.dictionary,
    playlists: state.playlistSelector.playlists,
    songToAdd: state.playlistSelector.songToAdd,
    selectedPlaylist: state.playlistSelector.selectedPlaylist,
    showAddToPlaylistConfirmationForm: state.playlistSelector.showAddToPlaylistConfirmationForm,
    playlistModified: state.playlistSelector.playlistModified,
    showAddNewPlaylistForm: state.playlistSelector.showAddNewPlaylistForm,
    closeForm: state.playlistSelector.closeForm
  }
}

const mapDispatchToProps = dispatch => {
  return {
    load: (song, exclude) => playlistSelectorActions.load(song, exclude)(dispatch),
    addNewPlaylist: () => dispatch(playlistSelectorActions.addNewPlaylist()),
    selectPlaylist: (playlist) => dispatch(playlistSelectorActions.selectPlaylist(playlist)),
    formClosed: () => dispatch(playlistSelectorActions.formClosed()),
    addSongToPlaylistConfirmed: (song, playlist) => playlistSelectorActions.addSongToPlaylistConfirmed(song, playlist)(dispatch),
    createNewPlaylistAndAddSong: (playlistName, song) => playlistSelectorActions.createNewPlaylistAndAddSong(playlistName, song)(dispatch),
    cancelAddNewPlaylistForm: () => dispatch(playlistSelectorActions.cancelAddNewPlaylistForm()),
  }
}

PlaylistSelector.propTypes = {
  playlists: PropTypes.array.isRequired,
  addNewPlaylist: PropTypes.func.isRequired,
  closeForm: PropTypes.bool.isRequired,
  load: PropTypes.func.isRequired,
  formClosed: PropTypes.func.isRequired,
  addSongToPlaylistConfirmed: PropTypes.func.isRequired,
  addNewPlaylist: PropTypes.func.isRequired,
  createNewPlaylistAndAddSong: PropTypes.func.isRequired,
  cancelAddNewPlaylistForm: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(PlaylistSelector);