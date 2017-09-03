import LocalService from '../../services/LocalService';

export const loading = () => {
  return {
    type: 'ALBUM_LOADING'
  }
}

export const loadingSuccess = (album) => {
  return {
    type: 'ALBUM_LOADING_SUCCESS',
    payload: {
      album
    }
  }
}

export const loadingError = () => {
  return {
    type: 'ALBUM_LOADING_ERROR'
  }
}

export function load(album, artist) {
  return dispatch => {
    dispatch(loading())

    if (!album) {
      dispatch(loadingError());
    } else {
      if (typeof album === 'string') {
        LocalService.getAlbumByName(album, artist)
          .then(alb => dispatch(loadingSuccess(alb)))
          .catch(err => dispatch(loadingError(err)));
      } else {
        dispatch(loadingSuccess(album));
      }
    }
  }
}
