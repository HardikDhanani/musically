import React, { Component } from 'react';
import { connect } from 'react-redux';
import EStyleSheet from 'react-native-extended-stylesheet';

import * as playerActions from '../redux/actions/playerActions';
import * as favoritesActions from '../redux/actions/favoritesActions';
import * as appActions from '../redux/actions/appActions';

import { StyleSheet, Image, View, Text, Dimensions, TouchableOpacity, Platform } from 'react-native';
import Swiper from 'react-native-swiper';

import Container from '../components/Container';
import PlayerHeader from '../components/PlayerHeader';
import Header from '../components/Header';
import HeaderTitle from '../components/HeaderTitle';
import ProgressBar from '../components/ProgressBar';
import FloatMenu from '../components/FloatMenu';
import PlayerControls from '../components/PlayerControls';
import IconButton from '../components/common/buttons/IconButton';

const styles_2 = EStyleSheet.create({
  buttonSelected: {
    backgroundColor: 'transparent',
    fontSize: '$headerIconSize',
    color: '$buttonSelected'
  },
  buttonUnselected: {
    backgroundColor: 'transparent',
    fontSize: '$headerIconSize',
    color: '$buttonUnselected'
  }
});

class Player extends Component {
  constructor(props) {
    super(props);

    this._renderControls = this._renderControls.bind(this);
    this._renderFloatMenu = this._renderFloatMenu.bind(this);
    this._renderQueue = this._renderQueue.bind(this);
    this._onMomentumScrollEnd = this._onMomentumScrollEnd.bind(this);
    this._renderFooter = this._renderFooter.bind(this);
    this._getRepeatIcon = this._getRepeatIcon.bind(this);
    // this._progressBar = this._progressBar.bind(this);
    this._onProgressChange = this._onProgressChange.bind(this);
  }

  componentDidMount() {
    let queue = null;
    let startPlaying = false;

    if (this.props.navigation.state.params) {
      queue = this.props.navigation.state.params.queue;
      startPlaying = this.props.navigation.state.params.startPlaying;
    }

    this.props.load(queue, startPlaying);
  }

  render() {
    return (
      <Container>
        {this._renderQueue()}
        <PlayerHeader
          liked={this.props.isFavorite}
          onBackPress={() => this.props.navigation.goBack()}
          onLikePress={() => this.props.like(this.props.currentSong)}
          onSharePress={() => { }}
          onMenuPress={() => this.props.setMenu()} />
        {this._renderControls()}
        <TouchableOpacity style={styles.mixButton}></TouchableOpacity>
        {this._renderFloatMenu()}
        {this._renderFooter()}
      </Container>
    );
  }

  _renderQueue() {
    let songs = this.props.queue ? this.props.queue.map((song, index) => {
      let source = song.cover ? { uri: song.cover } : require('../images/music.png')
      return (
        <Image key={index} source={source} style={styles.image} />
      );
    }) : [];

    return (
      <Swiper
        showsPagination={false}
        loop={false}
        onMomentumScrollEnd={this._onMomentumScrollEnd}>
        {songs}
      </Swiper>
    );
  }

  _onMomentumScrollEnd(e, state, context) {
    if(this.props.currentIndex > state.index){
      this.props.prev();
    } else if(this.props.currentIndex < state.index) {
      this.props.next();
    }
  }

