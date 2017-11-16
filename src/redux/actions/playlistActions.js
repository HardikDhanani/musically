import LocalService from '../../services/LocalService';

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

    LocalService.getPlaylistById(playlistId)
      .then(playlist => {
        var index = playlist.songs.findIndex(s => s.id === songId);
        if (index !== -1) {
          playlist.songs.splice(index, 1);
        }
        LocalService.savePlaylist(playlist)
          .then(() => {
            dispatch(removingSongSuccess(playlist));
          });
      });
  }
}