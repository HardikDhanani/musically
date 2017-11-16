// @flow

import Sound from 'react-native-sound';

var _songPlaying: ?Sound = null;

class PlayerService {
  constructor() {
    this.loadSong = this.loadSong.bind(this);
    this.play = this.play.bind(this);
  }

  isSongLoaded(): boolean {
    return _songPlaying != null;
  }

  loadSong(filePath: string): Promise<any> {
    return new Promise((resolve: Function, reject: Function) => {
      if (_songPlaying) {
        _songPlaying.release();
      }

      _songPlaying = new Sound(filePath, Sound.LIBRARY, (error) => {
        if (error) {
          console.log('failed to load the sound', error);
          reject(error);
        } else {
          // loaded successfully
          //console.log('duration in seconds: ' + _songPlaying.getDuration() + 'number of channels: ' + this._songPlaying.getNumberOfChannels());
          resolve(_songPlaying.getDuration());
        }
      });
    });
  }

  play(playNext: Function): Promise<any> {
    return new Promise((resolve: Function, reject: Function) => {
      if (_songPlaying) {
        _songPlaying.play((success) => {
          if (success) {
            console.log('successfully finished playing');
            _songPlaying.release();
            if (playNext)
              playNext();
          } else {
            console.log('playback failed due to audio decoding errors');
            // reset the player to its uninitialized state (android only)
            // this is the only option to recover after an error occured and use the player again
            _songPlaying.reset();
          }
        });
        resolve();
      } else {
        console.log('No song loaded');
        reject('No song loaded.');
      }
    });
  }

  pause(): Promise<any> {
    return new Promise((resolve: Function, reject: Function) => {
      if (_songPlaying) {
        _songPlaying.pause();
        resolve();
      } else {
        console.log('No song playing');
        reject('No song playing');
      }
    });
  }

  stop(): Promise<any> {
    return new Promise((resolve: Function, reject: Function) => {
      if (_songPlaying)
        _songPlaying.stop();
        
      resolve();
    });
  }

  getCurrentTime(): Promise<number> {
    return new Promise((resolve, reject) => {
      if (!_songPlaying) {
        return reject(0);
      }

      _songPlaying.getCurrentTime(seconds => {
        return resolve(seconds * 1000);
      });
    });
  }
}

let playerService = new PlayerService();

export default playerService;