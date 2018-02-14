import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import EStyleSheet from 'react-native-extended-stylesheet';

import * as appActions from '../redux/actions/appActions';
import * as playerActions from '../redux/actions/playerActions';
import * as homeActions from '../redux/actions/homeActions';
import * as favoritesActions from '../redux/actions/favoritesActions';

import {
  FlatList,
  View,
  BackHandler
} from 'react-native';
import Body from '../components/Body';
import SongCard from '../components/SongCard';
import SongCardWithCheck from '../components/SongCardWithCheck';
import ModalForm from '../components/common/forms/ModalForm';
import ModalFormWithAction from '../components/common/forms/ModalFormWithAction';
import ModalFormTouchable from '../components/common/buttons/ModalFormTouchable';
import Touchable from '../components/common/buttons/Touchable';
import Text from '../components/common/Text';
import BodyActivityIndicator from '../components/common/BodyActivityIndicator';
import ShuffleSongsButton from '../components/common/buttons/ShuffleSongsButton';

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
  },
  rowCard: {
    height: '$rowCardHeight * 1.2',
  },
  shuffleButton: {
    position: 'absolute',
    right: -155
  }
});

const FETCH_NUMBER = 60;

class HomeSongs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      songs: [],
      selectedSongs: [],
      lastPosition: 0,
      multiSelectModeLastPosition: 0
    }

    this._renderSong = this._renderSong.bind(this);
    this._renderMenu = this._renderMenu.bind(this);
    this._addToQueue = this._addToQueue.bind(this);
    this._addToPlaylist = this._addToPlaylist.bind(this);
    this._renderList = this._renderList.bind(this);
    this._renderMultiSelectModeSong = this._renderMultiSelectModeSong.bind(this);
    this._backHandler = this._backHandler.bind(this);
    this._shufflePlay = this._shufflePlay.bind(this);
    this._handleOnEndReached = this._handleOnEndReached.bind(this);
    this._handleMultiSelecteModeOnEndReached = this._handleMultiSelecteModeOnEndReached.bind(this);
    this._onLongPress = this._onLongPress.bind(this);
  }

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this._backHandler);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this._backHandler);
  }

  componentWillReceiveProps(nextProps) {
    // if (this.props.scanningSongs) {
    //   this.setState({
    //     songs: nextProps.songs
    //   });
    // } else {
    //   if (nextProps.songs && this.state.lastPosition === 0) {
    //     this.setState({
    //       songs: nextProps.songs.slice(0, FETCH_NUMBER),
    //       lastPosition: FETCH_NUMBER
    //     });
    //   }

    //   if (nextProps.selectedSongs && this.state.multiSelectModeLastPosition === 0) {
    //     this.setState({
    //       selectedSongs: nextProps.selectedSongs.slice(0, FETCH_NUMBER),
    //       multiSelectModeLastPosition: FETCH_NUMBER
    //     });
    //   } else {
    //     this.setState({
    //       selectedSongs: nextProps.selectedSongs.slice(0, this.state.selectedSongs.length)
    //     });
    //   }
    // }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.songs.length !== this.props.songs.length
      || nextProps.songs !== this.props.songs
      || nextProps.scanningSongs !== this.props.scanningSongs
      || nextProps.selectedSongs.length !== this.props.selectedSongs.length
      || nextProps.selectedSongs !== this.props.selectedSongs
      || nextProps.showMenu !== this.props.showMenu
      || nextProps.targetMenu !== this.props.targetMenu
      || nextProps.playing !== this.props.playing
      || nextProps.language !== this.props.language
      || nextProps.multiSelectModeEnabled !== this.props.multiSelectModeEnabled
      || nextState.lastPosition !== this.state.lastPosition
      || nextState.multiSelectModeLastPosition !== this.state.multiSelectModeLastPosition;
  }

  render() {
    return (
      <Body hasPaginationHeader={true}>
        {
          !this.props.isReady ?
            <BodyActivityIndicator /> :
            this._renderList()
        }
        {
          this.props.isReady ?
            <ShuffleSongsButton onPress={() => this._shufflePlay()} hide={!this.props.multiSelectModeEnabled} bottom={80} style={styles.shuffleButton} /> :
            null
        }
        {this._renderMenu()}
      </Body>
    );
  }

  _renderList() {
    if (this.props.multiSelectModeEnabled) {
      // onEndReached={this._handleMultiSelecteModeOnEndReached}
      // onEndReachedThreshold={0.5}
      return (
        <FlatList
          data={this.props.selectedSongs}
          showsVerticalScrollIndicator={false}

          renderItem={({ item }) => this._renderMultiSelectModeSong(item)}
          keyExtractor={(item, index) => index}
          getItemLayout={(data, index) => ({ length: styles._rowCard.height, offset: styles._rowCard.height * index, index })}
          style={styles.container} />
      );
    }
    // onEndReached={this._handleOnEndReached}
    // onEndReachedThreshold={0.5}
    return (
      <FlatList
        extraData={this.props.songs.map(s => s)}
        data={this.props.songs}
        showsVerticalScrollIndicator={false}

        renderItem={this._renderSong}
        keyExtractor={(item, index) => index}
        getItemLayout={(data, index) => ({ length: styles._rowCard.height, offset: styles._rowCard.height * index, index })}
        style={styles.container} />
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
        name={song.item.title || song.item.fileName}
        artist={song.item.artist}
        isFavorite={song.item.isFavorite}
        isPlaying={isPlaying}
        onOptionPress={() => this.props.setMenu(targetMenu)}
        onPlayPress={() => this._playSongs([song.item])}
        onLikePress={() => this.props.like('song', song.item)}
        onLongPress={() => this._onLongPress(song.item)} />
    );
  }

  _renderMultiSelectModeSong(song) {
    return (
      <SongCardWithCheck
        title={song.title || song.fileName}
        artist={song.artist}
        duration={parseInt(song.duration)}
        selected={song.selected}
        onSelectSong={() => this.props.selectSong(song)} />
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

  _onLongPress(song) {
    if (!this.props.scanningSongs) {
      this.props.enableMultiSelectMode(song.id)
    }
  }

  _addToQueue(songs) {
    this.props.setMenu(null);
    this.props.addToQueue(songs);
  }

  _addToPlaylist(song) {
    this.props.setMenu(null);
    this.props.navigation.navigate('PlaylistSelector', { song })
  }

  _shufflePlay() {
    let queue = this.props.selectedSongs.filter(s => s.selected);
    this.props.navigation.navigate('Player', { queue, startPlaying: true, shuffle: true });
    this.props.disableMultiSelectMode();
  }

  _backHandler() {
    if (this.props.multiSelectModeEnabled) {
      this.props.disableMultiSelectMode();
      return true;
    }

    return false;
  }

  _handleOnEndReached(info) {
    // if (this.state.songs.length < this.props.songs.length) {
    //   let songs = this.state.songs.concat(this.props.songs.slice(this.state.lastPosition, this.state.lastPosition + FETCH_NUMBER));
    //   this.setState({
    //     songs,
    //     lastPosition: this.state.lastPosition + FETCH_NUMBER
    //   });
    // }
  }

  _handleMultiSelecteModeOnEndReached(info) {
    if (this.state.selectedSongs.length < this.props.selectedSongs.length) {
      let selectedSongs = this.state.selectedSongs.concat(this.props.selectedSongs.slice(this.state.multiSelectModeLastPosition, this.state.multiSelectModeLastPosition + FETCH_NUMBER));
      this.setState({
        selectedSongs,
        multiSelectModeLastPosition: this.state.multiSelectModeLastPosition + FETCH_NUMBER
      });
    }
  }
}

const mapStateToProps = state => {
  return {
    dictionary: state.app.dictionary,
    scanningSongs: state.app.scanningSongs,
    songs: state.app.songs,
    selectedSongs: state.home.selectedSongs,
    showMenu: state.app.showMenu,
    targetMenu: state.app.targetMenu,
    isReady: state.app.homeSongsReady,
    currentSong: state.player.currentSong,
    playing: state.player.playing,
    multiSelectModeEnabled: state.home.multiSelectModeEnabled
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setMenu: (target) => dispatch(appActions.setMenu({ ...target, caller: 'HOME_SONG' })),
    addToQueue: (queue) => playerActions.addToQueue(queue)(dispatch),
    like: (type, album) => dispatch(favoritesActions.like(type, album)),
    enableMultiSelectMode: (initialSongId) => dispatch(homeActions.enableMultiSelectMode(initialSongId)),
    disableMultiSelectMode: () => dispatch(homeActions.disableMultiSelectMode()),
    selectSong: (song) => dispatch(homeActions.selectSong(song))
  }
}

HomeSongs.propTypes = {
  dictionary: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
  isReady: PropTypes.bool.isRequired,
  songs: PropTypes.array.isRequired,
  showMenu: PropTypes.bool.isRequired,
  targetMenu: PropTypes.object,
  currentSong: PropTypes.object,
  playing: PropTypes.bool,
  setMenu: PropTypes.func.isRequired,
  addToQueue: PropTypes.func.isRequired,
  like: PropTypes.func.isRequired,
  enableMultiSelectMode: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeSongs);