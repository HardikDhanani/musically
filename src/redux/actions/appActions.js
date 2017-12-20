import LocalService from '../../services/LocalService';
import LanguageManager from '../../services/LanguageManager';
import songsSelector from '../selectors/songs';
import playlistsSelector from '../selectors/playlists';
import * as playerActions from './playerActions';
import * as playlistActions from './playlistActions';
import dictionaries from '../../dictionaries/index';
import { languageChanged } from './settingsActions';
import playlist from '../reducers/playlist';


let _isLoaded = false;
let _languageManager = new LanguageManager(dictionaries);

function _getCurrentLanguage() {
  let DeviceInfo = require('react-native-device-info');
  let locale = DeviceInfo.getDeviceLocale() || 'en-US';

  switch (locale.substring(0, 2)) {
    case 'es':
      return 'spanish';
    case 'pt':
      return 'portuguese';
    case 'en':
    default:
      return 'english';
  }
}

async function _initialize(dispatch) {
  let session = await LocalService.getSession();
  _languageManager.setLanguage(session.language || _getCurrentLanguage());
  dispatch(appInitialized(_languageManager.currentDictionary));
}

function _setMostPlayedAndRecentlyPlayedPlaylists(playlists, session) {
  playlistsSelector.setMostPlayedLengthOnPlaylists(playlists, session.mostPlayedLength);
  playlistsSelector.setRecentlyPlayedLengthOnPlaylists(playlists, session.recentlyPlayedLength);
}

async function _load(dispatch) {
  let session = await LocalService.getSession();

  LocalService.getPlaylists()
    .then(playlists => {
      _setMostPlayedAndRecentlyPlayedPlaylists(playlists, session);
      dispatch(homePlaylistsLoaded(playlists))
    });

  let songs = await LocalService.getSongs();
  let albums = await LocalService.getAlbums();
  let artists = await LocalService.getArtists();
  let genres = await LocalService.getGenres();

  dispatch(startingSuccess(songs, artists, albums, genres, null, session));
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
  let ordererSongs = songsSelector.orderBy(songs, s => s.title).map(song => {
    return {
      ...song,
      reproductions: 0,
      isFavorite: false
    };
  });
  return LocalService.saveSongs(ordererSongs)
    .then(() => _groupAndSaveArtists(ordererSongs))
    .then(() => _groupAndSaveAlbums(ordererSongs))
    .then(() => _groupAndSaveGenres(ordererSongs));
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

  let recentPlayed = {
    name: 'Recently played',
    songs: []
  }

  return LocalService.savePlaylist(mostPlayed)
    .then(() => LocalService.savePlaylist(favorites))
    .then(() => LocalService.savePlaylist(recentPlayed));
}

const appInitialized = (dictionary) => {
  return {
    type: 'APP_INITIALIZED',
    payload: {
      dictionary
    }
  }
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

const homePlaylistsLoaded = (playlists) => {
  return {
    type: 'APP_HOME_PLAYLISTS_LOADED_SUCCESS',
    payload: {
      playlists
    }
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

const songDoesNotExistInPlaylist = () => {
  return {
    type: 'APP_SONG_DOES_NOT_EXIST_IN_PLAYLIST'
  }
}

const updatingSongInPlaylist = () => {
  return {
    type: 'APP_UPDATING_SONG_IN_PLAYLIST'
  }
}

const songUpdatedInPlaylist = (playlists) => {
  return {
    type: 'APP_UPDATING_SONG_IN_PLAYLIST_SUCCEED',
    payload: {
      playlists
    }
  }
}

const languageChangedAction = (dictionary) => {
  return {
    type: 'APP_LANGUAGE_CHANGED',
    payload: {
      dictionary
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
        _initialize(dispatch);

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

      let session = null;
      playlist.songs.push(song);
      LocalService.savePlaylist(playlist)
        .then(LocalService.getSession)
        .then(ses => {
          session = ses;
          return Promise.resolve();
        })
        .then(LocalService.getPlaylists)
        .then(playlists => {
          _setMostPlayedAndRecentlyPlayedPlaylists(playlists, session);
          dispatch(songAddedToPlaylist(playlists))
        });
    } else {
      dispatch(songAlreadyInPlaylist());
    }
  }
}

export function updateSongInPlaylist(song, playlist) {
  return dispatch => {
    let index = playlist.songs.findIndex(s => s.id === song.id);
    if (index !== -1) {
      dispatch(updatingSongInPlaylist());

      let session = null;
      playlist.songs[index] = song;
      LocalService.savePlaylist(playlist)
        .then(LocalService.getSession)
        .then(ses => {
          session = ses;
          return Promise.resolve();
        })
        .then(LocalService.getPlaylists)
        .then(playlists => {
          _setMostPlayedAndRecentlyPlayedPlaylists(playlists, session);
          dispatch(songUpdatedInPlaylist(playlists))
        });
    } else {
      dispatch(songDoesNotExistInPlaylist());
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

export function setLanguage(language) {
  return dispatch => {
    LocalService.getSession()
      .then(session => {
        session.language = language;
        return LocalService.saveSession(session)
      })
      .then(session => {
        _languageManager.setLanguage(language);
        dispatch(languageChangedAction(_languageManager.currentDictionary));
      });
  }
}