  _renderControls() {
    let title = this.props.currentSong ? this.props.currentSong.title : null;
    let artist = this.props.currentSong ? this.props.currentSong.artist : null;
    let album = this.props.currentSong ? this.props.currentSong.album : null;
    let currentIndex = this.props.currentIndex + 1;
    let totalSongs = this.props.queue.length;
    let duration = this.props.currentSong ? this._formatTime(this.props.currentSong.duration) : "00:00";
    let total = this.props.currentSong ? this.props.currentSong.duration : 0;

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
        onProgressChange={this._onProgressChange} />
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

  _renderFloatMenu() {
    if (!this.props.showMenu)
      return null;

    return (
      <FloatMenu onPress={() => this.props.setMenu()}>
        <TouchableOpacity style={styles.floatMenuOption}>
          <Text style={styles.floatMenuOptionText}>{'Sort Order'}</Text>
          <Text style={styles.floatMenuOptionText}>{'>'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.floatMenuOption}>
          <Text style={styles.floatMenuOptionText}>{'View Mode'}</Text>
          <Text style={styles.floatMenuOptionText}>{'>'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.floatMenuOption}>
          <Text style={styles.floatMenuOptionText}>{'Rescan Library'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.floatMenuOption}>
          <Text style={styles.floatMenuOptionText}>{'Playlist Queue'}</Text>
        </TouchableOpacity>
      </FloatMenu>
    );
  }

  _renderFooter() {
    return (
      <View style={[styles.footer, this.props.style]}>
        <IconButton iconName='shuffle' onPress={this.props.random} style={this.props.randomActive ? styles_2._buttonSelected : styles_2._buttonUnselected} iconSize={styles_2._buttonSelected.fontSize} />
        <IconButton iconName='skip-previous' onPress={this.props.prev} style={styles_2._buttonUnselected} iconSize={styles_2._buttonSelected.fontSize} />
        <IconButton iconName={this.props.playing ? 'pause' : 'play-arrow'} onPress={() => this.props.playPause(this.props.currentSong)} style={styles_2._buttonUnselected} iconSize={styles_2._buttonSelected.fontSize} />
        <IconButton iconName='skip-next' onPress={this.props.next} style={styles_2._buttonUnselected} iconSize={styles_2._buttonSelected.fontSize} />
        <IconButton iconName={this._getRepeatIcon()} onPress={() => this.props.repeat()} style={this.props.repeatMode !== 'NONE' ? styles_2._buttonSelected : styles_2._buttonUnselected} iconSize={styles_2._buttonSelected.fontSize} />
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

const styles = StyleSheet.create({
  button: {
    height: Header.currentHeight * 0.7,
    width: Header.currentHeight * 0.7,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5
  },
  buttonText: {
    color: 'black',
    fontSize: 20,
  },
  floatMenuOption: {
    flexDirection: 'row',
    height: Header.currentHeight * 0.8,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10
  },
  floatMenuOptionText: {
    fontSize: 15,
    color: 'white'
  },
  cover: {
    flex: 1,
  },
  controls: {
    backgroundColor: 'transparent',
    paddingHorizontal: 20,
    paddingVertical: 10,
    height: Dimensions.get('window').height * 0.41,
    backgroundColor: '#2E2E2E'
  },
  image: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.55,
  },
  mixButton: {
    position: 'absolute',
    top: 300,
    right: 20,
    height: Header.currentHeight,
    width: Header.currentHeight,
    borderRadius: 100,
    backgroundColor: '#ffa500',
  },
  footer: {
    height: Platform.OS === "ios" ? 55 : 55,
    width: Dimensions.get('window').width,
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 0,
    paddingHorizontal: 20,
  },
  playerButton: {
    width: Platform.OS === "ios" ? 55 : 55,
    height: Platform.OS === "ios" ? 55 : 55,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

const mapStateToProps = state => {
  return {
    currentSong: state.player.currentSong,
    isFavorite: state.player.isFavorite,
    currentIndex: state.player.currentIndex,
    elapsedTime: state.player.elapsedTime,
    queue: state.player.queue,
    randomActive: state.player.randomActive,
    playing: state.player.playing,
    repeatMode: state.player.repeatMode,
    showMenu: state.player.showMenu
  }
}

const mapDispatchToProps = dispatch => {
  return {
    load: (queue, startPlaying) => playerActions.load(queue, startPlaying)(dispatch),
    setMenu: (target, positionX, positionY) => dispatch(appActions.setMenu({ ...target, caller: 'PLAYER' }, positionX, positionY)),
    random: () => dispatch(playerActions.random()),
    repeat: () => dispatch(playerActions.repeat()),
    playPause: (currentSong) => playerActions.playPause(currentSong)(dispatch),
    next: () => playerActions.next()(dispatch),
    prev: () => playerActions.prev()(dispatch),
    progressChanged: (newElapsed) => dispatch(playerActions.progressChanged(newElapsed)),
    like: (song) => dispatch(favoritesActions.like('song', song)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Player);