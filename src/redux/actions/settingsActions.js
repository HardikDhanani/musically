import LocalService from '../../services/LocalService';
import * as appActions from './appActions';
import playlistsSelector from '../selectors/playlists';
import playlist from '../reducers/playlist';

function _setPlaylistLength(key, value, playlistName) {
  return new Promise((resolve, reject) => {
    let session = null;
    LocalService.getSession()
      .then(sess => {
        session = sess;
        session[key] = parseInt(value);

        return LocalService.saveSession(session);
      })
      .then(LocalService.getPlaylists)
      .then(playlists => {
        if (playlistName = 'Most played') {
          playlistsSelector.setMostPlayedLengthOnPlaylists(playlists, value);
        } else {
          playlistsSelector.setRecentlyPlayedLengthOnPlaylists(playlists, value);
        }
        resolve(playlists);
      })
      .catch(reject);
  });
}

const loading = () => {
  return {
    type: 'SETTINGS_LOADING'
  }
}

const loadingSuccess = (recentlyPlayedLength, mostPlayedLength, mostPlayedReproductions) => {
  return {
    type: 'SETTINGS_LOADING_SUCCESS',
    payload: {
      recentlyPlayedLength,
      mostPlayedLength,
      mostPlayedReproductions
    }
  }
}

const loadingError = (error) => {
  return {
    type: 'SETTINGS_LOADING_ERROR',
    payload: {
      error
    }
  }
}

const languageChangedSuccess = () => {
  return {
    type: 'SETTINGS_LANGUAGE_CHANGED_SUCCESS'
  }
}

const mostPlayedReset = (playlists) => {
  return {
    type: 'SETTINGS_RESET_MOST_PLAYED_SUCCESS',
    payload: {
      playlists
    }
  }
}

const recentlyPlayedReset = (playlists) => {
  return {
    type: 'SETTINGS_RESET_RECENTLY_PLAYED_SUCCESS',
    payload: {
      playlists
    }
  }
}

const setRecentlyPlayedLengthSuccess = (recentlyPlayedLength, playlists) => {
  return {
    type: 'SETTINGS_SET_RECENTLY_PLAYED_LENGTH_SUCCESS',
    payload: {
      playlists,
      recentlyPlayedLength
    }
  }
}

const setMostPlayedLengthSuccess = (mostPlayedLength, playlists) => {
  return {
    type: 'SETTINGS_SET_MOST_PLAYED_LENGTH_SUCCESS',
    payload: {
      playlists,
      mostPlayedLength
    }
  }
}

const setMostPlayedReproductionsSuccess = (mostPlayedReproductions) => {
  return {
    type: 'SETTINGS_SET_MOST_PLAYED_REPRODUCTIONS_SUCCESS',
    payload: {
      mostPlayedReproductions
    }
  }
}

export const showSetSetting = (setting) => {
  return {
    type: 'SETTINGS_SHOW_SET_SETTING',
    payload: {
      setting
    }
  }
}

export const cancelShowSetSetting = () => {
  return {
    type: 'SETTINGS_CANCEL_SHOW_SET_SETTING'
  }
}

export function load() {
  return dispatch => {
    dispatch(loading())

    LocalService.getSession()
      .then(session => {
        let recentlyPlayedLength = session.recentlyPlayedLength || 0;
        let mostPlayedLength = session.mostPlayedLength || 0;
        let mostPlayedReproductions = session.mostPlayedReproductions || 0;

        dispatch(loadingSuccess(recentlyPlayedLength, mostPlayedLength, mostPlayedReproductions));
      })
      .catch(error => {
        dispatch(loadingError(error));
      });
  }
}

export function languageChanged(language) {
  return dispatch => {
    appActions.setLanguage(language)(dispatch);
    dispatch(languageChangedSuccess());
  }
}

export function resetMostPlayed() {
  return dispatch => {
    let playlist = null;
    LocalService.getPlaylistByName('Most Played')
      .then(pl => {
        playlist = pl;
        playlist.songs = [];
        return LocalService.savePlaylist(playlist);
      })
      .then(LocalService.getPlaylists)
      .then(playlists => dispatch(mostPlayedReset(playlists)));
  }
}

export function resetRecentlyPlayed() {
  return dispatch => {
    let playlist = null;
    LocalService.getPlaylistByName('Recently played')
      .then(pl => {
        playlist = pl;
        playlist.songs = [];
        return LocalService.savePlaylist(playlist);
      })
      .then(LocalService.getPlaylists)
      .then(playlists => dispatch(recentlyPlayedReset(playlists)));
  }
}

export function setRecentlyPlayedLength(recentlyPlayedLength) {
  return dispatch => {
    if (!recentlyPlayedLength) {
      return;
    }

    _setPlaylistLength('recentlyPlayedLength', recentlyPlayedLength, 'Recently played')
      .then(playlists => dispatch(setRecentlyPlayedLengthSuccess(recentlyPlayedLength, playlists)))
      .catch(error => {
        dispatch(loadingError(error));
      });
  }
}

export function setMostPlayedLength(mostPlayedLength) {
  return dispatch => {
    if (!mostPlayedLength) {
      return;
    }

    _setPlaylistLength('mostPlayedLength', mostPlayedLength, 'Most played')
      .then(playlists => dispatch(setMostPlayedLengthSuccess(mostPlayedLength, playlists)))
      .catch(error => {
        dispatch(loadingError(error));
      });
  }
}

export function setMostPlayedReproductions(reproductions) {
  return dispatch => {
    if (!reproductions) {
      return;
    }

    let session = null;
    LocalService.getSession()
      .then(sess => {
        session = sess;
        session.mostPlayedReproductions = parseInt(reproductions);

        return LocalService.saveSession(session);
      })
      .then(() => dispatch(setMostPlayedReproductionsSuccess(reproductions)));
  }
}