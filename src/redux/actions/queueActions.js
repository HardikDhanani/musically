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

export const setDeleteModeOn = () => {
  return {
    type: 'QUEUE_SET_DELETE_MODE_ON'
  }
}

export const setDeleteModeOff = () => {
  return {
    type: 'QUEUE_SET_DELETE_MODE_OFF'
  }
}

export const selectSong = (id) => {
  return {
    type: 'QUEUE_SELECT_SONG',
    payload: {
      id
    }
  }
}

export const onSelectAllPress = () => {
  return {
    type: 'QUEUE_SELECT_ALL_PRESSED'
  }
}

export const showDeleteSongsConfirmation = () => {
  return {
    type: 'QUEUE_DELETE_SONGS_CONFIRMATION'
  }
}

export const deleteSelectedSongsCancel = () => {
  return {
    type: 'QUEUE_DELETE_SONGS_CANCEL'
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

        return LocalService.saveSession(session);
      })
      .then(session => {
        playerActions.removeFromQueue([song])(dispatch);
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

export function deleteSelectedSongs(queue) {
  return dispatch => {
    LocalService.getSession()
      .then(session => {
        let newQueue = queue.filter(s => !s.selected).map(s => {
          return {
            ...s,
            selected: undefined
          }
        });

        session.queue = newQueue;
        return LocalService.saveSession(session);
      })
      .then(session => {
        let songsToRemove = queue.filter(s => s.selected);
        dispatch(removingSongSuccess(session.queue));
        playerActions.removeFromQueue(songsToRemove)(dispatch);
      })
      .catch(error => {
        dispatch(removingSongError(error));
      });
  }
}
