import songsSelector from '../selectors/songs';

const initialState = {
  criteria: null,
  songs: [],
  albums: [],
  artists: [],
  playlists: [],
  isSearching: false,
  mustCompleteCriteria: true,
};

export default function search(state = initialState, action = {}) {
  switch (action.type) {
    case 'SEARCH_SEARCHING':
      return {
        ...state,
        criteria: action.payload.criteria,
        isSearching: true,
        mustCompleteCriteria: false
      }
    case 'SEARCH_SEARCHING_SUCCESS':
      return {
        ...state,
        criteria: action.payload.criteria,
        songs: songsSelector.orderBy(action.payload.result.songs, s => s.title),
        albums: songsSelector.orderBy(action.payload.result.albums, a => a.album),
        artists: songsSelector.orderBy(action.payload.result.artists, a => a.artist),
        playlists: songsSelector.orderBy(action.payload.result.playlists, p => p.name),
        isSearching: false,
        mustCompleteCriteria: false
      }
    case 'SEARCH_SEARCHING_ERROR':
      return {
        ...state,
        criteria: action.payload.criteria,
        isSearching: false,
        mustCompleteCriteria: false
      }
    case 'SEARCH_SEARCHING_MUST_COMPLETE_CRITERIA':
      return {
        ...state,
        mustCompleteCriteria: true
      }
    default:
      return state;
  }
}