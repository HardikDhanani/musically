const initialState = {
  isLoading: false,
};

export default function album(state = initialState, action = {}) {
  switch (action.type) {
    case 'PLAYLISTS_LOADING':
      return {
        ...state,
        isLoading: true
      }
    case 'PLAYLISTS_LOADING_SUCCESS':
      return {
        ...state,
        isLoading: false,
      }
    case 'PLAYLISTS_LOADING_ERROR':
      return {
        ...state,
        isLoading: false,
      }
    default:
      return state;
  }
}