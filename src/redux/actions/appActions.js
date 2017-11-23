import LocalService from '../../services/LocalService';
import songsSelector from '../selectors/songs';
import * as playerActions from './playerActions';

let _isLoaded = false;

async function _load(dispatch) {
  let session = await LocalService.getSession();
  let songs = await LocalService.getSongs();
  let albums = await LocalService.getAlbums();
  let artists = await LocalService.getArtists();
  let genres = await LocalService.getGenres();
  let playlists = await LocalService.getPlaylists();

  dispatch(startingSuccess(songs, artists, albums, genres, playlists, session));
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

function _createDefaultPlaylists() {
  let mostPlayed = {
    name: 'Most played',
    songs: []
  }

  let favorites = {
    name: 'Favorites',
    songs: []
  }

  return LocalService.savePlaylist(mostPlayed)
    .then(() => LocalService.savePlaylist(favorites))
}

const starting = () => {
  return {
    type: 'APP_STARTING'
  }
}

const goHome = () => {
  return {
    type: 'APP_GO_HOME'
  }
}

const startingSuccess = (songs, artists, albums, genres, playlists, session) => {
  return {
    type: 'APP_STARTING_SUCCESS',
    payload: {
      songs,
      artists,
      albums,
      genres,
      playlists,
      session,
    }
  }
}

const startingError = () => {
  return {
    type: 'APP_STARTING_ERROR'
  }
}

const savingNewPlaylist = () => {
  return {
    type: 'APP_SAVING_NEW_PLAYLIST'
  }
}

const playlistAlreadyExists = () => {
  return {
    type: 'APP_PLAYLIST_ALREADY_EXISTS'
  }
}

const playlistSaved = (playlists) => {
  return {
    type: 'APP_SAVING_NEW_PLAYLIST_SUCCEED',
    payload: {
      playlists
    }
  }
}

const errorSavingPlaylist = (message) => {
  return {
    type: 'APP_SAVING_NEW_PLAYLIST_ERROR',
    payload: {
      message
    }
  }
}

const addingSongToPlaylist = () => {
  return {
    type: 'APP_ADDING_SONG_TO_PLAYLIST'
  }
}

const songAddedToPlaylist = (playlists) => {
  return {
    type: 'APP_ADDING_SONG_TO_PLAYLIST_SUCCEED',
    payload: {
      playlists
    }
  }
}

const songAlreadyInPlaylist = () => {
  return {
    type: 'APP_SONG_ALREADY_IN_PLAYLIST'
  }
}

const removingSongFromPlaylist = () => {
  return {
    type: 'APP_REMOVING_SONG_FROM_PLAYLIST'
  }
}

const songRemovedFromPlaylist = (playlists) => {
  return {
    type: 'APP_REMOVING_SONG_FROM_PLAYLIST_SUCCEED',
    payload: {
      playlists
    }
  }
}

const playlistsUpdated = (playlists) => {
  return {
    type: 'APP_PLAYLISTS_UPDATED',
    payload: {
      playlists
    }
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

export const deletingPlaylist = () => {
  return {
    type: 'APP_DELETING_PLAYLIST'
  }
}

export const playlistDeleted = (playlists) => {
  return {
    type: 'APP_PLAYLIST_DELETED',
    payload: {
      playlists
    }
  }
}

export function start() {
  return (dispatch) => {
    try {
      if (_isLoaded) {
        playerActions.initPlayer()(dispatch);
        dispatch(goHome());
      } else {
        dispatch(starting());

        setTimeout(() => {
          _isLoaded = true;
          playerActions.initPlayer()(dispatch);
          dispatch(goHome());
        }, 3000);

        LocalService.isFirstTime()
          .then(resp => {
            if (resp) {
              LocalService.scanForSongs()
                .then(_groupAndSaveMusic)
                .then(_createDefaultPlaylists)
                .then(LocalService.firstTimeDone)
                .then(() => _load(dispatch));
            } else {
              _load(dispatch)
            }
          });
      }
    } catch (error) {
      console.log(error);
    }
  }
}

export function createNewPlaylist(playlistName) {
  return dispatch => {
    dispatch(savingNewPlaylist());

    LocalService.getPlaylistByName(playlistName)
      .then(playlist => {
        if (playlist) {
          dispatch(playlistAlreadyExists());
        } else {
          playlist = {
            name: playlistName,
            songs: []
          }

          LocalService.savePlaylist(playlist)
            .then(LocalService.getPlaylists)
            .then(playlists => {
              dispatch(playlistSaved(playlists));
            })
            .catch(error => {
              dispatch(errorSavingPlaylist(error.message));
            });
        }
      });
  }
}

export function deletePlaylist(playlist) {
  return dispatch => {
    dispatch(deletingPlaylist());

    LocalService.deletePlaylist(playlist)
      .then(LocalService.getPlaylists)
      .then(playlists => {
        dispatch(playlistDeleted(playlists));
      });
  }
}

export function addSongToPlaylist(song, playlist) {
  return dispatch => {
    let index = playlist.songs.findIndex(s => s.id === song.id);
    if (index === -1) {
      dispatch(addingSongToPlaylist());

      playlist.songs.push(song);
      LocalService.savePlaylist(playlist)
        .then(LocalService.getPlaylists)
        .then(playlists => dispatch(songAddedToPlaylist(playlists)));
    } else {
      dispatch(songAlreadyInPlaylist());
    }
  }
}

export function removeSongFromPlaylist(song, playlist) {
  return dispatch => {
    dispatch(removingSongFromPlaylist());

    let index = playlist.songs.findIndex(s => s.id === song.id);
    if (index !== -1) {
      playlist.songs.splice(index, 1);
    }

    LocalService.savePlaylist(playlist)
      .then(LocalService.getPlaylists)
      .then(playlists => dispatch(songRemovedFromPlaylist(playlists)));
  }
}

export function updatePlaylists() {
  return dispatch => {
    LocalService.getPlaylists()
      .then(playlists => dispatch(playlistsUpdated(playlists)));
  }
}