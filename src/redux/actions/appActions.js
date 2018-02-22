import LocalService from '../../services/LocalService';
import LanguageManager from '../../services/LanguageManager';
import songsSelector from '../selectors/songs';
import playlistsSelector from '../selectors/playlists';
import * as playerActions from './playerActions';
import * as playlistActions from './playlistActions';
import * as homeActions from './homeActions';
import * as settingsActions from './settingsActions';
import dictionaries from '../../dictionaries/index';

let _isLoaded = false;
let _languageManager = new LanguageManager(dictionaries);
const ONE_MINUTE = 60000;

let timer = null;
function _setTaskForImages(dispatch) {
  timer = setInterval(() => {
    let artistsPromise = LocalService.getArtists();
    let albumsPromise = LocalService.getAlbums();
    let songsPromise = LocalService.getSongs();

    Promise.all([artistsPromise, albumsPromise, songsPromise])
      .then(result => {
        let artists = result[0];
        let albums = result[1];
        let songs = result[2];

        let songsNoScanned = songs.filter(s => s.scanned !== true).slice(0, 20);
        let ids = songsNoScanned.map(s => s.id);

        if (songsNoScanned.length === 0) {
          clearInterval(timer);
        } else {
          LocalService.scanCovers(ids)
            .then(covers => {
              for (let i = 0; i < songsNoScanned.length; i++) {
                let j = covers.findIndex(c => c.id === songsNoScanned[i].id);
                if (j !== -1) {
                  songsNoScanned[i].cover = covers[j].file;
                }

                songsNoScanned[i].scanned = true;

                j = songs.findIndex(s => s.id === songsNoScanned[i].id);
                if (j !== -1) {
                  songs[j] = songsNoScanned[i];
                }

                j = albums.findIndex(a => a.artist === songsNoScanned[i].artist && a.album === songsNoScanned[i].album);
                if (j !== -1) {
                  let k = albums[j].songs.findIndex(s => s.id === songsNoScanned[i].id);
                  if (k !== -1) {
                    albums[j].songs[k] = songsNoScanned[i];
                  }

                  if(songsNoScanned[i].cover){
                    albums[j].cover = songsNoScanned[i].cover;

                    k = artists.findIndex(a => a.artist === albums[j].artist);
                    if(k !== -1) {
                      let m = artists[k].albums.findIndex(a => a.id === albums[j].id);
                      if(m !== -1) {
                        artists[k].albums[m] = albums[j];
                      }

                      artists[k].cover = songsNoScanned[i].cover;
                    }
                  }
                }
              }

              let saveArtistsPromise = LocalService.saveArtists(artists);
              let saveAlbumsPromise = LocalService.saveAlbums(albums);
              let saveSongsPromise = LocalService.saveSongs(songs);

              return Promise.all([saveArtistsPromise, saveAlbumsPromise, saveSongsPromise]);
            })
            .then(() => {
              dispatch(songsChanged(songsNoScanned));
              dispatch(albumsChanged(albums));
              dispatch(artistsChanged(artists));
            });
        }
      })
      .catch(err => {
        console.log(JSON.stringify(err));
      });
  }, ONE_MINUTE);
}

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
  settingsActions.load()(dispatch);
  let session = await LocalService.getSession();
  _languageManager.setLanguage(session.language || _getCurrentLanguage());
  dispatch(appInitialized(_languageManager.currentDictionary, session.language));
}

function _setMostPlayedAndRecentlyPlayedPlaylists(playlists, session) {
  playlistsSelector.setMostPlayedLengthOnPlaylists(playlists, session.mostPlayedLength);
  playlistsSelector.setRecentlyPlayedLengthOnPlaylists(playlists, session.recentlyPlayedLength);
}

