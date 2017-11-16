const initialState = {
  isLoading: false,
  isRemovingSong: false,
  id: null,
  name: null,
  songs: []
};

export default function playlist(state = initialState, action = {}) {
  switch (action.type) {
    case 'PLAYLIST_LOADING':
      return {
        ...state,
        isLoading: true
      }
    case 'PLAYLIST_LOADING_SUCCESS':
      return {
        ...state,
        isLoading: false,
        id: action.payload.playlist.id,
        name: action.payload.playlist.name,
        songs: action.payload.playlist.songs,
      }
    case 'PLAYLIST_LOADING_ERROR':
      return {
        ...state,
        isLoading: false,
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
        songs: action.payload.playlist.songs
      }
    default:
      return state;
  }
}