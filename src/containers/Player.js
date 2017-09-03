import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as playerActions from '../redux/actions/playerActions';

import { StyleSheet, Image, View, Text, Dimensions, TouchableOpacity, Platform } from 'react-native';
import Swiper from 'react-native-swiper';

import Header from '../components/Header';
import Title from '../components/Title';
import FloatMenu from '../components/FloatMenu';

class Player extends Component {
  constructor(props) {
    super(props);

    this._renderControls = this._renderControls.bind(this);
    this._renderHeader = this._renderHeader.bind(this);
    this._renderFloatMenu = this._renderFloatMenu.bind(this);
    this._renderQueue = this._renderQueue.bind(this);
    this._onMomentumScrollEnd = this._onMomentumScrollEnd.bind(this);
    this._renderFooter = this._renderFooter.bind(this);
    this._getRepeatIcon = this._getRepeatIcon.bind(this);
  }

  componentDidMount() {
    let queue = null;
    let initialSong = null;

    if (this.props.navigation.state.params) {
      queue = this.props.navigation.state.params.queue;
      initialSong = this.props.navigation.state.params.initialSong;
    }

    this.props.load(queue, initialSong);
  }

  render() {
    return (
      <View style={styles.container}>
        {this._renderQueue()}
        {this._renderControls()}
        <TouchableOpacity style={styles.mixButton}></TouchableOpacity>
        {this._renderHeader()}
        {this._renderFloatMenu()}
        {this._renderFooter()}
      </View>
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
        height={Dimensions.get('window').height * 0.55}
        showsPagination={false}
        loop={false}
        ref={component => this._swiper = component}
        onMomentumScrollEnd={this._onMomentumScrollEnd}>
        {songs}
      </Swiper>
    );
  }

  _onMomentumScrollEnd(e, state, context) {
    this.props.songChanged(this.props.queue[state.index], null);
  }

  _renderHeader() {
    return (
      <Header style={styles.header}>
        <View style={styles.left}>
          <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.goBack()}>
            <Text style={styles.buttonText}>{'<'}</Text>
          </TouchableOpacity>
        </View>
        <View style={{ alignSelf: 'center', flex: 1 }}>
          <Title style={styles.title}>{''}</Title>
        </View>
        <View style={[styles.right, styles.row]}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>{'Li'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>{'Sh'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => this.props.setMenu()}>
            <Text style={styles.buttonText}>{'+'}</Text>
          </TouchableOpacity>
        </View>
      </Header>
    );
  }

  _renderControls() {
    let title = this.props.currentSong ? this.props.currentSong.title : null;
    let duration = this.props.currentSong ? this.props.currentSong.duration : null;
    if (duration) {
      let d = new Date(parseInt(duration));
      let minutes = "00" + d.getMinutes().toString();
      let seconds = "00" + d.getSeconds().toString();
      duration = minutes.substring(minutes.length - 2, minutes.length) + ":" + seconds.substring(seconds.length - 2, seconds.length);
    }
    let artist = this.props.currentSong ? this.props.currentSong.artist : null;
    let album = this.props.currentSong ? this.props.currentSong.album : null;
    let currentIndex = this.props.currentIndex + 1;
    let totalSongs = this.props.queue.length;

    return (
      <View style={styles.controls}>
        <Text style={{ lineHeight: 25, color: 'white', fontSize: 17 }}>{title}</Text>
        <Text style={{ lineHeight: 25, color: 'gray' }}>{artist}</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ lineHeight: 25, color: 'gray' }}>{album}</Text>
          <Text style={{ lineHeight: 25, color: 'gray' }}>{currentIndex + '/' + totalSongs}</Text>
        </View>
        <View style={{ marginTop: 30 }}>
          <View style={{ width: Dimensions.get('window').width - 40, height: 4, backgroundColor: 'gray', marginBottom: 10 }}>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ lineHeight: 25, color: 'gray' }}>{'00:00'}</Text>
            <Text style={{ lineHeight: 25, color: 'gray' }}>{duration || "00:00"}</Text>
          </View>
        </View>
      </View>
    );
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
        <TouchableOpacity style={styles.playerButton} onPress={() => this.props.random()}>
          <Text style={{ fontSize: 40, color: this.props.randomActive ? '#ffa500' : 'white' }}>{'x'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.playerButton} onPress={this.props.backward}>
          <Text style={{ fontSize: 40, color: 'white' }}>{'<<'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.playerButton} onPress={() => this.props.playPause()}>
          <Text style={{ fontSize: 40, color: 'white' }}>{this.props.playing ? '||' : '>'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.playerButton} onPress={this.props.forward}>
          <Text style={{ fontSize: 40, color: 'white' }}>{'>>'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.playerButton} onPress={() => this.props.repeat()}>
          <Text style={{ fontSize: 40, color: 'white' }}>{this._getRepeatIcon()}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  _getRepeatIcon() {
    switch (this.props.repeatMode) {
      case 'ONE':
        return 'R1';
      case 'ALL':
        return 'RA';
      default:
        return 'R0';
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2E2E2E'
  },
  header: {
    position: 'absolute',
    top: 0,
    width: Dimensions.get('window').width,
    backgroundColor: 'transparent',
  },
  left: {
    flex: 1,
    alignSelf: 'center',
    alignItems: 'flex-start',
  },
  right: {
    flex: 1,
    alignSelf: 'center',
    alignItems: 'flex-end',
  },
  row: {
    flexDirection: 'row',
  },
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
    backgroundColor: '#2E2E2E',
    paddingHorizontal: 20,
    paddingVertical: 10
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
    marginBottom: 20,
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
    currentIndex: state.player.currentIndex,
    queue: state.player.queue,
    randomActive: state.player.randomActive,
    playing: state.player.playing,
    repeatMode: state.player.repeatMode,
    showMenu: state.player.showMenu,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    load: (queue, initialSong) => playerActions.load(queue, initialSong)(dispatch),
    setMenu: () => dispatch(playerActions.setMenu()),
    songChanged: (song) => playerActions.songChanged(song, null)(dispatch),
    random: () => dispatch(playerActions.random()),
    repeat: () => dispatch(playerActions.repeat()),
    playPause: () => dispatch(playerActions.playPause()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Player);