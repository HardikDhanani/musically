const initialState = {
  length: 0,
  reproductionsRequired: 0,
  songs: [],
  deleteMode: false,
  songsDelete: [],
  selected: 0,
  selectedAll: false,
  showConfirmation: false
};

export default function recentlyPlayed(state = initialState, action = {}) {
  switch (action.type) {
    case 'RECENTLY_PLAYED_UPDATED':
    case 'RECENTLY_PLAYED_LOADING_SUCCESS':
      let length = action.payload.length ? action.payload.length : state.length;
      let songs = action.payload.songs.slice(0, length === 0 ? action.payload.songs.length : length);
      return {
        ...state,
        songs
      }
    case 'SETTINGS_RESET_RECENTLY_PLAYED_SUCCESS':
      return {
        ...state,
        songs: []
      }
    case 'RECENTLY_PLAYED_SET_DELETE_MODE_ON':
      return {
        ...state,
        deleteMode: true,
        songsDelete: state.songs.map(s => {
          return {
            ...s,
            selected: false
          }
        })
      }
    case 'RECENTLY_PLAYED_SET_DELETE_MODE_OFF':
      return {
        ...state,
        deleteMode: false,
        songsDelete: [],
        selected: 0,
        selectedAll: false
      }
    case 'RECENTLY_PLAYED_SELECT_SONG':
      let selected = 0;
      let newSongsDelete = state.songsDelete.map(s => {
        if (s.id === action.payload.id) {
          s.selected = !s.selected;
        }

        selected += s.selected ? 1 : 0;

        return s;
      });
      return {
        ...state,
        songsDelete: newSongsDelete,
        selectedAll: selected === newSongsDelete.length,
        selected
      }
    case 'RECENTLY_PLAYED_SELECT_ALL_PRESSED':
      return {
        ...state,
        selectedAll: !state.selectedAll,
        songsDelete: state.songsDelete.map(s => {
          return {
            ...s,
            selected: !state.selectedAll
          }
        }),
        selected: !state.selectedAll ? state.songsDelete.length : 0
      }
    case 'RECENTLY_PLAYED_DELETE_SONGS_CONFIRMATION':
      return {
        ...state,
        showConfirmation: state.selected > 0
      }
    case 'RECENTLY_PLAYED_DELETE_SONGS_CANCEL':
      return {
        ...state,
        showConfirmation: false
      }
    case 'RECENTLY_PLAYED_REMOVING_SONG_SUCCESS':
      return {
        ...state,
        isRemovingSong: false,
        deleteMode: false,
        songsDelete: [],
        selected: 0,
        selectedAll: false,
        showConfirmation: false,
        songs: JSON.parse(JSON.stringify(action.payload.songs))
      }
    case 'SETTINGS_SET_RECENTLY_PLAYED_LENGTH_SUCCESS':
      return {
        ...state,
        length: action.payload.recentlyPlayedLength,
        songs: action.payload.recentlyPlayedLength > 0 ? state.songs.slice(0, action.payload.recentlyPlayedLength) : state.songs
      }
    default:
      return state;
  }
}