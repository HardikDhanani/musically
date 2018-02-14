import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import MusicFiles from 'react-native-get-music-files';

import * as appActions from '../redux/actions/appActions';

import {
  View,
  StatusBar,
  DeviceEventEmitter
} from 'react-native';
import Navigator from './Navigator';

class Root extends Component {
  componentWillMount() {
    DeviceEventEmitter.addListener(
      'onBatchReceived',
      params => {
        this.props.songsRead(params.batch, params.total);
        if (params.current === params.total) {
          this.props.scanningSongsFinished();
        }
      }
    );

    this.props.start();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.scanForSongs && !nextProps.scanningSongs) {
      this.props.scanningSongsStarted();

      MusicFiles.getAll({
        id: true,
        blured: false,
        album: true,
        artist: true,
        duration: true, //default : true
        cover: false, //default : true,
        title: true,
        date: false,
        lyrics: false,
        batchNumber: 10,
        minimumSongDuration: 10000, //in miliseconds
      });
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar backgroundColor={'transparent'} translucent={true} barStyle='light-content' />
        <Navigator />
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    scanForSongs: state.app.scanForSongs,
    scanningSongs: state.app.scanningSongs
  }
}

const mapDispatchToProps = dispatch => {
  return {
    start: () => appActions.start()(dispatch),
    songsRead: (songs) => appActions.songsRead(songs)(dispatch),
    scanningSongsStarted: () => appActions.scanningSongsStarted()(dispatch),
    scanningSongsFinished: () => appActions.scanningSongsFinished()(dispatch)
  }
}

Root.propTypes = {
  start: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(Root);