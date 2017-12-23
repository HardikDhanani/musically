import LocalService from '../../services/LocalService';
import * as playerActions from './playerActions';

const loading = () => {
  return {
    type: 'QUEUE_LOADING'
  }
}

const loadingSuccess = (queue) => {
  return {
    type: 'QUEUE_LOADING_SUCCESS',
    payload: {
      queue
    }
  }
}

const loadingError = (error) => {
  return {
    type: 'QUEUE_LOADING_ERROR',
    payload: {
      error
    }
  }
}

const removingSong = () => {
  return {
    type: 'QUEUE_REMOVING_SONG'
  }
}

const removingSongSuccess = (queue) => {
  return {
    type: 'QUEUE_REMOVING_SONG_SUCCESS',
    payload: {
      queue
    }
  }
}

const removingSongError = (error) => {
  return {
    type: 'QUEUE_REMOVING_SONG_ERROR',
    payload: {
      error
    }
  }
}

const moveSongSuccess = (queue, songId, movedTo) => {
  return {
    type: 'QUEUE_MOVE_SONG_SUCCESS',
    payload: {
      queue,
      songId,
      movedTo
    }
  }
}

const moveSongError = (error) => {
  return {
    type: 'QUEUE_MOVE_SONG_ERROR',
    payload: {
      error
    }
  }
}

export function load() {
  return dispatch => {
    dispatch(loading())

    LocalService.getSession()
      .then(session => {
        dispatch(loadingSuccess(session.queue));
      })
      .catch(error => {
        dispatch(loadingError(error));
      });
  }
}

export function removeFromQueue(song) {
  return dispatch => {
    dispatch(removingSong())

    LocalService.getSession()
      .then(session => {
        let index = session.queue.findIndex(s => s.id === song.id);
        if (index > -1) {
          session.queue.splice(index, 1)
        };

        if (session.currentSong.id === song.id) {
          session.currentSong = session.queue[0];
          session.currentIndex = 0;
          dispatch(playerActions.songChanged(session.currentSong, session.currentIndex));
        }

        return LocalService.saveSession(session);
      })
      .then(session => {
        dispatch(removingSongSuccess(session.queue))
      })
      .catch(error => {
        dispatch(removingSongError(error));
      });
  }
}

export function moveSong(songId, from, to) {
  return dispatch => {
    LocalService.getSession()
      .then(session => {
        session.queue.splice(to, 0, session.queue.splice(from, 1)[0]);

        return LocalService.saveSession(session);
      })
      .then(session => {
        dispatch(moveSongSuccess(session.queue, songId, to))
      })
      .catch(error => {
        dispatch(moveSongError(error));
      });
  }
}
