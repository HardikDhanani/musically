import LocalService from '../../services/LocalService';
import MusicPlayerService, { Events, RepeatModes, Track } from 'react-native-music-player-service';

import * as appActions from './appActions';
import * as mostPlayedActions from './mostPlayedActions';
import * as recentlyPlayedActions from './recentlyPlayedActions';

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

const addToQueueAction = (queue, currentIndex) => {
  return {
    type: 'PLAYER_ADD_TO_QUEUE',
    payload: {
      queue,
      currentIndex
    }
  }
}

const shuffleAction = (shuffle) => {
  return {
    type: 'PLAYER_RAMDOM',
    payload: {
      shuffle
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

const queueUpdated = (queue, currentSong, currentIndex) => {
  return {
    type: 'PLAYER_QUEUE_UPDATED',
    payload: {
      queue,
      currentSong,
      currentIndex
    }
  }
}

/* Internal methods */
const _startNotifyingProgress = (dispatch) => {
  timer = setInterval(() => {
    _musicPlayerService.getCurrentTime()
      .then(currentTime => {
        dispatch(timeElapsed(currentTime * 1000));
      });
  }, 500);
}

const _stopNotifyingProgress = (dispatch) => {
  clearInterval(timer);
}

const _updateSong = (song, dispatch) => {
  LocalService.saveSong(song);
  let getAlbumPromise = LocalService.getAlbumByName(song.album, song.artist);
  let getArtistPromise = LocalService.getArtistByName(song.artist);

  Promise.all([getAlbumPromise, getArtistPromise])
    .then(result => {
      let album = result[0];
      let artist = result[1];

      album.songs = album.songs.map(s => s.id === song.id ? song : s);
      artist.albums = artist.albums.map(a => a.id === album.id ? album : a);

      LocalService.saveArtist(artist);
      LocalService.saveAlbum(album);
    });
}

const _updateQueue = (song, dispatch) => {
  LocalService.getSession()
    .then(session => {

      let index = session.queue.findIndex(s => s.id === song.id);
      if (index !== -1) {
        session.queue[index] = song;
      }

      return LocalService.saveSession(session);
    })
    .then(session => {
      dispatch(queueUpdated(session.queue, session.queue[session.currentIndex], session.currentIndex));
    });
}

const _updateMostPlayedPlaylist = (song, dispatch) => {
  LocalService.getMostPlayed()
    .then(mostPlayed => {

      let index = mostPlayed.findIndex(s => s.id === song.id);
      if (index !== -1) {
        mostPlayed[index] = song;
      } else {
        mostPlayed.push(song);
      }

      return LocalService.saveMostPlayed(mostPlayed);
    })
    .then(() => {
      mostPlayedActions.update()(dispatch);
    });
}

const _updateRecentPlayedPlaylist = (song, dispatch) => {
  return LocalService.getRecentlyPlayed()
    .then(recentlyPlayed => {
      let index = recentlyPlayed.findIndex(s => s.id === song.id);
      if (index !== -1) {
        recentlyPlayed.splice(index, 1);
      }

      recentlyPlayed = [song].concat(recentlyPlayed)

      return LocalService.saveRecentlyPlayed(recentlyPlayed)
    })
    .then(() => {
      recentlyPlayedActions.update()(dispatch);
    });
}

const _trackChanged = (song, position, dispatch) => {
  LocalService.getSession()
    .then(session => {
      session.currentSong = song;
      session.currentIndex = position;

      return LocalService.saveSession(session);
    })
    .then(() => {
      dispatch(songChangedAction(song, position));
    });
}

const _mapTrack = (song) => {
  let additionalInfo = {
    ...song,
    artwork: song.cover,
    duration: parseFloat(song.duration)
  }
  return new Track({ id: song.id, path: song.path, additionalInfo });
}

const _udpdateStatistics = (song, dispatch) => {
  song.reproductions += 1;

  _updateSong(song, dispatch);
  _updateQueue(song, dispatch);
  _updateMostPlayedPlaylist(song, dispatch);
  _updateRecentPlayedPlaylist(song, dispatch);

  return Promise.resolve(song);
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
export const load = (queue, startPlaying, shuffle) => {
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
            })
            .then(() => {
              if (shuffle && !_musicPlayerService.random) {
                _musicPlayerService.toggleRandom();
              }

              dispatch(shuffleAction(_musicPlayerService.random))
              return Promise.resolve();
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
      .catch(error => {
        console.log(error)
      });
  }
}

export const addToQueue = (queue) => {
  return dispatch => {
    let newSession = null;

    LocalService.getSession()
      .then(session => {
        newSession = session;
        let tracks = queue.map(_mapTrack);

        return _musicPlayerService.appendToQueue(tracks, _musicPlayerService.currentIndex + 1);
      })
      .then(returnedQueue => {
        newSession.queue = returnedQueue.map(t => t.additionalInfo);
        newSession.currentIndex = _musicPlayerService.currentIndex;
        newSession.currentSong = newSession.queue[newSession.currentIndex];
        return LocalService.saveSession(newSession);
      })
      .then(() => {
        dispatch(addToQueueAction(newSession.queue, newSession.currentIndex));
      })
      .catch(error => {
        console.log(error);
      });
  }
}

export const removeFromQueue = (songsToRemove) => {
  return dispatch => {
    let toRemove = songsToRemove.map(s => s.id);
    _musicPlayerService.removeFromQueue(toRemove)
      .then(returnedQueue => {
        return LocalService.getSession();
      })
      .then(session => {
        session.currentIndex = _musicPlayerService.currentIndex;
        if (_musicPlayerService.queue.length > 0) {
          session.currentSong = _musicPlayerService.queue[_musicPlayerService.currentIndex].additionalInfo;
        } else {
          session.currentSong = null;
        }

        return LocalService.saveSession(session);
      })
      .then(session => {
        dispatch(queueUpdated(session.queue, session.queue[session.currentIndex], session.currentIndex));
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
    if (_musicPlayerService.queue.length > 0) {
      _musicPlayerService.togglePlayPause();
    }
  }
}

export const initPlayer = () => {
  return dispatch => {
    _musicPlayerService.addEventListener(Events.Play, currentTrack => {
      _startNotifyingProgress(dispatch);

      _udpdateStatistics(currentTrack.additionalInfo, dispatch)
        .then(song => dispatch(play()));
    });

    _musicPlayerService.addEventListener(Events.Pause, () => {
      _stopNotifyingProgress(dispatch);
      dispatch(pause());
    });

    _musicPlayerService.addEventListener(Events.Next, nextTrack => {
      _trackChanged(nextTrack.additionalInfo, nextTrack.position, dispatch)
    });

    _musicPlayerService.addEventListener(Events.Previous, prevTrack => {
      _trackChanged(prevTrack.additionalInfo, prevTrack.position, dispatch)
    });

    let session = null;
    LocalService.getSession()
      .then(ses => {
        session = ses;

        if (session.queue && session.queue.length) {
          let tracks = session.queue.map(_mapTrack);
          return _musicPlayerService.setQueue(tracks);
        } else {
          return Promise.resolve([]);
        }
      })
      .then(returnedQueue => {
        let index = parseInt(session.currentIndex)
        if (index > -1) {
          _musicPlayerService.setCurrentIndex(index);
        }
      });
  }
}

export const shuffle = () => {
  return dispatch => {
    let isRandom = _musicPlayerService.toggleRandom();
    dispatch(shuffleAction(isRandom));
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

export const playSongs = (params) => {
  // { songs: [song], addToQueueIfNotExists: true }

}