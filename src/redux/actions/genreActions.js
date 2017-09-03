import LocalService from '../../services/LocalService';

export const loading = () => {
  return {
    type: 'GENRE_LOADING'
  }
}

export const loadingSuccess = (genre) => {
  return {
    type: 'GENRE_LOADING_SUCCESS',
    payload: {
      genre
    }
  }
}

export const loadingError = () => {
  return {
    type: 'GENRE_LOADING_ERROR'
  }
}

export function load(genre) {
  return dispatch => {
    dispatch(loading())

    if (!genre) {
      dispatch(loadingError());
    } else {
      dispatch(loadingSuccess(genre));
    }
  }
}
