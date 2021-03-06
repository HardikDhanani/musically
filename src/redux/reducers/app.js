const initialState = {
  dictionary: {
    getWord: () => '[undefined]'
  },
  isReady: false,
  homePlaylistsReady: false,
  homeArtistsReady: false,
  homeAlbumsReady: false,
  homeSongsReady: false,
  goHome: false,
  session: null,
  songs: [],
  albums: [],
  artists: [],
  genres: [],
  playlists: [],
  showMenu: false,
  targetMenu: null,
  language: null,
  iosAppId: 'iosAppId',
  androidAppId: 'androidAppId',
  version: '0.0.1',
  scanningSongs: false,
  scanForSongs: false,
  totalSongs: 0
};

export default function app(state = initialState, action = {}) {
  switch (action.type) {
    case 'APP_INITIALIZED':
      return {
        ...state,
        dictionary: action.payload.dictionary,
        language: action.payload.language
      }
    case 'APP_LANGUAGE_CHANGED':
      return {
        ...state,
        dictionary: action.payload.dictionary,
        language: action.payload.language,
        playlists: JSON.parse(JSON.stringify(state.playlists))
      }
    case 'APP_GO_HOME':
      return {
        ...state,
        goHome: true
      }
    case 'APP_STARTING_SUCCESS':
      return {
        ...state,
        isReady: true,
        homeArtistsReady: true,
        homeAlbumsReady: true,
        homeSongsReady: true,
        session: action.payload.session,
        songs: action.payload.songs,
        albums: action.payload.albums,
        artists: action.payload.artists,
        genres: action.payload.genres
      }
    case 'APP_HOME_PLAYLISTS_LOADED_SUCCESS':
      return {
        ...state,
        homePlaylistsReady: true,
        playlists: action.payload.playlists
      }
    case 'APP_SET_MENU':
      return {
        ...state,
        showMenu: !state.showMenu,
        targetMenu: action.payload.target
      }
    case 'APP_SAVING_NEW_PLAYLIST_SUCCEED':
    case 'APP_ADDING_SONG_TO_PLAYLIST_SUCCEED':
    case 'APP_REMOVING_SONG_FROM_PLAYLIST_SUCCEED':
    case 'APP_UPDATING_SONG_IN_PLAYLIST_SUCCEED':
    case 'APP_PLAYLIST_DELETED':
    case 'APP_PLAYLISTS_UPDATED':
    case 'SETTINGS_RESET_MOST_PLAYED_SUCCESS':
    case 'SETTINGS_SET_MOST_PLAYED_LENGTH_SUCCESS':
    case 'PLAYLIST_UPDATED':
      return {
        ...state,
        playlists: JSON.parse(JSON.stringify(action.payload.playlists))
      }
    case 'FAVORITES_SONG_UPDATED':
      for (let i = 0; i < state.songs.length; i++) {
        if (state.songs[i].id === action.payload.song.id) {
          state.songs[i] = action.payload.song;
          break;
        }
      }

      return {
        ...state,
        songs: JSON.parse(JSON.stringify(state.songs))
      }
    case 'FAVORITES_ALBUM_UPDATED':
      for (let i = 0; i < state.albums.length; i++) {
        if (state.albums[i].id === action.payload.album.id) {
          state.albums[i] = action.payload.album;
          break;
        }
      }

      return {
        ...state,
        albums: JSON.parse(JSON.stringify(state.albums))
      }
    case 'FAVORITES_ARTIST_UPDATED':
      for (let i = 0; i < state.artists.length; i++) {
        if (state.artists[i].id === action.payload.artist.id) {
          state.artists[i] = action.payload.artist;
          break;
        }
      }

      return {
        ...state,
        artists: JSON.parse(JSON.stringify(state.artists))
      }
    case 'APP_SONGS_ADDED':
      let songs = state.songs.concat(action.payload.songs);
      return {
        ...state,
        songs,
        totalSongs: action.payload.total
      }
    case 'APP_ALBUM_EDITED':
      let i = state.albums.findIndex(a => a.id === action.payload.album.id);
      if (i !== -1) {
        state.albums[i] = action.payload.album;
      } else {
        state.albums.push(action.payload.album);
      }

      return {
        ...state,
        albums: JSON.parse(JSON.stringify(state.albums))
      }
    case 'APP_ARTIST_EDITED':
      let j = state.artists.findIndex(a => a.id === action.payload.artist.id);
      if (j !== -1) {
        state.artists[j] = action.payload.artist;
      } else {
        state.artists.push(action.payload.artist);
      }

      return {
        ...state,
        artists: JSON.parse(JSON.stringify(state.artists))
      }
    case 'APP_START_SCANNING_FOR_SONGS':
      return {
        ...state,
        scanForSongs: true
      }
    case 'APP_SCANNING_SONGS_STARTED':
      return {
        ...state,
        scanningSongs: true
      }
    case 'APP_SCANNING_SONGS_FINISHED':
      return {
        ...state,
        scanningSongs: false,
        scanForSongs: false,
        artists: JSON.parse(JSON.stringify(action.payload.artists)),
        albums: JSON.parse(JSON.stringify(action.payload.albums))
      }
    case 'APP_SONGS_CHANGED':
      return {
        ...state,
        songs: JSON.parse(JSON.stringify(action.payload.songs))
      }
    case 'APP_ALBUMS_CHANGED':
      return {
        ...state,
        albums: JSON.parse(JSON.stringify(action.payload.albums))
      }
    case 'APP_ARTISTS_CHANGED':
      return {
        ...state,
        artists: JSON.parse(JSON.stringify(action.payload.artists))
      }
    default:
      return state;
  }
}