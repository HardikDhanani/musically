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
