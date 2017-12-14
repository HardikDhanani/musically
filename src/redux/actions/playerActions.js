import LocalService from '../../services/LocalService';
import MusicPlayerService, { Events, RepeatModes, Track } from 'react-native-music-player-service';

import * as appActions from './appActions';

let _musicPlayerService = new MusicPlayerService(true, { color: 0x2E2E2E });
let timer = null;


/* Internal actions */
const loading = () => {
  return {
    type: 'PLAYER_LOADING'
  }
}

const loadingSuccess = (queue, currentSong, currentIndex) => {
  return {
    type: 'PLAYER_LOADING_SUCCESS',
    payload: {
      queue,
      currentSong,
      currentIndex
    }
  }
}

const loadingError = () => {
  return {
    type: 'PLAYER_LOADING_ERROR'
  }
}

const pause = () => {
  return {
    type: 'PLAYER_PAUSE'
  }
}

const play = () => {
  return {
    type: 'PLAYER_PLAY'
  }
}

const stop = () => {
  return {
    type: 'PLAYER_STOP'
  }
}

const songEnded = () => {
  return {
    type: 'PLAYER_SONG_ENDED'
  }
}

const timeElapsed = (elapsedTime) => {
  return {
    type: 'PLAYER_TIME_ELAPSED',
    payload: {
      elapsedTime
    }
  }
}

const songChangedAction = (currentSong, currentIndex) => {
  return {
    type: 'PLAYER_SONG_CHANGED',
    payload: {
      currentSong,
      currentIndex
    }
  }
}

const addToQueueAction = (queue) => {
  return {
    type: 'PLAYER_ADD_TO_QUEUE',
    payload: {
      queue
    }
  }
}

const randomAction = (randomValue) => {
  return {
    type: 'PLAYER_RAMDOM',
    payload: {
      random: randomValue
    }
  }
}

const repeatAction = (mode) => {
  return {
    type: 'PLAYER_REPEAT',
    payload: {
      mode
    }
  }
}

/* Internal methods */
const _startNotifyingProgress = (dispatch) => {
  timer = setInterval(() => {
    _musicPlayerService.getCurrentTime()
      .then(currentTime => {
        dispatch(timeElapsed(currentTime / 1000));
      });
  }, 500);
}

const _stopNotifyingProgress = (dispatch) => {
  clearInterval(timer);
}

const _updateMostPlayedPlaylist = (song, dispatch) => {
  return LocalService.getPlaylistByName('Most played')
    .then(playlist => {
      let index = playlist.songs.findIndex(s => s.id === song.id);
      if (index !== -1) {
        appActions.updateSongInPlaylist(song, playlist)(dispatch);
      } else {
        appActions.addSongToPlaylist(song, playlist)(dispatch);
      }
    });
}

const _updateRecentPlayedPlaylist = (song, dispatch) => {
  return LocalService.getPlaylistByName('Recent played')
    .then(playlist => {
      let index = playlist.songs.findIndex(s => s.id === song.id);
      if (index !== -1) {
        playlist.songs.splice(index, 1);
      }

      playlist.songs = [song].concat(playlist.songs).slice(0, 20);

      return LocalService.savePlaylist(playlist)
    })
    .then(() => appActions.updatePlaylists()(dispatch));
}

const _trackChanged = (track, dispatch) => {
  let currentSong = null;
  let currentIndex = 0;

  LocalService.getSession()
    .then(session => {
      session.currentSong = track.additionalInfo;
      session.currentIndex = track.position;

      currentSong = track.additionalInfo;
      currentIndex = track.position;

      return LocalService.saveSession(session);
    })
    .then(() => {
      dispatch(songChangedAction(currentSong, currentIndex));

      // if (isPlaying) {
      //   playAndNotifyProgress(dispatch);
      // }
    });
}

const _mapTrack = (song) => {
  let additionalInfo = {
    ...song,
    artwork: song.cover,
    duration: parseFloat(song.duration) / 1000
  }
  return new Track({ id: song.id, path: song.path, additionalInfo });
}

