const initialState = {
  isLoading: false,
  error: null,
  selectedSection: 'playlists',
  isSavingNewPlaylist: false,
  showNewPlaylistForm: false,
  errorCreatingNewPlaylist: null,
  playlistToDelete: null,
  showDeletePlaylistConfirmation: false,
  confirmationTitle: null,
  confirmationDetail: null,
  showAddToPlaylistForm: false,
  songToAddToPlaylist: null,
  playlistModified: null,
  showAddNewPlaylistForm: false,
  showAddToPlaylistConfirmationForm: false,
  itemViewMode: 'card',
  selectedSongs: [],
  multiSelectModeEnabled: false
};

export default function home(state = initialState, action = {}) {
  switch (action.type) {
    case 'LOADING_SONGS':
      return {
        ...state,
        isLoading: true
      }
    case 'LOADING_SONGS_SUCCESS':
      return {
        ...state,
        isLoading: false,
        error: null
      }
    case 'LOADING_SONGS_ERROR':
      return {
        ...state,
        isLoading: false,
        error: 'Something went wrong loading songs'
      }
    case 'SECTION_CHANGED':
      return {
        ...state,
        selectedSection: action.payload.section
      }
    case 'APP_STARTING_SUCCESS':
      return {
        ...state,
        selectedSongs: action.payload.songs.map(s => {
          return {
            ...s,
            selected: false
          }
        })
      }
    case 'HOME_CREATE_NEW_PLAYLIST':
      return {
        ...state,
        showNewPlaylistForm: true
      }
    case 'HOME_CLOSE_NEW_PLAYLIST':
      return {
        ...state,
        showNewPlaylistForm: false
      }
    case 'HOME_DELETE_PLAYLIST':
      return {
        ...state,
        playlistToDelete: action.payload.playlist,
        showDeletePlaylistConfirmation: true,
        confirmationTitle: 'Confirm deletion',
        confirmationDetail: 'Are you sure to delete playlist ' + action.payload.playlist.name + '?'
      }
    case 'HOME_ADD_SONG_TO_PLAYLIST':
      return {
        ...state,
        showAddToPlaylistForm: true,
        songToAddToPlaylist: action.payload.song
      }
    case 'HOME_CANCEL_ADD_SONG_TO_PLAYLIST':
      return {
        ...state,
        showAddToPlaylistForm: false,
        songToAddToPlaylist: null
      }
    case 'HOME_DELETE_PLAYLIST_CANCEL':
    case 'APP_PLAYLIST_DELETED':
      return {
        ...state,
        playlistToDelete: null,
        showDeletePlaylistConfirmation: false,
        confirmationTitle: null,
        confirmationDetail: null
      }
    case 'APP_SAVING_NEW_PLAYLIST':
      return {
        ...state,
        isSavingNewPlaylist: true,
        errorSavingPlaylist: null
      }
    case 'APP_PLAYLIST_ALREADY_EXISTS':
      return {
        ...state,
        isSavingNewPlaylist: false,
        errorSavingPlaylist: 'A playlists with that name already exists'
      }
    case 'APP_SAVING_NEW_PLAYLIST_SUCCEED':
      return {
        ...state,
        isSavingNewPlaylist: false,
        errorSavingPlaylist: null,
        showNewPlaylistForm: false
      }
    case 'APP_SAVING_NEW_PLAYLIST_ERROR':
      return {
        ...state,
        isSavingNewPlaylist: false,
        errorSavingPlaylist: action.payload.message,
        showNewPlaylistForm: false
      }
    case 'APP_ADDING_SONG_TO_PLAYLIST_SUCCEED':
    case 'APP_SONG_ALREADY_IN_PLAYLIST':
      return {
        ...state,
        showAddToPlaylistForm: false,
        songToAddToPlaylist: null
      }
    case 'HOME_SHOW_ADD_PLAYLIST_SUCCESS':
      return {
        ...state,
        showAddToPlaylistForm: false,
        showAddToPlaylistConfirmationForm: true,
        songToAddToPlaylist: action.payload.song,
        playlistModified: action.payload.playlist,
        showAddNewPlaylistForm: false
      }
    case 'HOME_HIDE_ADD_PLAYLIST_SUCCESS':
      return {
        ...state,
        showAddToPlaylistConfirmationForm: false,
        songToAddToPlaylist: null,
        playlistModified: null,
        showAddNewPlaylistForm: false
      }
    case 'HOME_ADD_NEW_PLAYLIST':
      return {
        ...state,
        showAddNewPlaylistForm: true
      }
    case 'HOME_CANCEL_ADD_NEW_PLAYLIST':
      return {
        ...state,
        showAddNewPlaylistForm: false
      }
    case 'HOME_ITEM_VIEW_MODE_CHANGED':
      return {
        ...state,
        itemViewMode: action.payload.itemViewMode
      }
    case 'HOME_MULTI_SELECT_MODE_ENABLED':
      return {
        ...state,
        multiSelectModeEnabled: true,
        selectedSongs: state.selectedSongs.map(s => {
          return {
            ...s,
            selected: action.payload.initialSongId === s.id
          }
        })
      }
    case 'HOME_MULTI_SELECT_MODE_DISABLED':
      return {
        ...state,
        multiSelectModeEnabled: false,
        selectedSongs: state.selectedSongs.map(s => {
          return {
            ...s,
            selected: false
          }
        })
      }
    case 'HOME_SONG_SELECTED':
      return {
        ...state,
        selectedSongs: state.selectedSongs.map(s => {
          return {
            ...s,
            selected: action.payload.song.id === s.id ? !s.selected : s.selected
          }
        })
      }
    default:
      return state;
  }
}