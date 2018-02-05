import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import EStyleSheet from 'react-native-extended-stylesheet';
import Icon from 'react-native-vector-icons/MaterialIcons';

import * as playlistActions from '../redux/actions/playlistActions';
import * as appActions from '../redux/actions/appActions';
import * as favoritesActions from '../redux/actions/favoritesActions';
import * as playerActions from '../redux/actions/playerActions';

import {
  View,
  FlatList,
  Image,
  ActivityIndicator
} from 'react-native';
import Text from '../components/common/Text';
import Touchable from '../components/common/buttons/Touchable';
import SongCard from '../components/SongCard';
import FullViewContainer from '../components/common/containers/FullViewContainer';
import Header from '../components/common/headers/Header';
import HeaderLeftSection from '../components/HeaderLeftSection';
import HeaderRightSection from '../components/HeaderRightSection';
import HeaderCenterSection from '../components/HeaderCenterSection';
import IconButton from '../components/common/buttons/IconButton';
import TwoColumnContainer from '../components/common/containers/TwoColumnContainer';
import Container from '../components/Container';
import PlayerFooter from './PlayerFooter';
import ModalForm from '../components/common/forms/ModalForm';
import ModalFormTouchable from '../components/common/buttons/ModalFormTouchable';
import ModalFormWithAction from '../components/common/forms/ModalFormWithAction';

const styles = EStyleSheet.create({
  $containerWidth: '$appWidth / 2',
  $cardWidth: '$containerWidth * 0.8',
  $imageWidth: '$cardWidth / 2',
  pageContainer: {
    flex: 1
  },
  paginationHeader: {
    flexDirection: 'row',
    height: '$headerHeight',
    marginHorizontal: 15,
    marginBottom: 15
  },
  paginationHeaderButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(192,192,192,1)'
  },
  paginationHeaderButtonSelected: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 5,
    borderBottomColor: 'rgba(108,3,233,1)'
  },
  paginationHeaderButtonText: {
    fontSize: 15,
    color: 'rgba(152,152,152,1)',
  },
  paginationHeaderButtonSelectedText: {
    fontSize: 17,
    color: '$textMainColor',
    fontWeight: 'bold'
  },
  listContainer: {
    flex: 1,
    flexDirection: 'column'
  },
  showMoreButton: {
    height: '$headerHeight * 0.9',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    marginVertical: 7,
    marginBottom: 20,
    borderRadius: 6,
    elevation: 5
  },
  showMoreButtonText: {
    color: 'rgba(108,3,233,1)',
    fontSize: 17
  },
  headerButton: {
    color: '$headerColor',
    backgroundColor: 'transparent',
    fontSize: '$headerIconSize'
  },
  headerButtonSelected: {
    color: '$appMainColor',
    backgroundColor: 'transparent',
    fontSize: '$headerIconSize'
  },
  headerContainer: {
    height: '$headerHeight',
    flexDirection: 'row'
  },
  imageContainer: {
    elevation: 5,
    backgroundColor: 'white',
    width: '$cardWidth',
    height: '$cardWidth',
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    height: '$cardWidth',
    width: '$cardWidth'
  },
  defaultImage: {
    height: '$cardWidth * 0.75',
    width: '$cardWidth * 0.75'
  },
  controlsContainer: {
    flex: 1,
    width: '$appWidth',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10
  },
  artistInfo: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  artistName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white'
  },
  artistDetail: {
    fontSize: 15,
    color: 'white'
  },
  imagex4Container: {
    height: '$imageWidth',
    width: '$imageWidth',
  },
  imagex4: {
    height: '$imageWidth',
    width: null
  },
  gradientContainer: {
    height: '$statusBarHeight',
    width: '$appWidth',
    backgroundColor: '$headerStartGradientBackgroundColor'
  },
  contentHeight: {
    height: '$modalFormHeight'
  },
  textContainer: {
    flex: 1,
    width: '$modalFormWidth',
    justifyContent: 'center',
    padding: 15
  },
  text: {
    fontSize: '$titleFontSize'
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
});

