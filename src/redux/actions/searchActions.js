import LocalService from '../../services/LocalService';

export const searching = (criteria) => {
  return {
    type: 'SEARCH_SEARCHING',
    payload: {
      criteria
    }
  }
}

export const searchingSuccess = (criteria, result) => {
  return {
    type: 'SEARCH_SEARCHING_SUCCESS',
    payload: {
      result,
      criteria
    }
  }
}

export const searchingError = (criteria) => {
  return {
    type: 'SEARCH_SEARCHING_ERROR',
    payload: {
      criteria
    }
  }
}

export const searchingMustCompleteCriteria = () => {
  return {
    type: 'SEARCH_SEARCHING_MUST_COMPLETE_CRITERIA',
    payload: {
      criteria: null
    }
  }
}

export function search(criteria) {
  return dispatch => {
    dispatch(searching(criteria))

    if (!criteria) {
      dispatch(searchingMustCompleteCriteria());
    } else {
      let artistsPromise = LocalService.getArtists();
      let albumsPromise = LocalService.getAlbums();
      let songsPromise = LocalService.getSongs();
      let playlistsPromise = LocalService.getPlaylists();

      Promise.all([artistsPromise, albumsPromise, songsPromise, playlistsPromise])
        .then(promisesResult => {
          let artists = promisesResult[0];
          let albums = promisesResult[1];
          let songs = promisesResult[2];
          let playlists = promisesResult[3];

          let result = {
            artists:  artists.filter(a => a.artist && a.artist.toLowerCase().startsWith(criteria.toLowerCase())),
            albums:  albums.filter(a => a.album && a.album.toLowerCase().startsWith(criteria.toLowerCase())),
            songs:  songs.filter(s => s.title && s.title.toLowerCase().startsWith(criteria.toLowerCase())),
            playlists:  playlists.filter(p => p.name && p.name.toLowerCase().startsWith(criteria.toLowerCase()))
          };

          dispatch(searchingSuccess(criteria, result));
        })
        .catch(error => {
          dispatch(searchingError(criteria, error));
        });
    }
  }
}
