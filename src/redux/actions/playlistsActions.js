import LocalService from '../../services/LocalService';

const loading = () => {
  return {
    type: 'PLAYLISTS_LOADING'
  }
}

const loadingSuccess = () => {
  return {
    type: 'PLAYLISTS_LOADING_SUCCESS',
  }
}

const loadingError = () => {
  return {
    type: 'PLAYLISTS_LOADING_ERROR'
  }
}

export function load() {
  return dispatch => {
    dispatch(loading())

    dispatch(loadingSuccess());
  }
}
