import LocalService from '../../services/LocalService';
import * as appActions from './appActions';

const showAddPlaylistSuccess = (song, playlist) => {
  return {
    type: 'HOME_SHOW_ADD_PLAYLIST_SUCCESS',
    payload: {
      song,
      playlist
    }
  }
}

const hideAddPlaylistSuccess = () => {
  return {
    type: 'HOME_HIDE_ADD_PLAYLIST_SUCCESS'
  }
}

export const createNewPlaylistForm = () => {
  return {
    type: 'HOME_CREATE_NEW_PLAYLIST'
  }
}

export const closeNewPlaylistForm = () => {
  return {
    type: 'HOME_CLOSE_NEW_PLAYLIST'
  }
}

export const sectionChanged = (section) => {
  return {
    type: 'SECTION_CHANGED',
    payload: {
      section
    }
  }
}

export const deletePlaylist = (playlist) => {
  return {
    type: 'HOME_DELETE_PLAYLIST',
    payload: {
      playlist
    }
  }
}

export const addSongToPlaylist = (song) => {
  return {
    type: 'HOME_ADD_SONG_TO_PLAYLIST',
    payload: {
      song
    }
  }
}

export const cancelAddSongToPlaylist = () => {
  return {
    type: 'HOME_CANCEL_ADD_SONG_TO_PLAYLIST'
  }
}

export const deletePlaylistCancel = () => {
  return {
    type: 'HOME_DELETE_PLAYLIST_CANCEL'
  }
}

export const addNewPlaylist = () => {
  return {
    type: 'HOME_ADD_NEW_PLAYLIST'
  }
}

export const cancelAddNewPlaylistForm = () => {
  return {
    type: 'HOME_CANCEL_ADD_NEW_PLAYLIST'
  }
}

export function selectedSectionChanged(section) {
  return dispatch => {
    dispatch(sectionChanged(section));
  }
}

export function newPlaylistConfirmed(playlistName) {
  return dispatch => {
    appActions.createNewPlaylist(playlistName)(dispatch);
  }
}

export function deletePlaylistConfirm(playlist) {
  return dispatch => {
    appActions.deletePlaylist(playlist)(dispatch);
  }
}

export function addSongToPlaylistConfirmed(song, playlist) {
  return dispatch => {
    appActions.addSongToPlaylist(song, playlist)(dispatch);
    dispatch(showAddPlaylistSuccess(song, playlist));
    setTimeout(() => {
      dispatch(hideAddPlaylistSuccess());
    }, 4500);
  }
}