class Playlist extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentIndex: 0
    };

    this._renderMenu = this._renderMenu.bind(this);
    this._renderSong = this._renderSong.bind(this);
    this._renderOverview = this._renderOverview.bind(this);
    this._renderAllSongs = this._renderAllSongs.bind(this);
    this._renderHeader = this._renderHeader.bind(this);
    this._renderControls = this._renderControls.bind(this);
    this._renderCover = this._renderCover.bind(this);
    this._renderImage = this._renderImage.bind(this);
    this._shufflePlay = this._shufflePlay.bind(this);
    this._addToQueue = this._addToQueue.bind(this);
    this._addToPlaylist = this._addToPlaylist.bind(this);
    this._removeSong = this._removeSong.bind(this);
    this._renderDeletePlaylistForm = this._renderDeletePlaylistForm.bind(this);
    this._renderDeletingPlaylist = this._renderDeletingPlaylist.bind(this);
    this._renderDeletePlaylistSuccessForm = this._renderDeletePlaylistSuccessForm.bind(this);
  }

  componentWillMount() {
    const { playlistId } = this.props.navigation.state.params;
    this.props.load(playlistId);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.closeForm) {
      this.props.navigation.goBack();
    }
  }

  render() {
    return (
      <Container fillStatusBar={false}>
        <View style={styles.gradientContainer} />
        <FullViewContainer
          header={this._renderHeader()}
          cover={this._renderCover()}
          pagination={this._renderPagination()}
          controls={this._renderControls()}>
          {
            this.state.currentIndex === 0 ?
              this._renderOverview(this.props.songs.slice(0, 5)) :
              null
          }
          {
            this.state.currentIndex === 1 ?
              this._renderAllSongs(this.props.songs) :
              null
          }
        </FullViewContainer>
        <PlayerFooter navigation={this.props.navigation} />
        {this._renderMenu()}
        {this._renderDeletePlaylistForm()}
        {this._renderDeletingPlaylist()}
        {this._renderDeletePlaylistSuccessForm()}
      </Container>
    );
  }

  _renderMenu() {
    if (!this.props.showSongMenuForm)
      return null;

    return (
      <ModalForm
        title={this.props.targetMenu.title}
        onCancelPress={() => this.props.hideSongMenu()}>
        <ModalFormTouchable
          text={this.props.dictionary.getWord('add_to_playlist')}
          onPress={() => this._addToPlaylist(this.props.targetMenu)} />
        <ModalFormTouchable
          text={this.props.dictionary.getWord('add_to_queue')}
          onPress={() => this._addToQueue([this.props.targetMenu])} />
        <ModalFormTouchable
          text={'Remove from playlist'}
          onPress={() => this._removeSong(this.props.targetMenu)} />
        <ModalFormTouchable
          text={this.props.dictionary.getWord('file_detail')}
          onPress={() => { }} />
      </ModalForm>
    );
  }

  _renderHeader() {
    let showDeleteButton = (this.props.playlist && (this.props.playlist.name != 'Favorites' && this.props.playlist.name != 'Most played' && this.props.playlist.name != 'Recently played'));

    return (
      <View style={styles.headerContainer}>
        <HeaderLeftSection style={{ flex: 1 }}>
          <IconButton iconName="arrow-back" onPress={() => this.props.navigation.goBack()} style={styles._headerButton} iconSize={styles._headerButton.fontSize} />
        </HeaderLeftSection>
        <HeaderCenterSection style={{ flex: 2 }} />
        <HeaderRightSection style={{ flex: 1, justifyContent: 'flex-end' }}>
          <View style={{ marginRight: 15 }}>
            <IconButton iconName="search" onPress={() => this.props.navigation.navigate('Search', {})} style={styles._headerButton} iconSize={styles._headerButton.fontSize} />
          </View>
          {
            showDeleteButton ?
              <View style={{ marginRight: 15 }}>
                <IconButton iconName="delete" onPress={() => this.props.showDeletePlaylistConfirmation()} style={styles._headerButton} iconSize={styles._headerButton.fontSize} />
              </View> :
              null
          }
        </HeaderRightSection>
      </View>
    );
  }

  _renderCover() {
    let defaultSource = require('../images/default-cover.png');

    if (this.props.songs.length <= 1) {
      let source = (this.props.songs[0] && this.props.songs[0].cover) ? { uri: this.props.songs[0].cover } : defaultSource;
      return (
        <View style={styles.imageContainer}>
          <Image source={source} style={source.uri ? styles.image : styles.defaultImage} />
        </View>
      );
    }

    let items = this._getCovers(this.props.songs);

    return (
      <View style={styles.imageContainer}>
        <TwoColumnContainer items={items[0]} renderItem={this._renderImage} />
        <TwoColumnContainer items={items[1]} renderItem={this._renderImage} />
      </View>
    );
  }

  _renderPagination(index, total, context) {
    return (
      <View style={styles.paginationHeader}>
        <Touchable onPress={() => this.setState({ currentIndex: 0 })}>
          <View style={this.state.currentIndex === 0 ? styles.paginationHeaderButtonSelected : styles.paginationHeaderButton}>
            <Text style={this.state.currentIndex === 0 ? styles.paginationHeaderButtonSelectedText : styles.paginationHeaderButtonText}>{'Overview'}</Text>
          </View>
        </Touchable>
        <Touchable onPress={() => this.setState({ currentIndex: 1 })}>
          <View style={this.state.currentIndex === 1 ? styles.paginationHeaderButtonSelected : styles.paginationHeaderButton}>
            <Text style={this.state.currentIndex === 1 ? styles.paginationHeaderButtonSelectedText : styles.paginationHeaderButtonText}>{'All Songs'}</Text>
          </View>
        </Touchable>
      </View>
    );
  }

  _renderControls() {
    return (
      <View style={styles.controlsContainer}>
        <IconButton iconName="repeat" style={styles._headerButton} iconSize={styles._headerButton.fontSize} />
        <View style={styles.artistInfo}>
          <Text style={styles.artistName}>{this.props.name}</Text>
          <Text style={styles.artistDetail}>{(this.props.songs.length || 0) + ' Songs'}</Text>
        </View>
        <IconButton iconName="shuffle" style={styles._headerButton} iconSize={styles._headerButton.fontSize} />
      </View>
    );
  }

  _renderOverview(topSongs) {
    return (
      <View style={styles.pageContainer}>
        {
          (topSongs && topSongs.length > 0) ?
            <Text style={[styles.paginationHeaderButtonSelectedText, { marginLeft: 15 }]}>{'Top Tracks'}</Text> :
            null
        }
        <FlatList
          data={topSongs}
          renderItem={this._renderSong}
          keyExtractor={(item, index) => index}
          style={styles.listContainer} />
        {
          this.props.showFiveMore ?
            <Touchable onPress={() => this.props.showMore()}>
              <View style={styles.showMoreButton}>
                <Text style={styles.showMoreButtonText}>{'Show 5 more'}</Text>
              </View>
            </Touchable> :
            null
        }
      </View>
    );
  }

  _renderAllSongs(songs) {
    return (
      <View style={styles.pageContainer}>
        <FlatList
          data={songs}
          renderItem={this._renderSong}
          keyExtractor={(item, index) => index}
          style={styles.listContainer} />
      </View>
    );
  }

  _renderSong(song) {
    let isPlaying = this.props.playing && this.props.currentSong.id === song.item.id;

    return (
      <SongCard
        key={song.index}
        id={song.item.id}
        name={song.item.title}
        artist={song.item.artist}
        isFavorite={song.item.isFavorite}
        isPlaying={isPlaying}
        onPlayPress={() => { /*if the song is actually in the queue, move to that song a play it, alse play it alone*/ }}
        onLikePress={() => this.props.like('song', song.item)}
        onOptionPress={() => this.props.showSongMenu(song.item)} />
    );
  }

  _renderImage(item) {
    return (
      <View style={styles.imagex4Container}>
        <Image source={item.imageUri ? { uri: item.imageUri } : item.source} style={styles.imagex4} />
      </View>
    );
  }

  _renderDeletePlaylistForm() {
    if (!this.props.showDeletePlaylistConfirmationForm) {
      return null;
    }

    return (
      <ModalFormWithAction
        style={{ height: styles._contentHeight.height }}
        actionText={'Delete'}
        title={'Delete playlist'}
        onCancelPress={() => this.props.cancelDeletePlaylistConfirmation()}
        onActionPress={() => this.props.deletePlaylist(this.props.playlist)}
        actionEnabled={true}>
        <View style={styles.textContainer}>
          <Text style={styles.text}>{'You are going to delete the playlist ' + this.props.playlist.name + '.'}</Text>
          <Text style={styles.text}>{'Are you sure?'}</Text>
        </View>
      </ModalFormWithAction>
    );
  }

  _renderDeletingPlaylist() {
    if (!this.props.deletingPlaylist) {
      return null;
    }

    return (
      <ModalForm
        style={styles.confirmationContainer}
        onCancelPress={() => { }}>
        <View style={styles.checkContainer}>
          <ActivityIndicator animating={true} size='large' color='white' />
        </View>
        <Text style={styles.text}>{'Deleting playlist...'}</Text>
      </ModalForm>
    );
  }

  _renderDeletePlaylistSuccessForm() {
    if (!this.props.showDeletePlaylistSuccessConfirmation) {
      return null;
    }

    return (
      <ModalForm
        style={styles.confirmationContainer}
        onCancelPress={() => { }}>
        <View style={styles.checkContainer}>
          <Icon name='delete' color={styles._check.color} backgroundColor={'transparent'} size={styles._check.fontSize} />
        </View>
        <Text style={styles.textBold}>{this.props.playlist.name}</Text>
        <Text style={styles.text}>{'has been deleted.'}</Text>
      </ModalForm>
    );
  }

  _getCovers(items) {
    let defaultSource = require('../images/default-cover.png');
    let ret = [];
    for (let i = 0; i < items.length; i++) {
      if (items[i].cover) {
        let j = ret.findIndex(r => r.imageUri === items[i].cover)
        if (j === -1) {
          ret.push({ imageUri: items[i].cover });
        }
      }

      if (ret.length === 4) {
        break;
      }
    }

    if (ret.length === 2) {
      ret = [
        ret[0],
        { imageUri: null },
        { imageUri: null },
        ret[1]
      ]
    }

    return [
      [
        {
          imageUri: ret[0] ? ret[0].imageUri : null,
          source: defaultSource,
        },
        {
          imageUri: ret[1] ? ret[1].imageUri : null,
          source: defaultSource,
        }
      ],
      [
        {
          imageUri: ret[2] ? ret[2].imageUri : null,
          source: defaultSource,
        },
        {
          imageUri: ret[3] ? ret[3].imageUri : null,
          source: defaultSource,
        }
      ]
    ];
  }

  _shufflePlay() {
    this.props.navigation.navigate('Player', { queue: this.props.songs, startPlaying: true, shuffle: true });
  }

  _addToQueue(songs) {
    this.props.hideSongMenu();
    this.props.addToQueue(songs);
  }

  _addToPlaylist(song) {
    this.props.hideSongMenu();
    this.props.navigation.navigate('PlaylistSelector', { song, exclude: (playlist) => playlist.id != this.props.playlist.id });
  }

  _removeSong(song) {
    this.props.hideSongMenu();
    this.props.removeSong(this.props.playlist.id, song.id);
  }
}

