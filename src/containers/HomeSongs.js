import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import EStyleSheet from 'react-native-extended-stylesheet';

import * as appActions from '../redux/actions/appActions';
import * as playerActions from '../redux/actions/playerActions';
import * as homeActions from '../redux/actions/homeActions';
import * as favoritesActions from '../redux/actions/favoritesActions';
import playlists from '../redux/selectors/playlists';

import {
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
import BodyActivityIndicator from '../components/common/BodyActivityIndicator';

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '$appBackgroundColor',
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
  }

  render() {
    return (
      <Body hasPaginationHeader={true}>
        {
          !this.props.isReady ?
            <BodyActivityIndicator /> :
            <FlatList
              data={this.props.songs}
              renderItem={this._renderSong}
              keyExtractor={(item, index) => index}
              initialNumToRender={10}
              style={styles.container} />
        }
        {this._renderMenu()}
      </Body>
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
        key={song.index}
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
    if (!this.props.showMenu || (!this.props.targetMenu ? undefined : this.props.targetMenu.caller) !== 'HOME_SONG')
      return null;

    return (
      <ModalForm
        title={this.props.targetMenu.payload.title}
        onCancelPress={() => this.props.setMenu()}>
        <ModalFormTouchable
          text={this.props.dictionary.getWord('add_to_playlist')}
          onPress={() => this._addToPlaylist(this.props.targetMenu.payload)} />
        <ModalFormTouchable
          text={this.props.dictionary.getWord('add_to_queue')}
          onPress={() => this._addToQueue([this.props.targetMenu.payload])} />
        <ModalFormTouchable
          text={'File detail'}
          onPress={() => { }} />
      </ModalForm>
    );
  }

  _addToQueue(songs) {
    this.props.setMenu(null);
    this.props.addToQueue(songs);
  }

  _addToPlaylist(song) {
    this.props.setMenu(null);
    this.props.navigation.navigate('PlaylistSelector', { song })
  }
}

const mapStateToProps = state => {
  return {
    songs: state.app.songs,
    showMenu: state.app.showMenu,
    targetMenu: state.app.targetMenu,
    isReady: state.app.homeSongsReady,
    currentSong: state.player.currentSong,
    playing: state.player.playing,
    dictionary: state.app.dictionary
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setMenu: (target) => dispatch(appActions.setMenu({ ...target, caller: 'HOME_SONG' })),
    addToQueue: (queue) => playerActions.addToQueue(queue)(dispatch),
    like: (type, album) => dispatch(favoritesActions.like(type, album)),
  }
}

HomeSongs.propTypes = {
  isReady: PropTypes.bool.isRequired,
  songs: PropTypes.array.isRequired,
  dictionary: PropTypes.any.isRequired,
  navigation: PropTypes.any.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeSongs);