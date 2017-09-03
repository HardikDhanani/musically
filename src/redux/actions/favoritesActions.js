import LocalService from '../../services/LocalService';

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

export function like(type, target) {
  return dispatch => {
    target.isFavorite = !target.isFavorite;
    switch (type.toLowerCase()) {
      case 'song':
        LocalService.saveSong(target)
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