const mapStateToProps = state => {
  return {
    dictionary: state.app.dictionary,
    playlist: state.playlist.playlist,
    name: state.playlist.name,
    songs: state.playlist.songs,
    topSongs: state.playlist.topSongs,
    showFiveMore: state.playlist.showFiveMore,
    playlists: state.playlist.playlists,
    showSongMenuForm: state.playlist.showSongMenuForm,
    targetMenu: state.playlist.targetMenu,
    showDeletePlaylistConfirmationForm: state.playlist.showDeletePlaylistConfirmationForm,
    showDeletePlaylistSuccessConfirmation: state.playlist.showDeletePlaylistSuccessConfirmation,
    closeForm: state.playlist.closeForm,
    deletingPlaylist: state.playlist.deletingPlaylist,
    playing: state.player.playing,
    currentSong: state.player.currentSong
  }
}

const mapDispatchToProps = dispatch => {
  return {
    load: (playlistId) => playlistActions.load(playlistId)(dispatch),
    removeSong: (playlistId, songId) => playlistActions.removeSong(playlistId, songId)(dispatch),
    showSongMenu: (song) => dispatch(playlistActions.showSongMenu(song)),
    hideSongMenu: () => dispatch(playlistActions.hideSongMenu()),
    showMore: () => dispatch(playlistActions.showMore()),
    showDeletePlaylistConfirmation: () => dispatch(playlistActions.showDeletePlaylistConfirmation()),
    cancelDeletePlaylistConfirmation: () => dispatch(playlistActions.cancelDeletePlaylistConfirmation()),
    deletePlaylist: (playlist) => playlistActions.deletePlaylist(playlist)(dispatch),
    like: (type, item) => dispatch(favoritesActions.like(type, item)),
    addToQueue: (queue) => playerActions.addToQueue(queue)(dispatch)
  }
}

Playlist.propTypes = {
  songs: PropTypes.array.isRequired,
  removeSong: PropTypes.func.isRequired,
  showMore: PropTypes.func.isRequired,
  playlist: PropTypes.object,
  dictionary: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  topSongs: PropTypes.array.isRequired,
  playlists: PropTypes.array.isRequired,
  showFiveMore: PropTypes.bool.isRequired,
  showSongMenuForm: PropTypes.bool.isRequired,
  targetMenu: PropTypes.object,
  load: PropTypes.func.isRequired,
  showSongMenu: PropTypes.func.isRequired,
  hideSongMenu: PropTypes.func.isRequired,
  like: PropTypes.func.isRequired,
  addToQueue: PropTypes.func.isRequired,
  showDeletePlaylistConfirmation: PropTypes.func.isRequired,
  cancelDeletePlaylistConfirmation: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Playlist);