/* Public Constants Actions */
export const progressChanged = (newElapsed) => {
  return {
    type: 'PLAYER_PROGRESS_CHANGED',
    payload: {
      newElapsed
    }
  }
}

/* Public Functions Actions */
export const load = (queue, startPlaying) => {
  return dispatch => {
    dispatch(loading())

    let currentQueue = null;
    let currentIndex = null;
    LocalService.getSession()
      .then(session => {
        if (queue) {
          currentQueue = queue;
          currentIndex = 0;

          session.queue = currentQueue;
          session.currentSong = currentQueue[0];
          session.currentIndex = currentIndex;

          return LocalService.saveSession(session)
            .then(() => {
              let tracks = currentQueue.map(s => new Track({ id: s.id, path: s.path, additionalInfo: s }));
              return _musicPlayerService.setQueue(tracks);
            })
            .then(() => {
              if (startPlaying) {
                return _musicPlayerService.togglePlayPause();
              } else {
                return Promise.resolve();
              }
            });
        } else {
          currentQueue = session.queue;
          currentIndex = session.currentIndex;

          return Promise.resolve();
        }
      })
      .then(() => {
        dispatch(loadingSuccess(currentQueue, currentQueue[currentIndex], currentIndex));
      })
      .catch(error => console.log(error));
  }
}

export const addToQueue = (queue) => {
  return dispatch => {
    let newSession = null;

    LocalService.getSession()
      .then(session => {
        newSession = session;

        let tracks = queue.map(_mapTrack);
        return _musicPlayerService.appendToQueue(tracks, session.currentIndex !== -1 ? (session.currentIndex + 1) : null)
      })
      .then(returnedQueue => {
        newSession.queue = returnedQueue.map(t => t.additionalInfo);
        return LocalService.saveSession(newSession);
      })
      .then(() => {
        dispatch(addToQueueAction(newSession.queue));
      })
      .catch(error => {
        console.log(error);
      });
  }
}

export const next = () => {
  return dispatch => {
    _musicPlayerService.playNext();
  }
}

export const prev = () => {
  return dispatch => {
    _musicPlayerService.playPrev();
  }
}

export const playPause = () => {
  return dispatch => {
    _musicPlayerService.togglePlayPause();
  }
}

export const initPlayer = () => {
  return dispatch => {
    _musicPlayerService.addEventListener(Events.Play, currentTrack => {
      _startNotifyingProgress(dispatch);
      _updateMostPlayedPlaylist(currentTrack.additionalInfo, dispatch);
      _updateRecentPlayedPlaylist(currentTrack.additionalInfo, dispatch);
      dispatch(play());
    });

    _musicPlayerService.addEventListener(Events.Pause, () => {
      _stopNotifyingProgress(dispatch);
      dispatch(pause());
    });

    _musicPlayerService.addEventListener(Events.Next, nextTrack => {
      _trackChanged(nextTrack, dispatch)
    });

    _musicPlayerService.addEventListener(Events.Previous, prevTrack => {
      _trackChanged(prevTrack, dispatch)
    });

    LocalService.getSession()
      .then(session => {
        let tracks = session.queue.map(_mapTrack);
        return _musicPlayerService.setQueue(tracks);
      });
  }
}

export const random = () => {
  return dispatch => {
    let isRandom = _musicPlayerService.toggleRandom();
    dispatch(randomAction(isRandom));
  }
}

export const repeat = () => {
  return dispatch => {
    let repeatMode = RepeatModes.None;
    switch (_musicPlayerService.repeatMode) {
      case RepeatModes.None:
        repeatMode = RepeatModes.All
        break;
      case RepeatModes.All:
        repeatMode = RepeatModes.One
        break;
    }

    _musicPlayerService.setRepeatMode(repeatMode);
    dispatch(repeatAction(repeatMode));
  }
}