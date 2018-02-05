const initialState = {
  playlist: null,
  isLoading: false,
  isRemovingSong: false,
  name: '',
  songs: [],
  topSongs: [],
  playlists: [],
  showFiveMore: true,
  showSongMenuForm: false,
  targetMenu: null,
  showAddToPlaylistForm: false,
  showDeletePlaylistConfirmationForm: false,
  showDeletePlaylistSuccessConfirmation: false,
  closeForm: false,
  deletingPlaylist: false
};
let topSongs = [];
let sortSongsByReproductions = (a, b) => {
  if (a.reproductions < b.reproductions) return -1;
  if (a.reproductions > b.reproductions) return 1;
  return 0;
}

export default function playlist(state = initialState, action = {}) {
  switch (action.type) {
    case 'PLAYLIST_LOADING':
      return {
        ...initialState,
        isLoading: true
      }
    case 'PLAYLIST_LOADING_SUCCESS':
      let songs = action.payload.playlist ? action.payload.playlist.songs : [];
      songs = JSON.parse(JSON.stringify(songs));
      topSongs = songs.filter(song => song.reproductions > 0).sort(sortSongsByReproductions).slice(0, 5);

      return {
        ...state,
        playlist: action.payload.playlist,
        isLoading: false,
        name: action.payload.playlist.name,
        songs,
        topSongs,
        showFiveMore: topSongs.length > 5
      }
    case 'PLAYLIST_LOADING_ERROR':
      return {
        ...state,
        isLoading: false,
      }
    case 'PLAYLIST_PLAYLISTS_LOADED':
      return {
        ...state,
        playlists: action.payload.playlists
      }
    case 'PLAYLIST_REMOVING_SONG':
      return {
        ...state,
        isRemovingSong: true
      }
    case 'PLAYLIST_REMOVING_SONG_SUCCESS':
      return {
        ...state,
        isRemovingSong: false,
        songs: JSON.parse(JSON.stringify(action.payload.playlist.songs))
      }
    case 'PLAYLIST_SHOW_MORE':
      return {
        ...state,
        topSongs: topSongs.slice(0, state.topSongs.length + 5),
        showFiveMore: (state.topSongs.length + 5) < topSongs.length
      }
    case 'PLAYLIST_SHOW_SONG_MENU':
      return {
        ...state,
        showSongMenuForm: true,
        targetMenu: action.payload.targetMenu
      }
    case 'PLAYLIST_HIDE_SONG_MENU':
      return {
        ...state,
        showSongMenuForm: false,
        targetMenu: null
      }
    case 'PLAYLIST_SHOW_DELETE_PLAYLIST_CONFIRMATION':
      return {
        ...state,
        showDeletePlaylistConfirmationForm: true
      }
    case 'PLAYLIST_CANCEL_SHOW_DELETE_PLAYLIST_CONFIRMATION':
      return {
        ...state,
        showDeletePlaylistConfirmationForm: false
      }
    case 'PLAYLIST_DELETING_PLAYLIST':
      return {
        ...state,
        showDeletePlaylistConfirmationForm: false,
        deletingPlaylist: true
      }
    case 'PLAYLIST_DELETING_PLAYLIST_SUCCESS':
      return {
        ...state,
        showDeletePlaylistConfirmationForm: false,
        showDeletePlaylistSuccessConfirmation: true,
        deletingPlaylist: false
      }
    case 'PLAYLIST_CLOSE_PLAYLIST_FORM':
      return {
        ...state,
        showDeletePlaylistSuccessConfirmation: false,
        closeForm: true
      }
    default:
      return state;
  }
}