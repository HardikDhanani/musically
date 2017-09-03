import LocalService from '../../services/LocalService';

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

export const playPause = () => {
  return {
    type: 'PLAYER_PLAY_PAUSE'
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

    LocalService.getSession()
      .then(session => {
        currentSong = session.currentSong;
        currentIndex = session.currentIndex;
        if (currentIndex < session.queue.length - 1) {
          currentSong = session.queue[currentIndex + 1];
          currentIndex = currentIndex + 1;
        }

        session.currentSong = currentSong;
        session.currentIndex = currentIndex;
        return LocalService.saveSession(session);
      })
      .then(() => dispatch(songChangedAction(currentSong, currentIndex)))
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
        }

        session.currentSong = currentSong;
        session.currentIndex = currentIndex;
        return LocalService.saveSession(session);
      })
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