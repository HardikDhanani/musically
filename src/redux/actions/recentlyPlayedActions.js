import LocalService from '../../services/LocalService';

import * as appActions from './appActions';
import * as playerActions from './playerActions';
import * as favoritesActions from './favoritesActions';

/* Internal methods */

/* Internal actions */
const setDeleteModeOnAction = () => {
  return {
    type: 'RECENTLY_PLAYED_SET_DELETE_MODE_ON'
  }
}

const setDeleteModeOffAction = () => {
  return {
    type: 'RECENTLY_PLAYED_SET_DELETE_MODE_OFF'
  }
}

const onSelectAllPressAction = () => {
  return {
    type: 'RECENTLY_PLAYED_SELECT_ALL_PRESSED'
  }
}

const selectSongAction = (id) => {
  return {
    type: 'RECENTLY_PLAYED_SELECT_SONG',
    payload: {
      id
    }
  }
}

const showDeleteSongsConfirmationAction = () => {
  return {
    type: 'RECENTLY_PLAYED_DELETE_SONGS_CONFIRMATION'
  }
}

const deleteSelectedSongsCancelAction = () => {
  return {
    type: 'RECENTLY_PLAYED_DELETE_SONGS_CANCEL'
  }
}

const removingSongsSuccess = (songs) => {
  return {
    type: 'RECENTLY_PLAYED_REMOVING_SONG_SUCCESS',
    payload: {
      songs
    }
  }
}

/* Public constant actions */
export const loading = () => {
  return {
    type: 'RECENTLY_PLAYED_LOADING'
  }
}

export const loadingSuccess = (songs, length) => {
  return {
    type: 'RECENTLY_PLAYED_LOADING_SUCCESS',
    payload: {
      songs,
      length
    }
  }
}

export const loadingError = (error) => {
  return {
    type: 'RECENTLY_PLAYED_LOADING_ERROR',
    payload: {
      error
    }
  }
}

export const recentlyPlayedUpdated = (songs) => {
  return {
    type: 'RECENTLY_PLAYED_UPDATED',
    payload: {
      songs
    }
  }
}

/* Public function actions */
export function load() {
  return dispatch => {
    dispatch(loading());

    let recentlyPlayedPromise = LocalService.getRecentlyPlayed();
    let sessionPromise = LocalService.getSession();

    Promise.all([recentlyPlayedPromise, sessionPromise])
      .then(ret => {
        let recentlyPlayed = ret[0];
        let session = ret[1];

        dispatch(loadingSuccess(recentlyPlayed, session.recentlyPlayedLength))
      })
      .catch(err => {
        dispatch(loadingError(err));
      });
  }
}

export function like(type, target, removeFromFavorites = true) {
  return dispatch => {
    favoritesActions.like(type, target, removeFromFavorites)(dispatch);
  }
}

export function setMenu(target) {
  return dispatch => {
    dispatch(appActions.setMenu({ ...target, caller: 'RECENTLY_PLAYED' }));
  }
}

export function addToQueue(queue) {
  return dispatch => {
    playerActions.addToQueue(queue)(dispatch);
  }
}

export function removeSong(song) {
  return dispatch => {

  }
}

export function update() {
  return dispatch => {
    LocalService.getRecentlyPlayed()
      .then(recentlyPlayed => dispatch(recentlyPlayedUpdated(recentlyPlayed)));
  }
}

export function setDeleteModeOn() {
  return dispatch => {
    dispatch(setDeleteModeOnAction());
  }
}

export function setDeleteModeOff() {
  return dispatch => {
    dispatch(setDeleteModeOffAction());
  }
}

export function selectSong(id) {
  return dispatch => {
    dispatch(selectSongAction(id));
  }
}

export function onSelectAllPress() {
  return dispatch => {
    dispatch(onSelectAllPressAction());
  }
}

export function showDeleteSongsConfirmation() {
  return dispatch => {
    dispatch(showDeleteSongsConfirmationAction());
  }
}

export function deleteSelectedSongsCancel() {
  return dispatch => {
    dispatch(deleteSelectedSongsCancelAction());
  }
}

export function deleteSelectedSongs(songs) {
  return dispatch => {
    let recentlyPlayedEdited = null;
    LocalService.getRecentlyPlayed()
      .then(recentlyPlayed => {
        let selectedSongs = songs.filter(s => s.selected);

        for (let i = 0; i < selectedSongs.length; i++) {
          let j = recentlyPlayed.findIndex(s => s.id === selectedSongs[i].id);
          recentlyPlayed.splice(j, 1);
        }

        recentlyPlayedEdited = recentlyPlayed;

        return LocalService.saveRecentlyPlayed(recentlyPlayed);
      })
      .then(() => {
        dispatch(removingSongsSuccess(recentlyPlayedEdited));
      })
  }
}