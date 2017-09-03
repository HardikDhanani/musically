import LocalService from '../../services/LocalService';

export const searching = (criteria) => {
  return {
    type: 'SEARCHING',
    payload: {
      criteria
    }
  }
}

export const searchingSuccess = (criteria, result) => {
  return {
    type: 'SEARCHING_SUCCESS',
    payload: {
      result,
      criteria
    }
  }
}

export const searchingError = (criteria) => {
  return {
    type: 'SEARCHING_ERROR',
    payload: {
      criteria
    }
  }
}

export const searchingMustCompleteCriteria = () => {
  return {
    type: 'SEARCHING_MUST_COMPLETE_CRITERIA',
    payload: {
      criteria: null
    }
  }
}

function _filter(songs, criteria) {
  let byTitle = [];
  let byArtist = [];
  let byAlbum = [];
  let byGenre = [];

  songs.forEach(song => {
    if (song.title && song.title.toLowerCase().includes(criteria.toLowerCase()))
      byTitle.push(song);

    if (song.artist && song.artist.toLowerCase().includes(criteria.toLowerCase()))
      byArtist.push(song);

    if (song.album && song.album.toLowerCase().includes(criteria.toLowerCase()))
      byAlbum.push(song);

    if (song.genre && song.genre.toLowerCase().includes(criteria.toLowerCase()))
      byGenre.push(song);
  });

  return {
    byTitle,
    byArtist,
    byAlbum,
    byGenre
  };
}

export function search(criteria) {
  return dispatch => {
    dispatch(searching(criteria))

    if (!criteria) {
      dispatch(searchingMustCompleteCriteria());
    } else {
      LocalService.getSongs()
        .then(songs => {
          let result = _filter(songs, criteria);

          dispatch(searchingSuccess(criteria, result));
        })
        .catch(error => {
          dispatch(searchingError(criteria, error));
        });
    }
  }
}
