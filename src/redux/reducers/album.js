const initialState = {
  album: null,
  isFavorite: false,
  isLoading: false,
};

export default function album(state = initialState, action = {}) {
  switch (action.type) {
    case 'ALBUM_LOADING':
      return {
        ...state,
        isLoading: true
      }
    case 'ALBUM_LOADING_SUCCESS':
      return {
        ...state,
        album: action.payload.album,
        isFavorite: action.payload.album.isFavorite,
        isLoading: false,
      }
    case 'ALBUM_LOADING_ERROR':
      return {
        ...state,
        isLoading: false,
      }
    case 'FAVORITES_LIKE_SUCCESS':
      return {
        ...state,
        isFavorite: action.payload.type === 'album' ? action.payload.target.isFavorite : state.isFavorite
      }
    default:
      return state;
  }
}