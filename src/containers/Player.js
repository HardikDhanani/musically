import React, { Component } from 'react';
import { connect } from 'react-redux';
import EStyleSheet from 'react-native-extended-stylesheet';
import LinearGradient from 'react-native-linear-gradient';

import * as playerActions from '../redux/actions/playerActions';
import * as favoritesActions from '../redux/actions/favoritesActions';
import * as appActions from '../redux/actions/appActions';

import { 
  Image,
  View
} from 'react-native';
import Container from '../components/common/containers/Container';
import PlayerHeader from '../components/PlayerHeader';
import Header from '../components/common/headers/Header';
import HeaderTitle from '../components/common/headers/HeaderTitle';
import ProgressBar from '../components/ProgressBar';
import PlayerControls from '../components/PlayerControls';
import IconButton from '../components/common/buttons/IconButton';
import PlayPauseButtonWhite from '../components/common/buttons/PlayPauseButtonWhite';

const styles = EStyleSheet.create({
  $containerWidth: '$appWidth / 2',
  $cardWidth: '$containerWidth * 0.9',
  container: {
    flex: 1
  },
  buttonSelected: {
    backgroundColor: 'transparent',
    fontSize: '$headerIconSize',
    color: 'white'
  },
  buttonUnselected: {
    backgroundColor: 'transparent',
    fontSize: '$headerIconSize',
    color: '$elementInactive'
  },
  gradientStart: {
    color: '$headerStartGradientBackgroundColor'
  },
  gradientEnd: {
    color: '$headerEndGradientBackgroundColor'
  },
  footer: {
    width: '$appWidth',
    height: '$footerHeight',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    paddingHorizontal: 20,
    paddingBottom: 30
  },
  coverContainer: {
    height: '$appHeight * 0.5',
    width: '$appWidth',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    elevation: 5,
    backgroundColor: 'white',
    width: '$cardWidth',
    borderRadius: 3
  },
  image: {
    height: '$cardWidth',
    width: '$cardWidth',
    borderRadius: 3
  },
});

class Player extends Component {
  constructor(props) {
    super(props);

    this._renderControls = this._renderControls.bind(this);
    this._renderCover = this._renderCover.bind(this);
    this._renderFooter = this._renderFooter.bind(this);
    this._getRepeatIcon = this._getRepeatIcon.bind(this);
    this._onProgressChange = this._onProgressChange.bind(this);
  }

  componentDidMount() {
    let queue = null;
    let startPlaying = false;

    if (this.props.navigation.state.params) {
      queue = this.props.navigation.state.params.queue;
      startPlaying = this.props.navigation.state.params.startPlaying;
      shuffle = this.props.navigation.state.params.shuffle;
    }

    this.props.load(queue, startPlaying || false, shuffle || false);
  }

  render() {
    return (
      <Container fillStatusBar={false}>
        <LinearGradient
          start={{ x: 0.0, y: 0.0 }}
          end={{ x: 0.0, y: 1.0 }}
          colors={[styles._gradientStart.color, styles._gradientStart.color, styles._gradientEnd.color]}
          style={styles.container}>
          <PlayerHeader
            title={this.props.dictionary.getWord('now_playing')}
            onBackPress={() => this.props.navigation.goBack()} />
          {this._renderCover()}
          {this._renderControls()}
          {/*this._renderFloatMenu()*/}
          {this._renderFooter()}
        </LinearGradient>
      </Container>
    );
  }

  _renderCover() {
    let source = (this.props.currentSong && this.props.currentSong.cover) ? { uri: this.props.currentSong.cover } : require('../images/default-cover.png')

    return (
      <View style={styles.coverContainer}>
        <View style={styles.imageContainer}>
          <Image source={source} style={styles.image} />
        </View>
      </View>
    );
  }

