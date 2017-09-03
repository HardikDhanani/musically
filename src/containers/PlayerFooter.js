import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as playerActions from '../redux/actions/playerActions';

import { StyleSheet, Text, TouchableWithoutFeedback, View, Platform, Dimensions, Image } from 'react-native';

import Button from '../components/Button';

class PlayerFooter extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    let currentId = this.props.currentSong ? this.props.currentSong.id : null;
    let newId = nextProps.currentSong ? nextProps.currentSong.id : null;

    return currentId !== newId;
  }

  render() {
    let title = this.props.currentSong ? this.props.currentSong.title : null;
    let artist = this.props.currentSong ? this.props.currentSong.artist : null;
    let source = (this.props.currentSong && this.props.currentSong.cover) ? { uri: this.props.currentSong.cover } : require('../images/music.png')

    return (
      <TouchableWithoutFeedback onPress={() => this.props.navigation.navigate('Player', { initialSong: this.props.currentSong })}>
        <View style={[styles.footer, this.props.style]}>
          <Image source={source} style={styles.image} />
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <View style={styles.progressBar} />
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <View style={styles.songSection}>
                <Text numberOfLines={1} style={styles.songSectionTitle}>{title}</Text>
                <Text numberOfLines={1} style={styles.songSectionText}>{artist}</Text>
              </View>
              <View style={styles.controlSection}>
                <Button text={'<<'} onPress={this.props.prev} />
                <Button text={this.props.playing ? '||' : '>'} onPress={this.props.playPause} />
                <Button text={'>>'} onPress={this.props.next} />
              </View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  footer: {
    height: 60,
    width: Dimensions.get('window').width,
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#2E2E2E'
  },
  image: {
    width: 60,
    height: 60,
  },
  songSection: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 15
  },
  songSectionTitle: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold'
  },
  songSectionText: {
    fontSize: 13,
    color: 'white',
  },
  controlSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    width: Dimensions.get('window').width - 60,
    height: 4,
    backgroundColor: 'gray'
  }
});

const mapStateToProps = state => {
  return {
    isReady: state.app.isReady,
    playing: state.player.playing,
    currentSong: state.player.currentSong,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    load: (queue) => playerActions.load(queue)(dispatch),
    songChanged: (song) => playerActions.songChanged(song, null)(dispatch),
    playPause: () => dispatch(playerActions.playPause()),
    next: () => playerActions.next()(dispatch),
    prev: () => playerActions.prev()(dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayerFooter);