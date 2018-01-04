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
  showAddToPlaylistConfirmationForm: false
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
        playlistModified: action.payload.playlist
      }
    case 'HOME_HIDE_ADD_PLAYLIST_SUCCESS':
      return {
        ...state,
        showAddToPlaylistConfirmationForm: false,
        songToAddToPlaylist: null,
        playlistModified: null
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
    default:
      return state;
  }
}