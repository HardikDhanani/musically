import LocalService from '../../services/LocalService';

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
  }
}
