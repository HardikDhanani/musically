import LocalService from '../../services/LocalService';
import * as playerActions from './playerActions';

const playlistsLoaded = (playlists) => {
  return {
    type: 'ARTIST_PLAYLISTS_LOADED',
    payload: {
      playlists
    }
  }
}

export const loading = () => {
  return {
    type: 'ARTIST_LOADING'
  }
}

export const loadingSuccess = (artist) => {
  return {
    type: 'ARTIST_LOADING_SUCCESS',
    payload: {
      artist
    }
  }
}

export const loadingError = () => {
  return {
    type: 'ARTIST_LOADING_ERROR'
  }
}

export const showMore = () => {
  return {
    type: 'ARTIST_SHOW_MORE'
  }
}

export const showSongMenu = (targetMenu) => {
  return {
    type: 'ARTIST_SHOW_SONG_MENU',
    payload: {
      targetMenu
    }
  }
}

export const hideSongMenu = () => {
  return {
    type: 'ARTIST_HIDE_SONG_MENU'
  }
}

export const showAddToPlaylist = () => {
  return {
    type: 'ARTIST_SHOW_ADD_TO_PLAYLIST_FORM'
  }
}

export const hideAddToPlaylist = () => {
  return {
    type: 'ARTIST_HIDE_ADD_TO_PLAYLIST_FORM'
  }
}

export function load(artist) {
  return dispatch => {
    dispatch(loading())

    if (!artist) {
      dispatch(loadingError());
    } else {
      if (typeof artist === 'string') {
        LocalService.getArtistByName(artist)
          .then(art => dispatch(loadingSuccess(art)))
          .catch(err => dispatch(loadingError(err)));
      } else {
        dispatch(loadingSuccess(artist));
      }
    }

    LocalService.getUserPlaylists()
      .then(playlists => {
        dispatch(playlistsLoaded(playlists));
      });
  }
}