import LocalService from '../../services/LocalService';

import * as appActions from './appActions';
import * as playerActions from './playerActions';

/* Internal methods */
const _saveSongAndAddOrRemoveToFavoritesPlaylist = (song, removeFromFavorites, dispatch) => {
  let saveSongPromise = LocalService.saveSong(song)
    .then(() => dispatch(songUpdated(song)));
  let updateAlbumPromise = LocalService.getAlbumByName(song.album, song.artist)
    .then(album => {
      if (!album) {
        return Promise.resolve();
      }

      let i = album.songs.findIndex(s => s.id === song.id);
      album.songs[i] = song;

      return LocalService.saveAlbum(album)
        .then(() => {
          dispatch(albumUpdated(album));
          return Promise.resolve(album);
        });
    });
  let updateArtistPromise = LocalService.getArtistByName(song.artist)
    .then(artist => {
      if (!artist) {
        return Promise.resolve();
      }

      let i = artist.albums.findIndex(s => s.album === song.album);
      let j = artist.albums[i].songs.findIndex(s => s.id === song.id);
      artist.albums[i].songs[j] = song;

      return LocalService.saveArtist(artist)
        .then(() => {
          dispatch(artistUpdated(artist));
          return Promise.resolve(artist);
        });
    });
  let updatePlaylistsPromise = LocalService.getPlaylists()
    .then(playlists => {
      for (let i = 0; i < playlists.length; i++) {
        if (playlists[i].name !== 'favorites') {
          let j = playlists[i].songs.findIndex(s => s.id === song.id);
          if (j !== -1) {
            playlists[i].songs[j] = song;
          }
        }
      }

      return LocalService.savePlaylists(playlists);
    })
    .then(() => LocalService.getPlaylists())
    .then(playlists => dispatch(playlistsUpdated(playlists)));
  let updateFavoritesPromise = LocalService.getPlaylistByName('favorites')
    .then(playlist => {
      if (removeFromFavorites) {
        if (song.isFavorite) {
          appActions.addSongToPlaylist(song, playlist)(dispatch);
        } else {
          appActions.removeSongFromPlaylist(song, playlist)(dispatch);
        }
      }

      return Promise.resolve();
    });

  let promises = [
    saveSongPromise,
    updateAlbumPromise,
    updateArtistPromise,
    updateFavoritesPromise,
    updatePlaylistsPromise
  ];

  return Promise.all(promises);
}

/* Internal actions */
const likeSuccess = (type, target) => {
  return {
    type: 'FAVORITES_LIKE_SUCCESS',
    payload: {
      type,
      target
    }
  }
}

const likeError = (error) => {
  return {
    type: 'FAVORITES_LIKE_ERROR',
    payload: {
      error
    }
  }
}

const songUpdated = (song) => {
  return {
    type: 'FAVORITES_SONG_UPDATED',
    payload: {
      song
    }
  }
}

const artistUpdated = (artist) => {
  return {
    type: 'FAVORITES_ARTIST_UPDATED',
    payload: {
      artist
    }
  }
}

const albumUpdated = (album) => {
  return {
    type: 'FAVORITES_ALBUM_UPDATED',
    payload: {
      album
    }
  }
}

const playlistsUpdated = (playlists) => {
  return {
    type: 'FAVORITES_PLAYLISTS_UPDATED',
    payload: {
      playlists
    }
  }
}

/* Public constant actions */
export const loading = (criteria) => {
  return {
    type: 'FAVORITES_LOADING',
    payload: {
      criteria
    }
  }
}

export const loadingSuccess = (favorites) => {
  return {
    type: 'FAVORITES_LOADING_SUCCESS',
    payload: {
      favorites
    }
  }
}

export const loadingError = (criteria) => {
  return {
    type: 'FAVORITES_LOADING_ERROR',
    payload: {
      criteria
    }
  }
}

/* Public function actions */
export function load() {
  return dispatch => {
    dispatch(loading());

    LocalService.getFavorites()
      .then(favorites => {
        dispatch(loadingSuccess(favorites))
      })
      .catch(err => {
        dispatch(loadingError(err));
      });
  }
}

export function like(type, target, removeFromFavorites = true) {
  return dispatch => {
    if (!type || !target) {
      return;
    }

    target.isFavorite = !target.isFavorite;
    switch (type.toLowerCase()) {
      case 'song':
        _saveSongAndAddOrRemoveToFavoritesPlaylist(target, removeFromFavorites, dispatch)
          .then(() => dispatch(likeSuccess(type, target)));
        break;

      case 'artist':
        LocalService.saveArtist(target)
          .then(() => dispatch(likeSuccess(type, target)));
        break;

      case 'album':
        LocalService.saveAlbum(target)
          .then(() => LocalService.getArtistByName(target.artist))
          .then(artist => {
            let i = artist.albums.findIndex(a => a.id === target.id);
            artist.albums[i] = target;

            return LocalService.saveArtist(artist);
          })
          .then(() => dispatch(likeSuccess(type, target)));
        break;

      case 'genre':
        LocalService.saveGenre(target)
          .then(() => dispatch(likeSuccess(type, target)));
        break;

      default:
        dispatch(likeError('Invalid type.'));
        break;
    }
  }
}

export function setMenu(target) {
  return dispatch => {
    dispatch(appActions.setMenu({ ...target, caller: 'FAVORITES' }));
  }
}

export function addToQueue(queue) {
  return dispatch => {
    playerActions.addToQueue(queue)(dispatch);
  }
}