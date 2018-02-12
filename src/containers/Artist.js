import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import EStyleSheet from 'react-native-extended-stylesheet';
import LinearGradient from 'react-native-linear-gradient';

import * as artistActions from '../redux/actions/artistActions';
import * as appActions from '../redux/actions/appActions';
import * as favoritesActions from '../redux/actions/favoritesActions';
import * as playerActions from '../redux/actions/playerActions';

import {
  View,
  FlatList,
  Image
} from 'react-native';
import Text from '../components/common/Text';
import SongCard from '../components/SongCard';
import CoverCard from '../components/common/cards/CoverCard';
import Touchable from '../components/common/buttons/Touchable';
import Header from '../components/common/headers/Header';
import HeaderLeftSection from '../components/common/headers/HeaderLeftSection';
import HeaderRightSection from '../components/common/headers/HeaderRightSection';
import HeaderCenterSection from '../components/common/headers/HeaderCenterSection';
import IconButton from '../components/common/buttons/IconButton';
import FullViewContainer from '../components/common/containers/FullViewContainer';
import Container from '../components/common/containers/Container';
import PlayerFooter from './PlayerFooter';
import ModalForm from '../components/common/forms/ModalForm';
import ModalFormTouchable from '../components/common/buttons/ModalFormTouchable';

const styles = EStyleSheet.create({
  $containerWidth: '$appWidth / 2',
  $cardWidth: '$containerWidth * 0.8',
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
    borderRadius: 3
  },
  image: {
    height: '$cardWidth',
    width: null,
    borderRadius: 3
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
  gradientContainer: {
    height: '$statusBarHeight',
    width: '$appWidth',
    backgroundColor: '$headerStartGradientBackgroundColor'
  }
});

