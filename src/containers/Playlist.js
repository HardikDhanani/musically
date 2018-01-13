import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import EStyleSheet from 'react-native-extended-stylesheet';

import * as playlistActions from '../redux/actions/playlistActions';
import * as appActions from '../redux/actions/appActions';

import {
  View,
  FlatList,
  Image
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
    borderRadius: 3
  },
  image: {
    height: '$cardWidth',
    width: '$cardWidth',
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
  }
});

class Playlist extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentIndex: 0
    };

    this._renderSong = this._renderSong.bind(this);
    this._renderOverview = this._renderOverview.bind(this);
    this._renderAllSongs = this._renderAllSongs.bind(this);
    this._renderHeader = this._renderHeader.bind(this);
    this._renderControls = this._renderControls.bind(this);
    this._renderCover = this._renderCover.bind(this);
    this._renderImage = this._renderImage.bind(this);
  }

  componentDidMount() {
    const { playlistId } = this.props.navigation.state.params;
    this.props.load(playlistId);
  }

  render() {
    // var queue = this.props.songs;

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
      </Container>
    );
  }

  _renderHeader() {
    return (
      <View style={styles.headerContainer}>
        <HeaderLeftSection style={{ flex: 1 }}>
          <IconButton iconName="arrow-back" onPress={() => this.props.navigation.goBack()} style={styles._headerButton} iconSize={styles._headerButton.fontSize} />
        </HeaderLeftSection>
        <HeaderCenterSection style={{ flex: 2 }} />
        <HeaderRightSection style={{ flex: 1, justifyContent: 'flex-end' }}>
          <IconButton iconName="search" onPress={() => this.props.navigation.navigate('Search', {})} style={styles._headerButton} iconSize={styles._headerButton.fontSize} />
        </HeaderRightSection>
      </View>
    );
  }

  _renderCover() {
    let defaultSource = require('../images/music.png');

    if (this.props.songs.length <= 1) {
      let source = this.props.songs[0] ? { uri: this.props.songs[0].cover } : defaultSource;
      return (
        <View style={styles.imageContainer}>
          <Image source={source} style={styles.image} />
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
        <Text style={[styles.paginationHeaderButtonSelectedText, { marginLeft: 15 }]}>{'Top Tracks'}</Text>
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
        <Text style={[styles.paginationHeaderButtonSelectedText, { marginLeft: 15 }]}>{'Related Albums'}</Text>
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
          initialNumToRender={10}
          style={styles.listContainer} />
      </View>
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
        isPlaying={isPlaying} />
    );
  }

  _renderImage(item) {
    return (
      <View style={styles.imagex4Container}>
        <Image source={item.imageUri ? { uri: item.imageUri } : item.source} style={styles.imagex4} />
      </View>
    );
  }

  _getCovers(items) {
    let defaultSource = require('../images/music.png');
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
}

const mapStateToProps = state => {
  return {
    name: state.playlist.name,
    songs: state.playlist.songs,
    showFiveMore: state.playlist.showFiveMore,
    showMenu: state.app.showMenu
  }
}

const mapDispatchToProps = dispatch => {
  return {
    load: (playlistId) => playlistActions.load(playlistId)(dispatch),
    removeSong: (playlistId, songId) => playlistActions.removeSong(playlistId, songId)(dispatch),
    setMenu: (target, positionX, positionY) => dispatch(appActions.setMenu({ ...target, caller: 'PLAYLIST' }, positionX, positionY)),
    showMore: () => dispatch(playlistActions.showMore())
  }
}

Playlist.propTypes = {
  name: PropTypes.string,
  songs: PropTypes.array.isRequired,
  showFiveMore: PropTypes.bool.isRequired,
  showMenu: PropTypes.bool.isRequired,
  load: PropTypes.func.isRequired,
  removeSong: PropTypes.func.isRequired,
  setMenu: PropTypes.func.isRequired,
  showMore: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(Playlist);