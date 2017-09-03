const initialState = {
  isLoading: false,
  error: null,
  selectedSection: 'artists',
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
        isLoading: true,
        error: 'Something went wrong loading items'
      }
    case 'SECTION_CHANGED':
      return {
        ...state,
        selectedSection: action.payload.section
      }
    default:
      return state;
  }
}