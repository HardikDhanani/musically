import Sound from 'react-native-sound';

class PlayerService {
  constructor() {
    this._songPlaying = null;

    this.loadSong = this.loadSong.bind(this);
    this.play = this.play.bind(this);
  }

  isSongLoaded() {
    return this._songPlaying != null;
  }

  loadSong(filePath) {
    return new Promise((resolve, reject) => {
      if (this._songPlaying){

        this._songPlaying.release();
      }

      this._songPlaying = new Sound(filePath, Sound.LIBRARY, (error) => {
        if (error) {
          console.log('failed to load the sound', error);
          reject(error);
        } else {
          // loaded successfully
          console.log('duration in seconds: ' + this._songPlaying.getDuration() + 'number of channels: ' + this._songPlaying.getNumberOfChannels());
          resolve(this._songPlaying);
        }
      });
    });
  }

  play(playNext) {
    return new Promise((resolve, reject) => {
      if (this._songPlaying) {
        this._songPlaying.play((success) => {
          if (success) {
            console.log('successfully finished playing');
            this._songPlaying.release();
            if (playNext)
              playNext();
          } else {
            console.log('playback failed due to audio decoding errors');
            // reset the player to its uninitialized state (android only)
            // this is the only option to recover after an error occured and use the player again
            this._songPlaying.reset();
          }
        });
        resolve();
      } else {
        console.log('No song loaded');
        reject('No song loaded.');
      }
    });
  }

  pause() {
    return new Promise((resolve, reject) => {
      if (this._songPlaying) {
        this._songPlaying.pause();
        resolve();
      } else {
        console.log('No song playing');
        reject('No song playing');
      }
    });
  }

  stop() {
    return new Promise((resolve, reject) => {
      if (this._songPlaying) {
        this._songPlaying.stop();
        resolve();
      } else {
        console.log('No song playing');
        reject('No song playing');
      }
    });
  }
}

let playerService = new PlayerService();

export default playerService;