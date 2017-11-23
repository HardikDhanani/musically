import LocalService from '../../services/LocalService';
import * as appActions from './appActions';

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

const _saveSongAndAddOrRemoveToFavoritesPlaylist = (song, removeFromFavorites, dispatch) => {
  return LocalService.saveSong(song)
    .then(() => LocalService.getPlaylistByName('favorites'))
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
}

export function like(type, target, removeFromFavorites = true) {
  return dispatch => {
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

