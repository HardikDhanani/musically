import * as songsSelector from '../selectors/songs';

const initialState = {
  songs: [],
  artists: [],
  albums: [],
  genres: [],
  isLoading: false,
};

export default function search(state = initialState, action = {}) {
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
        songs: action.payload.favorites.songs,
        artists: action.payload.favorites.artists,
        albums: action.payload.favorites.albums,
        genres: action.payload.favorites.genres,
      }
    case 'QUEUE_LOADING_ERROR':
      return {
        ...state,
        isLoading: false,
      }
    default:
      return state;
  }
}