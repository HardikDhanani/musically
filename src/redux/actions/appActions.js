import LocalService from '../../services/LocalService';
import * as songsSelector from '../selectors/songs';

async function _load(dispatch) {
  let session = await LocalService.getSession();
  let songs = await LocalService.getSongs();
  let albums = await LocalService.getAlbums();
  let artists = await LocalService.getArtists();
  let genres = await LocalService.getGenres();

  dispatch(startingSuccess(songs, artists, albums, genres, session));
}

function _groupAndSaveArtists(songs) {
  let artists = songsSelector.groupByArtists(songs);
  artists = songsSelector.orderBy(artists, a => a.id);
  return LocalService.saveArtists(artists);
}

function _groupAndSaveAlbums(songs) {
  let albums = songsSelector.groupByAlbum(songs);
  albums = songsSelector.orderBy(albums, a => a.id);
  return LocalService.saveAlbums(albums);
}

function _groupAndSaveGenres(songs) {
  let genres = songsSelector.groupByGenre(songs);
  genres = songsSelector.orderBy(genres, g => g.id);
  return LocalService.saveGenres(genres);
}

function _groupAndSaveMusic(songs) {
  let ordererSongs = songsSelector.orderBy(songs, s => s.title);
  return LocalService.saveSongs(ordererSongs)
    .then(() => _groupAndSaveArtists(songs))
    .then(() => _groupAndSaveAlbums(songs))
    .then(() => _groupAndSaveGenres(songs));
}

const starting = () => {
  return {
    type: 'APP_STARTING'
  }
}

const startingSuccess = (songs, artists, albums, genres, session) => {
  return {
    type: 'APP_STARTING_SUCCESS',
    payload: {
      songs,
      artists,
      albums,
      genres,
      session,
    }
  }
}

const startingError = () => {
  return {
    type: 'APP_STARTING_ERROR'
  }
}

export const setMenu = (target, positionX, positionY) => {
  return {
    type: 'APP_SET_MENU',
    payload: {
      target,
      positionX,
      positionY
    }
  }
}

export function start() {
  return (dispatch) => {
    try {
      dispatch(starting());

      LocalService.isFirstTime()
        .then(resp => {
          if (resp) {
            LocalService.scanForSongs()
              .then(_groupAndSaveMusic)
              .then(LocalService.firstTimeDone)
              .then(() => _load(dispatch));
          } else {
            _load(dispatch)
          }
        });
    } catch (error) {
      console.log(error);
    }
  }
}