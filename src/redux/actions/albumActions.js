import LocalService from '../../services/LocalService';

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
        // LocalService.getAlbumByName(album, artist)
        //   .then(alb => dispatch(loadingSuccess(alb)))
        //   .catch(err => dispatch(loadingError(err)));
      } else {
        // dispatch(loadingSuccess(album));
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
  }
}
