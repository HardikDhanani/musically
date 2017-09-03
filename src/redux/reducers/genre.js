const initialState = {
  genre: null,
  isLoading: false,
  isFavorite: false,
};

export default function genre(state = initialState, action = {}) {
  switch (action.type) {
    case 'GENRE_LOADING':
      return {
        ...state,
        isLoading: true
      }
    case 'GENRE_LOADING_SUCCESS':
      return {
        ...state,
        genre: action.payload.genre,
        isFavorite: action.payload.genre.isFavorite,
        isLoading: false,
      }
    case 'GENRE_LOADING_ERROR':
      return {
        ...state,
        isLoading: false,
      }
    case 'FAVORITES_LIKE_SUCCESS':
      return {
        ...state,
        isFavorite: action.payload.type === 'genre' ? action.payload.target.isFavorite : state.isFavorite
      }
    default:
      return state;
  }
}