class Artist extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentIndex: 0
    };

    this._renderMenu = this._renderMenu.bind(this);
    this._renderHeader = this._renderHeader.bind(this);
    this._renderCover = this._renderCover.bind(this);
    this._renderPagination = this._renderPagination.bind(this);
    this._renderControls = this._renderControls.bind(this);
    this._renderOverview = this._renderOverview.bind(this);
    this._renderAllSongs = this._renderAllSongs.bind(this);
    this._renderAlbums = this._renderAlbums.bind(this);
    this._renderSong = this._renderSong.bind(this);
    this._renderAlbum = this._renderAlbum.bind(this);
    this._shufflePlay = this._shufflePlay.bind(this);
    this._addToQueue = this._addToQueue.bind(this);
    this._addToPlaylist = this._addToPlaylist.bind(this);
  }

  componentWillMount() {
    const { artist, artistName } = this.props.navigation.state.params;
    this.props.load(artist || artistName);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.topSongs !== this.props.topSongs
      || nextProps.showFiveMore !== this.props.showFiveMore
      || nextProps.isFavorite !== this.props.isFavorite
      || nextProps.playing !== this.props.playing
      || nextProps.language !== this.props.language
      || nextProps.showSongMenuForm !== this.props.showSongMenuForm
      || nextProps.targetMenu !== this.props.targetMenu
      || nextState.currentIndex !== this.state.currentIndex;
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
              this._renderOverview() :
              null
          }
          {
            this.state.currentIndex === 1 ?
              this._renderAllSongs() :
              null
          }
          {
            this.state.currentIndex === 2 ?
              this._renderAlbums() :
              null
          }
        </FullViewContainer>
        <PlayerFooter navigation={this.props.navigation} />
        {this._renderMenu()}
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
          text={this.props.dictionary.getWord('file_detail')}
          onPress={() => { }} />
      </ModalForm>
    );
  }

  _renderHeader() {
    let favoriteStyle = this.props.isFavorite ? styles._headerButtonSelected : styles._headerButton;

    return (
      <View style={styles.headerContainer}>
        <HeaderLeftSection>
          <IconButton iconName="arrow-back" onPress={() => this.props.navigation.goBack()} style={styles._headerButton} iconSize={styles._headerButton.fontSize} />
        </HeaderLeftSection>
        <HeaderCenterSection />
        <HeaderRightSection>
          <View style={{ marginRight: 20 }}>
            <IconButton iconName="favorite" onPress={() => this.props.like('artist', this.props.artist)} style={favoriteStyle} iconSize={styles._headerButton.fontSize} />
          </View>
          <IconButton iconName="search" onPress={() => this.props.navigation.navigate('Search', {})} style={styles._headerButton} iconSize={styles._headerButton.fontSize} />
        </HeaderRightSection>
      </View>
    );
  }

  _renderCover() {
    let source = this.props.cover ? { uri: this.props.cover } : require('../images/default-cover.png');
    return (
      <View style={styles.imageContainer}>
        <Image source={source} style={styles.image} />
      </View>
    );
  }

  _renderControls() {
    return (
      <View style={styles.controlsContainer}>
        <IconButton iconName="repeat" style={styles._headerButton} iconSize={styles._headerButton.fontSize} />
        <View style={styles.artistInfo}>
          <Text style={styles.artistName}>{this.props.name}</Text>
          <Text style={styles.artistDetail}>{this.props.albums.length + ' ' + this.props.dictionary.getWord('albums') + ' - ' + this.props.songs.length + ' ' + this.props.dictionary.getWord('songs')}</Text>
        </View>
        <IconButton onPress={this._shufflePlay} iconName="shuffle" style={styles._headerButton} iconSize={styles._headerButton.fontSize} />
      </View>
    );
  }

  _renderPagination(index, total, context) {
    return (
      <View style={styles.paginationHeader}>
        <Touchable onPress={() => this.setState({ currentIndex: 0 })}>
          <View style={this.state.currentIndex === 0 ? styles.paginationHeaderButtonSelected : styles.paginationHeaderButton}>
            <Text style={this.state.currentIndex === 0 ? styles.paginationHeaderButtonSelectedText : styles.paginationHeaderButtonText}>{this.props.dictionary.getWord('overview')}</Text>
          </View>
        </Touchable>
        <Touchable onPress={() => this.setState({ currentIndex: 1 })}>
          <View style={this.state.currentIndex === 1 ? styles.paginationHeaderButtonSelected : styles.paginationHeaderButton}>
            <Text style={this.state.currentIndex === 1 ? styles.paginationHeaderButtonSelectedText : styles.paginationHeaderButtonText}>{this.props.dictionary.getWord('all_songs')}</Text>
          </View>
        </Touchable>
        <Touchable onPress={() => this.setState({ currentIndex: 2 })}>
          <View style={this.state.currentIndex === 2 ? styles.paginationHeaderButtonSelected : styles.paginationHeaderButton}>
            <Text style={this.state.currentIndex === 2 ? styles.paginationHeaderButtonSelectedText : styles.paginationHeaderButtonText}>{this.props.dictionary.getWord('albums')}</Text>
          </View>
        </Touchable>
      </View>
    );
  }

  _renderSong(song) {
    let isPlaying = this.props.playing && this.props.currentSong.id === song.item.id;

    return (
      <SongCard
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

  _renderAlbum({ item }) {
    return (
      <CoverCard
        onPress={() => this.props.navigation.navigate('Album', { album: item })}
        source={require('../images/default-cover.png')}
        imageUri={item.cover}
        title={item.album}
        detail={item.artist} />
    );
  }

  _renderOverview() {
    return (
      <View style={styles.pageContainer}>
        <Text style={[styles.paginationHeaderButtonSelectedText, { marginLeft: 15 }]}>{this.props.dictionary.getWord('top_songs')}</Text>
        {
          this.props.topSongs.length === 0 ?
            <Text style={[styles.noInfo, { alignSelf: 'center', marginBottom: 30 }]}>{this.props.dictionary.getWord('no_top_songs_yet')}</Text> :
            <FlatList
              data={this.props.topSongs}
              renderItem={this._renderSong}
              keyExtractor={(item, index) => index}
              style={styles.listContainer} />
        }
        {
          this.props.showFiveMore ?
            <Touchable onPress={() => this.props.showMore()}>
              <View style={styles.showMoreButton}>
                <Text style={styles.showMoreButtonText}>{this.props.dictionary.getWord('get_five_more')}</Text>
              </View>
            </Touchable> :
            null
        }
        <Text style={[styles.paginationHeaderButtonSelectedText, { marginLeft: 15 }]}>{this.props.dictionary.getWord('related_artists')}</Text>
        {
          this.props.relatedArtists.length === 0 ?
            <Text style={[styles.noInfo, { alignSelf: 'center', marginBottom: 30 }]}>{this.props.dictionary.getWord('no_related_artists_yet')}</Text> :
            <FlatList
              horizontal={true}
              data={this.props.relatedArtists}
              renderItem={this._renderAlbum}
              keyExtractor={(item, index) => index} />
        }
      </View>
    );
  }

  _renderAllSongs() {
    return (
      <View style={styles.pageContainer}>
        <FlatList
          data={this.props.songs}
          renderItem={this._renderSong}
          keyExtractor={(item, index) => index}
          style={styles.listContainer} />
      </View>
    );
  }

  _renderAlbums() {
    return (
      <View style={styles.pageContainer} >
        <FlatList
          data={this.props.albums}
          renderItem={this._renderAlbum}
          keyExtractor={(item, index) => index}
          style={[styles.listContainer, { flexDirection: 'column' }]}
          numColumns={2} />
      </View>
    );
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
    this.props.navigation.navigate('PlaylistSelector', { song })
  }
}

const mapStateToProps = state => {
  return {
    dictionary: state.app.dictionary,
    artist: state.artist.artist,
    name: state.artist.name,
    cover: state.artist.cover,
    songs: state.artist.songs,
    topSongs: state.artist.topSongs,
    albums: state.artist.albums,
    relatedArtists: state.artist.relatedArtists,
    isFavorite: state.artist.isFavorite,
    showFiveMore: state.artist.showFiveMore,
    playlists: state.artist.playlists,
    showSongMenuForm: state.artist.showSongMenuForm,
    targetMenu: state.artist.targetMenu,
    playing: state.player.playing,
    currentSong: state.player.currentSong
  }
}

const mapDispatchToProps = dispatch => {
  return {
    load: (artist) => artistActions.load(artist)(dispatch),
    showSongMenu: (song) => dispatch(artistActions.showSongMenu(song)),
    hideSongMenu: () => dispatch(artistActions.hideSongMenu()),
    like: (type, item) => dispatch(favoritesActions.like(type, item)),
    showMore: () => dispatch(artistActions.showMore()),
    addToQueue: (queue) => playerActions.addToQueue(queue)(dispatch)
  }
}

Artist.propTypes = {
  artist: PropTypes.object,
  relatedArtists: PropTypes.array,
  dictionary: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
  isFavorite: PropTypes.bool.isRequired,
  name: PropTypes.string,
  cover: PropTypes.string,
  songs: PropTypes.array.isRequired,
  topSongs: PropTypes.array.isRequired,
  playlists: PropTypes.array.isRequired,
  showFiveMore: PropTypes.bool.isRequired,
  showSongMenuForm: PropTypes.bool.isRequired,
  targetMenu: PropTypes.object,
  load: PropTypes.func.isRequired,
  showSongMenu: PropTypes.func.isRequired,
  hideSongMenu: PropTypes.func.isRequired,
  like: PropTypes.func.isRequired,
  showMore: PropTypes.func.isRequired,
  addToQueue: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(Artist);