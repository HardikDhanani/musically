import LocalService from '../../services/LocalService';
import * as appActions from './appActions';
import playlist from '../reducers/playlist';

const playlistsLoaded = (playlists) => {
  return {
    type: 'ALBUM_PLAYLISTS_LOADED',
    payload: {
      playlists
    }
  }
}

export const loading = () => {
  return {
    type: 'ALBUM_LOADING'
  }
}

export const loadingSuccess = (album, relatedAlbums) => {
  return {
    type: 'ALBUM_LOADING_SUCCESS',
    payload: {
      album,
      relatedAlbums
    }
  }
}

export const loadingError = () => {
  return {
    type: 'ALBUM_LOADING_ERROR'
  }
}

export const showMore = () => {
  return {
    type: 'ALBUM_SHOW_MORE'
  }
}

export const showSongMenu = (targetMenu) => {
  return {
    type: 'ALBUM_SHOW_SONG_MENU',
    payload: {
      targetMenu
    }
  }
}

export const hideSongMenu = () => {
  return {
    type: 'ALBUM_HIDE_SONG_MENU'
  }
}

export const showAddToPlaylist = () => {
  return {
    type: 'ALBUM_SHOW_ADD_TO_PLAYLIST_FORM'
  }
}

export const hideAddToPlaylist = () => {
  return {
    type: 'ALBUM_HIDE_ADD_TO_PLAYLIST_FORM'
  }
}

export function load(album, artist) {
  return dispatch => {
    dispatch(loading())

    if (!album) {
      dispatch(loadingError());
    } else {
      let artistName = null;
      let albumName = null;
      if (typeof album === 'string') {
        artistName = artist;
        albumName = album;
      } else {
        artistName = album.artist;
        albumName = album.album;
      }

      LocalService.getArtistByName(artistName)
        .then(artist => {
          let relatedAlbums = [];
          let albumToReturn = null;

          for (let i = 0; i < artist.albums.length; i++) {
            if (artist.albums[i].album === albumName) {
              albumToReturn = artist.albums[i];
            } else {
              relatedAlbums.push(artist.albums[i]);
            }
          }

          dispatch(loadingSuccess(albumToReturn, relatedAlbums));
        });
    }

    LocalService.getUserPlaylists()
      .then(playlists => {
        dispatch(playlistsLoaded(playlists));
      });
  }
}
