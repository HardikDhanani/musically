const initialState = {
  artist: null,
  isLoading: false,
  isFavorite: false,
};

export default function artist(state = initialState, action = {}) {
  switch (action.type) {
    case 'ARTIST_LOADING':
      return {
        ...state,
        isLoading: true
      }
    case 'ARTIST_LOADING_SUCCESS':
      return {
        ...state,
        artist: action.payload.artist,
        isFavorite: action.payload.artist.isFavorite,
        isLoading: false,
      }
    case 'ARTIST_LOADING_ERROR':
      return {
        ...state,
        isLoading: false,
      }
    case 'FAVORITES_LIKE_SUCCESS':
      return {
        ...state,
        isFavorite: action.payload.type === 'artist' ? action.payload.target.isFavorite : state.isFavorite
      }
    default:
      return state;
  }
}