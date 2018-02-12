import songsSelector from '../selectors/songs';

const initialState = {
  songs: [],
  artists: [],
  albums: [],
  isLoading: false,
  update: false,
};

export default function favorites(state = initialState, action = {}) {
  switch (action.type) {
    case 'FAVORITES_LOADING':
      return {
        ...state,
        isLoading: true,
      }
    case 'FAVORITES_LOADING_SUCCESS':
      return {
        ...state,
        isLoading: false,
        update: false,
        songs: songsSelector.orderBy(action.payload.favorites.songs, s => s.title),
        artists: songsSelector.orderBy(action.payload.favorites.artists, a => a.artist),
        albums: songsSelector.orderBy(action.payload.favorites.albums, a => a.album)
      }
    case 'FAVORITES_LOADING_ERROR':
      return {
        ...state,
        isLoading: false,
      }
    case 'FAVORITES_LIKE_SUCCESS':
      return {
        ...state,
        update: true
      }
    default:
      return state;
  }
}