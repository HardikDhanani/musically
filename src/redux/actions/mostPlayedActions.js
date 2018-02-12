import LocalService from '../../services/LocalService';

import * as appActions from './appActions';
import * as playerActions from './playerActions';
import * as favoritesActions from './favoritesActions';

/* Internal methods */

/* Internal actions */
const setDeleteModeOnAction = () => {
  return {
    type: 'MOST_PLAYED_SET_DELETE_MODE_ON'
  }
}

const setDeleteModeOffAction = () => {
  return {
    type: 'MOST_PLAYED_SET_DELETE_MODE_OFF'
  }
}

const onSelectAllPressAction = () => {
  return {
    type: 'MOST_PLAYED_SELECT_ALL_PRESSED'
  }
}

const selectSongAction = (id) => {
  return {
    type: 'MOST_PLAYED_SELECT_SONG',
    payload: {
      id
    }
  }
}

const showDeleteSongsConfirmationAction = () => {
  return {
    type: 'MOST_PLAYED_DELETE_SONGS_CONFIRMATION'
  }
}

const deleteSelectedSongsCancelAction = () => {
  return {
    type: 'MOST_PLAYED_DELETE_SONGS_CANCEL'
  }
}

const removingSongsSuccess = (songs) => {
  return {
    type: 'MOST_PLAYED_REMOVING_SONG_SUCCESS',
    payload: {
      songs
    }
  }
}

/* Public constant actions */
export const loading = () => {
  return {
    type: 'MOST_PLAYED_LOADING'
  }
}

export const loadingSuccess = (songs, length, reproductionsRequired) => {
  return {
    type: 'MOST_PLAYED_LOADING_SUCCESS',
    payload: {
      songs,
      length,
      reproductionsRequired
    }
  }
}

export const loadingError = (error) => {
  return {
    type: 'MOST_PLAYED_LOADING_ERROR',
    payload: {
      error
    }
  }
}

export const mostPlayedUpdated = (songs) => {
  return {
    type: 'MOST_PLAYED_UPDATED',
    payload: {
      songs
    }
  }
}

/* Public function actions */
export function load() {
  return dispatch => {
    dispatch(loading());

    let mostPlayedPromise = LocalService.getMostPlayed();
    let sessionPromise = LocalService.getSession();

    Promise.all([mostPlayedPromise, sessionPromise])
      .then(ret => {
        let mostPlayed = ret[0];
        let session = ret[1];

        dispatch(loadingSuccess(mostPlayed, session.mostPlayedLength, session.mostPlayedReproductions))
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
    dispatch(appActions.setMenu({ ...target, caller: 'MOST_PLAYED' }));
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
    LocalService.getMostPlayed()
      .then(mostPlayed => dispatch(mostPlayedUpdated(mostPlayed)));
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
    let mostPlayedEdited = null;
    LocalService.getMostPlayed()
      .then(mostPlayed => {
        let selectedSongs = songs.filter(s => s.selected);

        for (let i = 0; i < selectedSongs.length; i++) {
          let j = mostPlayed.findIndex(s => s.id === selectedSongs[i].id);
          mostPlayed.splice(j, 1);
        }

        mostPlayedEdited = mostPlayed;

        return LocalService.saveMostPlayed(mostPlayed);
      })
      .then(() => {
        dispatch(removingSongsSuccess(mostPlayedEdited));
      })
  }
}