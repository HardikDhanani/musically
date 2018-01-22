const initialState = {
  playlists: [],
  showAddToPlaylistForm: false,
  songToAddToPlaylist: null,
  showAddNewPlaylistForm: false,
  showAddToPlaylistConfirmationForm: false,
  closeForm: false,
  selectedPlaylist: null
};

export default function album(state = initialState, action = {}) {
  switch (action.type) {
    case 'PLAYLIST_SELECTOR_LOADING':
      return {
        ...state,
        isLoading: true
      }
    case 'PLAYLIST_SELECTOR_LOADING_SUCCESS':
      return {
        ...state,
        isLoading: false,
        playlists: action.payload.playlists.map(p => {
          return {
            ...p,
            selected: false
          }
        }),
        songToAdd: action.payload.songToAdd
      }
    case 'PLAYLIST_SELECTOR_LOADING_ERROR':
      return {
        ...state,
        isLoading: false,
      }
    case 'PLAYLIST_SELECTOR_PLAYLIST_SELECTED':
      return {
        ...state,
        selectedPlaylist: action.payload.playlist,
        playlists: state.playlists.map(p => {
          return {
            ...p,
            selected: p.id === action.payload.playlist.id
          }
        })
      }
    case 'PLAYLIST_SELECTOR_ADD_NEW_PLAYLIST':
      return {
        ...state,
        showAddNewPlaylistForm: true
      }
    case 'PLAYLIST_SELECTOR_CANCEL_ADD_NEW_PLAYLIST':
      return {
        ...state,
        showAddNewPlaylistForm: false
      }
    case 'PLAYLIST_SELECTOR_SHOW_ADD_PLAYLIST_SUCCESS':
      return {
        ...state,
        showAddToPlaylistForm: false,
        showAddToPlaylistConfirmationForm: true,
        songToAddToPlaylist: action.payload.song,
        playlistModified: action.payload.playlist,
        showAddNewPlaylistForm: false
      }
    case 'PLAYLIST_SELECTOR_HIDE_ADD_PLAYLIST_SUCCESS':
      return {
        ...state,
        showAddToPlaylistConfirmationForm: false,
        songToAddToPlaylist: null,
        playlistModified: null,
        showAddNewPlaylistForm: false,
        closeForm: true
      }
    case 'PLAYLIST_SELECTOR_FORM_CLOSED':
      return {
        ...state,
        closeForm: false
      }

    default:
      return state;
  }
}