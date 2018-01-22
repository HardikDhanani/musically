import LocalService from '../../services/LocalService';
import * as appActions from './appActions';
import playlist from '../reducers/playlist';

const loading = () => {
  return {
    type: 'PLAYLIST_SELECTOR_LOADING'
  }
}

const loadingSuccess = (songToAdd, playlists) => {
  return {
    type: 'PLAYLIST_SELECTOR_LOADING_SUCCESS',
    payload: {
      songToAdd,
      playlists
    }
  }
}

const loadingError = () => {
  return {
    type: 'PLAYLIST_SELECTOR_LOADING_ERROR'
  }
}

const addSongToPlaylist = (song) => {
  return {
    type: 'PLAYLIST_SELECTOR_ADD_SONG_TO_PLAYLIST',
    payload: {
      song
    }
  }
}

const showAddPlaylistSuccess = (song, playlist) => {
  return {
    type: 'PLAYLIST_SELECTOR_SHOW_ADD_PLAYLIST_SUCCESS',
    payload: {
      song,
      playlist
    }
  }
}

const hideAddPlaylistSuccess = () => {
  return {
    type: 'PLAYLIST_SELECTOR_HIDE_ADD_PLAYLIST_SUCCESS'
  }
}

export const addNewPlaylist = () => {
  return {
    type: 'PLAYLIST_SELECTOR_ADD_NEW_PLAYLIST'
  }
}

export const cancelAddNewPlaylistForm = () => {
  return {
    type: 'PLAYLIST_SELECTOR_CANCEL_ADD_NEW_PLAYLIST'
  }
}

export const selectPlaylist = (playlist) => {
  return {
    type: 'PLAYLIST_SELECTOR_PLAYLIST_SELECTED',
    payload: {
      playlist
    }
  }
}

export const formClosed = () => {
  return {
    type: 'PLAYLIST_SELECTOR_FORM_CLOSED'
  }
}

/****************************************************************/

export const createNewPlaylistForm = () => {
  return {
    type: 'PLAYLIST_SELECTOR_CREATE_NEW_PLAYLIST'
  }
}

export const closeNewPlaylistForm = () => {
  return {
    type: 'PLAYLIST_SELECTOR_CLOSE_NEW_PLAYLIST'
  }
}
/****************************************************************/

export function load(songToAdd, exclude = null) {
  return dispatch => {
    dispatch(loading())

    if (!songToAdd) {
      dispatch(loadingError());
    } else {
      LocalService.getUserPlaylists()
        .then(playlists => {
          if (exclude) {
            playlists = playlists.filter(exclude);
          }

          dispatch(loadingSuccess(songToAdd, playlists));
        });
    }
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

export function createNewPlaylistAndAddSong(playlistName, song) {
  return dispatch => {
    LocalService.getPlaylistByName(playlistName)
      .then(playlist => {
        let playlistToCreate = null;
        if (playlist) {
          playlistToCreate = playlist;
        } else {
          playlistToCreate = {
            name: playlistName,
            songs: []
          }
        }

        playlistToCreate.songs.push(song)

        LocalService.savePlaylist(playlistToCreate)
          .then(LocalService.getPlaylists)
          .then(playlists => {
            dispatch(appActions.playlistSaved(playlists));

            dispatch(showAddPlaylistSuccess(song, playlistToCreate));
            setTimeout(() => {
              dispatch(hideAddPlaylistSuccess());
            }, 4500);
          })
          .catch(error => {
            console.log('error in albumActions.createNewPlaylistAndAddSong - line 84 - Error: ' + error);
          });
      });
  }
}
