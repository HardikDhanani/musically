import LocalService from '../../services/LocalService';
import * as favoritesActions from './favoritesActions';
import * as appActions from './appActions';

const _unlikeIfFavorite = (playlist, song, dispatch) => {
  if (song) {
    if (playlist.name.toLowerCase() === 'favorites') {
      song.isFavorite = true;
      favoritesActions.like('song', song, false)(dispatch);
    }
  }
}

const loading = () => {
  return {
    type: 'PLAYLIST_LOADING'
  }
}

const loadingSuccess = (playlist) => {
  return {
    type: 'PLAYLIST_LOADING_SUCCESS',
    payload: {
      playlist
    }
  }
}

const loadingError = () => {
  return {
    type: 'PLAYLIST_LOADING_ERROR'
  }
}

const removingSong = () => {
  return {
    type: 'PLAYLIST_REMOVING_SONG'
  }
}

const removingSongSuccess = (playlist) => {
  return {
    type: 'PLAYLIST_REMOVING_SONG_SUCCESS',
    payload: {
      playlist
    }
  }
}

const deletingPlaylist = () => {
  return {
    type: 'PLAYLIST_DELETING_PLAYLIST'
  }
}

const deletingPlaylistSuccess = () => {
  return {
    type: 'PLAYLIST_DELETING_PLAYLIST_SUCCESS'
  }
}

const closePlaylistForm = () => {
  return {
    type: 'PLAYLIST_CLOSE_PLAYLIST_FORM'
  }
}

const deletingPlaylistError = (error) => {
  return {
    type: 'PLAYLIST_DELETING_PLAYLIST_ERROR',
    payload: {
      error
    }
  }
}

const playlistsUpdated = (playlists) => {
  return {
    type: 'PLAYLIST_UPDATED',
    payload: {
      playlists
    }
  }
}

export const showMore = () => {
  return {
    type: 'PLAYLIST_SHOW_MORE'
  }
}

export const showSongMenu = (targetMenu) => {
  return {
    type: 'PLAYLIST_SHOW_SONG_MENU',
    payload: {
      targetMenu
    }
  }
}

export const hideSongMenu = () => {
  return {
    type: 'PLAYLIST_HIDE_SONG_MENU'
  }
}

export const showAddToPlaylist = () => {
  return {
    type: 'PLAYLIST_SHOW_ADD_TO_PLAYLIST_FORM'
  }
}

export const hideAddToPlaylist = () => {
  return {
    type: 'PLAYLIST_HIDE_ADD_TO_PLAYLIST_FORM'
  }
}

export const showDeletePlaylistConfirmation = () => {
  return {
    type: 'PLAYLIST_SHOW_DELETE_PLAYLIST_CONFIRMATION'
  }
}

export const cancelDeletePlaylistConfirmation = () => {
  return {
    type: 'PLAYLIST_CANCEL_SHOW_DELETE_PLAYLIST_CONFIRMATION'
  }
}

export function load(playlistId) {
  return dispatch => {
    dispatch(loading())

    LocalService.getPlaylistById(playlistId)
      .then(playlist => {
        dispatch(loadingSuccess(playlist));
      });
  }
}

export function removeSong(playlistId, songId) {
  return dispatch => {
    dispatch(removingSong());

    let playlist = null;
    let song = null;

    LocalService.getPlaylistById(playlistId)
      .then(pl => {
        playlist = pl;

        let index = playlist.songs.findIndex(s => s.id === songId);
        if (index !== -1) {
          song = playlist.songs[index];
          playlist.songs.splice(index, 1);
        }
        LocalService.savePlaylist(playlist)
          .then(() => {
            _unlikeIfFavorite(playlist, song, dispatch);
            appActions.updatePlaylists()(dispatch);
            dispatch(removingSongSuccess(playlist));
          });
      });
  }
}

export function deletePlaylist(playlist) {
  return dispatch => {
    if (!playlist) {
      dispatch(deletingPlaylistError({ message: 'PLaylist cannot be null' }));
    } else {
      dispatch(deletingPlaylist());
      LocalService.deletePlaylist(playlist)
        .then(() => {
          dispatch(deletingPlaylistSuccess());
          setTimeout(() => {
            dispatch(closePlaylistForm());
          }, 3000);
        })
        .then(LocalService.getPlaylists)
        .then(playlists => dispatch(playlistsUpdated(playlists)))
        .catch(error => dispatch(deletingPlaylistError(error)));
    }
  }
}