async function _load(dispatch) {
  let session = await LocalService.getSession();

  homeActions.setItemViewMode(session.itemViewMode)(dispatch);

  LocalService.getPlaylists()
    .then(playlists => {
      _setMostPlayedAndRecentlyPlayedPlaylists(playlists, session);
      dispatch(homePlaylistsLoaded(playlists))
    });

  let songs = await LocalService.getSongs();
  let albums = await LocalService.getAlbums();
  let artists = await LocalService.getArtists();

  dispatch(startingSuccess(songs, artists, albums, null, null, session));
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

function _groupAndSaveMusic(songs) {
  let ordererSongs = songsSelector.orderBy(songs, s => s.title).map(song => {
    let duration = 0;
    try {
      duration = parseInt(song.duration);
    } catch (error) {

    }

    return {
      ...song,
      duration,
      reproductions: 0,
      isFavorite: false
    };
  });

  let p1 = LocalService.saveSongs(ordererSongs);
  let p2 = _groupAndSaveArtists(ordererSongs);
  let p3 = _groupAndSaveAlbums(ordererSongs);

  return Promise.all([p1, p2, p3]);
}

function _createDefaultPlaylists() {
  let musically = {
    name: 'Musically',
    songs: []
  }

  // let favorites = {
  //   name: 'Favorites',
  //   songs: []
  // }

  // let recentPlayed = {
  //   name: 'Recently played',
  //   songs: []
  // }

  return LocalService.savePlaylist(musically);
  //   .then(() => LocalService.savePlaylist(favorites))
  //   .then(() => LocalService.savePlaylist(recentPlayed));
}

const appInitialized = (dictionary, language) => {
  return {
    type: 'APP_INITIALIZED',
    payload: {
      dictionary,
      language
    }
  }
}

const songsAdded = (songs, total) => {
  return {
    type: 'APP_SONGS_ADDED',
    payload: {
      songs,
      total
    }
  }
}

const albumEdited = (album) => {
  return {
    type: 'APP_ALBUM_EDITED',
    payload: {
      album
    }
  }
}

const artistEdited = (artist) => {
  return {
    type: 'APP_ARTIST_EDITED',
    payload: {
      artist
    }
  }
}

const startScanningForSongs = () => {
  return {
    type: 'APP_START_SCANNING_FOR_SONGS'
  }
}

const scanningSongsStartedAction = () => {
  return {
    type: 'APP_SCANNING_SONGS_STARTED'
  }
}

const scanningSongsFinishedAction = (artists, albums) => {
  return {
    type: 'APP_SCANNING_SONGS_FINISHED',
    payload: {
      artists,
      albums
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

const languageChangedAction = (dictionary, language) => {
  return {
    type: 'APP_LANGUAGE_CHANGED',
    payload: {
      dictionary,
      language
    }
  }
}

const songsChanged = (songs) => {
  return {
    type: 'APP_SONGS_CHANGED',
    payload: {
      songs
    }
  }
}

const albumsChanged = (albums) => {
  return {
    type: 'APP_ALBUMS_CHANGED',
    payload: {
      albums
    }
  }
}

const artistsChanged = (artists) => {
  return {
    type: 'APP_ARTISTS_CHANGED',
    payload: {
      artists
    }
  }
}

const _processSongs = (newSongs, dispatch) => {
  return new Promise(async () => {
    let songs = await LocalService.getSongs()
    newSongs = newSongs.map(s => {
      return {
        ...s,
        reproductions: 0,
        isFavorite: false,
        cover: null,
        scanned: false
      }
    });
    
    songs = songs.concat(newSongs);
    await LocalService.saveSongs(songs);
    dispatch(songsAdded(newSongs));
    return Promise.resolve();
  })
}

export const playlistSaved = (playlists) => {
  return {
    type: 'APP_SAVING_NEW_PLAYLIST_SUCCEED',
    payload: {
      playlists
    }
  }
}

export const setMenu = (target) => {
  return {
    type: 'APP_SET_MENU',
    payload: {
      target
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
  return async dispatch => {
    try {
      if (_isLoaded) {
        dispatch(goHome());
      } else {
        dispatch(starting());
        _initialize(dispatch);
        _setTaskForImages(dispatch);

        setTimeout(() => {
          _isLoaded = true;
          playerActions.initPlayer()(dispatch);
          dispatch(goHome());
        }, 4000);

        LocalService.isFirstTime()
          .then(resp => {
            if (resp) {
              dispatch(startScanningForSongs());
              _load(dispatch);
            } else {
              _load(dispatch);
            }
          });
      }
    } catch (error) {
      console.log(error);
    }
  }
}

export function songsRead(newSongs) {
  return async dispatch => {
    await _processSongs(newSongs, dispatch);
  }
}

export function scanningSongsStarted() {
  return dispatch => {
    dispatch(scanningSongsStartedAction());
  }
}

export function scanningSongsFinished() {
  return dispatch => {
    let artists = [];
    let albums = [];

    LocalService.getSongs()
      .then(songs => {
        let album = null;
        let artist = null;
        let song = null;
        let artistIndex = -1;
        let albumIndex = -1;
        let artistId = null;
        let albumId = null;

        for (let i = 0; i < songs.length; i++) {
          song = songs[i];

          if (!(!song.artist) && !(!song.album)) {
            artistId = song.artist.replace(/\s/g, '').toLowerCase();
            albumId = artistId + '#' + song.album.replace(/\s/g, '').toLowerCase();
            artistIndex = artists.findIndex(a => a.id === artistId);

            if (artistIndex === -1) {
              album = {
                id: albumId,
                artist: song.artist,
                album: song.album,
                songs: [song]
              }

              artist = {
                id: artistId,
                artist: song.artist,
                albums: [album]
              }
            } else {
              artist = artists[artistIndex];
              albumIndex = albums.findIndex(a => a.id === albumId);

              if (albumIndex === -1) {
                album = {
                  id: albumId,
                  artist: song.artist,
                  album: song.album,
                  songs: [song]
                }

                artist.albums.push(album);
              } else {
                album = albums[albumIndex];
                album.songs.push(song);

                let i = artist.albums.findIndex(a => a.id === albumId);
                artist.albums[i] = album;
              }
            }
          } else if (!(!song.artist)) {
            artistId = song.artist.replace(/\s/g, '').toLowerCase();
            albumId = artistId + '#null';
            artistIndex = artists.findIndex(a => a.id === artistId);

            if (artistIndex === -1) {
              album = {
                id: albumId,
                artist: song.artist,
                album: 'null',
                songs: [song]
              }

              artist = {
                id: artistId,
                artist: song.artist,
                albums: [album]
              }
            } else {
              artist = artists[artistIndex];
              albumIndex = albums.findIndex(a => a.id === albumId);

              if (albumIndex === -1) {
                album = {
                  id: albumId,
                  artist: song.artist,
                  album: 'null',
                  songs: [song]
                }

                artist.albums.push(album);
              } else {
                album = albums[albumIndex];
                album.songs.push(song);

                let i = artist.albums.findIndex(a => a.id === albumId);
                artist.albums[i] = album;
              }
            }
          } else if (!(!song.album)) {
            albumId = 'null#' + song.album.replace(/\s/g, '').toLowerCase();
            albumIndex = albums.findIndex(a => a.id === albumId);

            if (albumIndex === -1) {
              album = {
                id: albumId,
                artist: 'null',
                album: song.album,
                songs: [song]
              }

              artist = {
                id: 'null',
                artist: 'null',
                albums: [album]
              }
            } else {
              album = albums[albumIndex];
              album.songs.push(song);

              artistIndex = artists.findIndex(a => a.id === 'null');
              artist = artists[artistIndex];

              let i = artist.albums.findIndex(a => a.id === albumId);
              artist.albums[i] = album;
            }
          } else {
            artistId = 'null';
            albumId = 'null#null';
            artistIndex = artists.findIndex(a => a.id === artistId);

            if (artistIndex === -1) {
              album = {
                id: albumId,
                artist: 'null',
                album: 'null',
                songs: [song]
              }

              artist = {
                id: artistId,
                artist: 'null',
                albums: [album]
              }
            } else {
              artist = artists[artistIndex];
              albumIndex = albums.findIndex(a => a.id === albumId);

              if (albumIndex === -1) {
                album = {
                  id: albumId,
                  artist: 'null',
                  album: 'null',
                  songs: [song]
                }

                artist.albums.push(album);
              } else {
                album = albums[albumIndex];
                album.songs.push(song);

                let i = artist.albums.findIndex(a => a.id === albumId);
                artist.albums[i] = album;
              }
            }
          }

          artistIndex = artists.findIndex(a => a.id === artist.id);
          if (artistIndex === -1) {
            artists.push(artist);
          } else {
            artists[artistIndex] = artist;
          }

          albumIndex = albums.findIndex(a => a.id === album.id);
          if (albumIndex === -1) {
            albums.push(album);
          } else {
            albums[albumIndex] = album;
          }

          // dispatch(artistEdited(artist));
          // dispatch(albumEdited(album));
        }

        return LocalService.saveArtists(artists);
      })
      .then(() => {
        return LocalService.saveAlbums(albums);
      })
      .then(() => {
        return LocalService.firstTimeDone();
      })
      .then(() => {
        dispatch(scanningSongsFinishedAction(artists, albums));
      });
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
      .then(playlists => {
        dispatch(playlistsUpdated(playlists));
      });
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
        dispatch(languageChangedAction(_languageManager.currentDictionary, _languageManager.currentDictionary.language));
      });
  }
}