  _renderControls() {
    let title = this.props.currentSong ? this.props.currentSong.title : null;
    let artist = this.props.currentSong ? this.props.currentSong.artist : null;
    let album = this.props.currentSong ? this.props.currentSong.album : null;
    let currentIndex = this.props.currentIndex + 1;
    let totalSongs = this.props.queue.length;
    let duration = this.props.currentSong ? this._formatTime(this.props.currentSong.duration) : "00:00";
    let total = this.props.currentSong ? parseInt(this.props.currentSong.duration) : 0;

    return (
      <PlayerControls
        title={title}
        artist={artist}
        album={album}
        currentIndex={currentIndex}
        totalSongs={totalSongs}
        duration={duration}
        elapsedTime={this.props.elapsedTime}
        total={total}
        liked={this.props.isFavorite}
        onProgressChange={this._onProgressChange}
        onLikePress={() => this.props.like(this.props.currentSong)} />
    );
  }

  _formatTime(elapsedTime) {
    let ret = "00:00";
    if (elapsedTime) {
      let d = new Date(parseInt(elapsedTime));
      let minutes = "00" + d.getMinutes().toString();
      let seconds = "00" + d.getSeconds().toString();
      ret = minutes.substring(minutes.length - 2, minutes.length) + ":" + seconds.substring(seconds.length - 2, seconds.length);
    }

    return ret;
  }

  _onProgressChange(percentage) {
    let total = this.props.currentSong ? this.props.currentSong.duration : 0;

    if (this.props.playing)
      this.props.playPause(this.props.currentSong);

    if (percentage) {
      let newElapsed = total * percentage;
      this.props.progressChanged(newElapsed);
    }
  }

  _renderFooter() {
    return (
      <View style={[styles.footer, this.props.style]}>
        <IconButton iconName={this._getRepeatIcon()} onPress={() => this.props.repeat()} style={this.props.repeatMode !== 'NONE' ? styles._buttonSelected : styles._buttonUnselected} iconSize={this.props.repeatMode !== 'NONE' ? styles._buttonSelected.fontSize + 3 : styles._buttonSelected.fontSize} />
        <IconButton iconName='fast-rewind' onPress={this.props.prev} style={styles._buttonUnselected} iconSize={styles._buttonSelected.fontSize} />
        <PlayPauseButtonWhite onPress={() => this.props.playPause(this.props.currentSong)} iconName={this.props.playing ? 'pause' : 'play-arrow'} />
        <IconButton iconName='fast-forward' onPress={this.props.next} style={styles._buttonUnselected} iconSize={styles._buttonSelected.fontSize} />
        <IconButton iconName='shuffle' onPress={this.props.shuffle} style={this.props.shuffleActive ? styles._buttonSelected : styles._buttonUnselected} iconSize={this.props.shuffleActive ? styles._buttonSelected.fontSize + 3 : styles._buttonSelected.fontSize} />
      </View>
    );
  }

  _getRepeatIcon() {
    switch (this.props.repeatMode) {
      case 'ONE':
        return 'repeat-one';
      default:
        return 'repeat';
    }
  }
}

const mapStateToProps = state => {
  return {
    dictionary: state.app.dictionary,
    currentSong: state.player.currentSong,
    isFavorite: state.player.isFavorite,
    currentIndex: state.player.currentIndex,
    elapsedTime: state.player.elapsedTime,
    queue: state.player.queue,
    shuffleActive: state.player.shuffleActive,
    playing: state.player.playing,
    repeatMode: state.player.repeatMode,
    showMenu: state.player.showMenu
  }
}

const mapDispatchToProps = dispatch => {
  return {
    load: (queue, startPlaying, shuffle) => playerActions.load(queue, startPlaying, shuffle)(dispatch),
    setMenu: (target, positionX, positionY) => dispatch(appActions.setMenu({ ...target, caller: 'PLAYER' }, positionX, positionY)),
    shuffle: () => dispatch(playerActions.shuffle()),
    repeat: () => dispatch(playerActions.repeat()),
    playPause: (currentSong) => playerActions.playPause(currentSong)(dispatch),
    next: () => playerActions.next()(dispatch),
    prev: () => playerActions.prev()(dispatch),
    progressChanged: (newElapsed) => dispatch(playerActions.progressChanged(newElapsed)),
    like: (song) => dispatch(favoritesActions.like('song', song)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Player);