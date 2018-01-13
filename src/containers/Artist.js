import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import EStyleSheet from 'react-native-extended-stylesheet';
import LinearGradient from 'react-native-linear-gradient';

import * as artistActions from '../redux/actions/artistActions';
import * as appActions from '../redux/actions/appActions';
import * as favoritesActions from '../redux/actions/favoritesActions';

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
import HeaderLeftSection from '../components/HeaderLeftSection';
import HeaderRightSection from '../components/HeaderRightSection';
import HeaderCenterSection from '../components/HeaderCenterSection';
import IconButton from '../components/common/buttons/IconButton';
import FullViewContainer from '../components/common/containers/FullViewContainer';
import Container from '../components/Container';
import PlayerFooter from './PlayerFooter';

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
  }

  componentDidMount() {
    const { artist, artistName } = this.props.navigation.state.params;
    this.props.load(artist || artistName);
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
        <PlayerFooter />
      </Container>
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
          <IconButton iconName="favorite" onPress={() => this.props.like('artist', this.props.artist)} style={favoriteStyle} iconSize={styles._headerButton.fontSize} />
          <IconButton iconName="search" onPress={() => this.props.navigation.navigate('Search', {})} style={styles._headerButton} iconSize={styles._headerButton.fontSize} />
        </HeaderRightSection>
      </View>
    );
  }

  _renderCover() {
    let source = this.props.cover ? { uri: this.props.cover } : require('../images/music.png');
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
          <Text style={styles.artistDetail}>{this.props.albums.length + ' Albums - ' + this.props.songs.length + ' Songs'}</Text>
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
            <Text style={this.state.currentIndex === 0 ? styles.paginationHeaderButtonSelectedText : styles.paginationHeaderButtonText}>{'Overview'}</Text>
          </View>
        </Touchable>
        <Touchable onPress={() => this.setState({ currentIndex: 1 })}>
          <View style={this.state.currentIndex === 1 ? styles.paginationHeaderButtonSelected : styles.paginationHeaderButton}>
            <Text style={this.state.currentIndex === 1 ? styles.paginationHeaderButtonSelectedText : styles.paginationHeaderButtonText}>{'All Songs'}</Text>
          </View>
        </Touchable>
        <Touchable onPress={() => this.setState({ currentIndex: 2 })}>
          <View style={this.state.currentIndex === 2 ? styles.paginationHeaderButtonSelected : styles.paginationHeaderButton}>
            <Text style={this.state.currentIndex === 2 ? styles.paginationHeaderButtonSelectedText : styles.paginationHeaderButtonText}>{'Albums'}</Text>
          </View>
        </Touchable>
      </View>
    );
  }

  _renderSong(song) {
    let targetMenu = {
      type: 'SONG',
      payload: song.item
    };

    let isPlaying = this.props.isPlaying && this.props.playingSong.id === song.item.id;

    return (
      <SongCard
        key={song.index}
        id={song.item.id}
        name={song.item.title}
        artist={song.item.artist}
        isFavorite={song.item.isFavorite}
        isPlaying={isPlaying}
        onLikePress={() => this.props.like('song', song.item)} />
    );
  }

  _renderAlbum({ item }) {
    return (
      <CoverCard
        onPress={() => this.props.navigation.navigate('Album', { album: item })}
        source={require('../images/music.png')}
        imageUri={item.cover}
        title={item.album}
        detail={item.artist} />
    );
  }

  _renderOverview() {
    return (
      <View style={styles.pageContainer}>
        <Text style={[styles.paginationHeaderButtonSelectedText, { marginLeft: 15 }]}>{'Top Tracks'}</Text>
        <FlatList
          data={this.props.topSongs}
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
        <Text style={[styles.paginationHeaderButtonSelectedText, { marginLeft: 15 }]}>{'Related Artists'}</Text>
        <FlatList
          horizontal={true}
          data={this.props.relatedArtists}
          renderItem={this._renderAlbum}
          keyExtractor={(item, index) => index} />
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
          initialNumToRender={10}
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
    this.props.navigation.navigate('Player', { queue: this.props.songs, startPlaying: true, random: true });
  }
}

const mapStateToProps = state => {
  return {
    artist: state.artist.artist,
    name: state.artist.name,
    cover: state.artist.cover,
    songs: state.artist.songs,
    topSongs: state.artist.topSongs,
    albums: state.artist.albums,
    relatedArtists: state.artist.relatedArtists,
    isFavorite: state.artist.isFavorite,
    showFiveMore: state.artist.showFiveMore,
    // showMenu: state.app.showMenu,
    // targetMenu: state.app.targetMenu,
    dictionary: state.app.dictionary
  }
}

const mapDispatchToProps = dispatch => {
  return {
    load: (artist) => artistActions.load(artist)(dispatch),
    // setMenu: (target, positionX, positionY) => dispatch(appActions.setMenu({ ...target, caller: 'ARTIST' }, positionX, positionY)),
    like: (type, artist) => dispatch(favoritesActions.like(type, artist)),
    showMore: () => dispatch(artistActions.showMore()),
    // addToQueue: (queue) => playerActions.addToQueue(queue)(dispatch),
  }
}

Artist.propTypes = {
  artist: PropTypes.object,
  topSongs: PropTypes.array,
  relatedArtists: PropTypes.array,
  // targetMenu: PropTypes.object,
  isFavorite: PropTypes.bool,
  // showMenu: PropTypes.bool,
  navigation: PropTypes.any.isRequired,
  dictionary: PropTypes.any.isRequired,
  load: PropTypes.func,
  // setMenu: PropTypes.func,
  like: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(Artist);