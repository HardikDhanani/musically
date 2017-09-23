import LocalService from '../../services/LocalService';
import PlayerService from '../../services/PlayerService';
import MusicControl from 'react-native-music-control';

MusicControl.enableControl('play', true);
MusicControl.enableControl('pause', true);
MusicControl.enableControl('stop', false);
MusicControl.enableControl('nextTrack', true);
MusicControl.enableControl('previousTrack', true);

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

export const progressChanged = (newElapsed) => {
  return {
    type: 'PLAYER_PROGRESS_CHANGED',
    payload: {
      newElapsed
    }
  }
}

export const setMenu = () => {
  return {
    type: 'PLAYER_SET_MENU'
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

export const random = () => {
  return {
    type: 'PLAYER_RAMDOM'
  }
}

export const repeat = () => {
  return {
    type: 'PLAYER_REPEAT'
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

export function load(queue, initialSong) {
  return dispatch => {
    dispatch(loading())

    let initQueue = [];
    let initSong = null;
    let initIndex = 0;
    LocalService.getSession()
      .then(session => {
        if (queue)
          session.queue = queue;

        if (initialSong) {
          session.currentSong = initialSong;
          session.currentIndex = session.queue.findIndex(s => s.id === initialSong.id);
        } else {
          session.currentSong = session.queue[0];
          session.currentIndex = 0;
        }

        initQueue = session.queue;
        initSong = session.currentSong;
        initIndex = session.currentIndex;

        return LocalService.saveSession(session);
      })
      .then(() => {
        dispatch(loadingSuccess(initQueue, initSong, initIndex));
      })
      .catch(error => console.log(error));
  }
}

export function addToQueue(queue) {
  return dispatch => {
    LocalService.getSession()
      .then(session => {
        session.queue = session.queue.concat(queue);
        return LocalService.saveSession(session);
      })
      .then(() => dispatch(addToQueueAction(queue)))
      .catch(error => console.log(error));
  }
}

export function next() {
  return dispatch => {
    let currentSong = null;
    let currentIndex = 0;
    let endReached = false;

    LocalService.getSession()
      .then(session => {
        currentSong = session.currentSong;
        currentIndex = session.currentIndex;
        if (currentIndex < session.queue.length - 1) {
          currentSong = session.queue[currentIndex + 1];
          currentIndex = currentIndex + 1;
        } else {
          endReached = true;
          isPlaying = false;
        }

        session.currentSong = currentSong;
        session.currentIndex = currentIndex;
        return LocalService.saveSession(session);
      })
      .then(() => !endReached ? PlayerService.loadSong(currentSong.path) : Promise.resolve())
      .then(() => (isPlaying && !endReached) ? PlayerService.play(() => next()(dispatch)) : Promise.resolve())
      .then(() => dispatch(!endReached ? songChangedAction(currentSong, currentIndex) : playAndNotifyProgress(dispatch)))
      .catch(error => console.log(error));
  }
}

export function prev() {
  return dispatch => {
    let currentSong = null;
    let currentIndex = 0;

    LocalService.getSession()
      .then(session => {
        currentSong = session.currentSong;
        currentIndex = session.currentIndex;
        if (currentIndex > 0) {
          currentSong = session.queue[currentIndex - 1];
          currentIndex = currentIndex - 1;
        } else {
          endReached = true;
        }

        session.currentSong = currentSong;
        session.currentIndex = currentIndex;
        return LocalService.saveSession(session);
      })
      .then(() => PlayerService.loadSong(currentSong.path))
      .then(() => isPlaying ? PlayerService.play() : Promise.resolve())
      .then(() => dispatch(songChangedAction(currentSong, currentIndex)))
      .catch(error => console.log(error));
  }
}

export const songChanged = (currentSong, currentIndex) => {
  return dispatch => {
    LocalService.getSession()
      .then(session => {
        if (currentIndex === null || currentIndex === undefined) {
          currentIndex = session.queue.findIndex(s => s.id === currentSong.id);

          if (currentIndex === -1)
            currentIndex = session.currentIndex;
        }

        session.currentSong = currentSong;
        session.currentIndex = currentIndex;
        return LocalService.saveSession(session);
      })
      .then(() => dispatch(songChangedAction(currentSong, currentIndex)))
      .catch(error => console.log(error));
  }
}

let isPlaying = false;

export const playPause = (currentSong) => {
  return dispatch => {

    if (isPlaying) {
      PlayerService.pause()
        .then(() => {
          stopAndStopNotifyProgress(dispatch);
        });
    } else {
      if (!PlayerService.isSongLoaded()) {
        PlayerService.loadSong(currentSong.path)
          .then(() => PlayerService.play(() => next()(dispatch)))
          .then(() => {

            MusicControl.setNowPlaying({
              title: currentSong.title,
              artwork: currentSong.cover, // URL or RN's image require()
              artist: currentSong.artist,
              album: currentSong.album,
              genre: currentSong.genre,
              duration: parseFloat(currentSong.duration) / 1000, // (Seconds)
              // description: '', // Android Only
              color: 0x2E2E2E, // Notification Color - Android Only
              // date: '1983-01-02T00:00:00Z', // Release Date (RFC 3339) - Android Only
              // rating: 84, // Android Only (Boolean or Number depending on the type)
              // notificationIcon: 'my_custom_icon' // Android Only (String), Android Drawable resource name for a custom notification icon
            });

            playAndNotifyProgress(dispatch);
          });
      } else {
        PlayerService.play(() => next()(dispatch))
          .then(() => {
            MusicControl.setNowPlaying({
              title: currentSong.title,
              artwork: currentSong.cover, // URL or RN's image require()
              artist: currentSong.artist,
              album: currentSong.album,
              genre: currentSong.genre,
              duration: parseFloat(currentSong.duration) / 1000, // (Seconds)
              // description: '', // Android Only
              color: 0x2E2E2E, // Notification Color - Android Only
              // date: '1983-01-02T00:00:00Z', // Release Date (RFC 3339) - Android Only
              // rating: 84, // Android Only (Boolean or Number depending on the type)
              // notificationIcon: 'my_custom_icon' // Android Only (String), Android Drawable resource name for a custom notification icon
            });

            playAndNotifyProgress(dispatch);
          });
      }
    }
  }
}

let timer = null;
const playAndNotifyProgress = (dispatch) => {
  isPlaying = true;
  dispatch(play());
  timer = setInterval(() => dispatch(timeElapsed(500)), 500);
}

const stopAndStopNotifyProgress = (dispatch) => {
  isPlaying = false;
  clearInterval(timer);
  dispatch(pause());
}