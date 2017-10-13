import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as playerActions from '../redux/actions/playerActions';

import { Text, TouchableWithoutFeedback, View, Dimensions, Image } from 'react-native';
import StyleManager from '../styles/StyleManager';

import Button from '../components/Button';
import ProgressBar from '../components/ProgressBar';
import PlayerFooterSongSection from '../components/PlayerFooterSongSection';
import PlayerFooterControlsSection from '../components/PlayerFooterControlsSection';

class PlayerFooter extends Component {
  constructor(props) {
    super(props);

    this._progressBar = this._progressBar.bind(this);
    this._containerStyle = StyleManager.getStyle('PlayerFooterContainer');
    this._imageStyle = StyleManager.getStyle('PlayerFooterImage');
  }

  shouldComponentUpdate(nextProps, nextState) {
    let currentId = this.props.currentSong ? this.props.currentSong.id : null;
    let newId = nextProps.currentSong ? nextProps.currentSong.id : null;

    return currentId !== newId
      || nextProps.playing != this.props.playing
      || nextProps.elapsedTime != this.props.elapsedTime;
  }

  render() {
    let title = this.props.currentSong ? this.props.currentSong.title : null;
    let artist = this.props.currentSong ? this.props.currentSong.artist : null;
    let source = (this.props.currentSong && this.props.currentSong.cover) ? { uri: this.props.currentSong.cover } : require('../images/music.png')

    return (
      <TouchableWithoutFeedback onPress={() => this.props.navigation.navigate('Player', { initialSong: this.props.currentSong })}>
        <View style={this._containerStyle}>
          <Image source={source} style={this._imageStyle} />
          <View style={{ flex: 1, flexDirection: 'column' }}>
            {this._progressBar()}
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <PlayerFooterSongSection title={title} artist={artist} />
              <PlayerFooterControlsSection
                playPauseText={this.props.playing ? '||' : '>'}
                onPrevPress={this.props.prev}
                onPlayPausePress={() => this.props.playPause(this.props.currentSong)}
                onNextPress={this.props.next} />
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  _progressBar() {
    let total = this.props.currentSong ? this.props.currentSong.duration : 0;

    return (
      <ProgressBar
        total={total}
        elapsed={this.props.elapsedTime}
        width={Dimensions.get('window').width}
        color={'#ffa500'}
        backgroundColor={'gray'}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    isReady: state.app.isReady,
    playing: state.player.playing,
    currentSong: state.player.currentSong,
    elapsedTime: state.player.elapsedTime,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    load: (queue) => playerActions.load(queue)(dispatch),
    songChanged: (song) => playerActions.songChanged(song, null)(dispatch),
    playPause: (currentSong) => dispatch(playerActions.playPause(currentSong)),
    next: () => playerActions.next()(dispatch),
    prev: () => playerActions.prev()(dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayerFooter);