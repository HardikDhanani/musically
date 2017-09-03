import * as songsSelector from '../selectors/songs';

const initialState = {
  criteria: null,
  result: {
    byTitle: [],
    byArtist: [],
    byAlbum: [],
    byGenre: [],
  },
  isSearching: false,
  mustCompleteCriteria: true,
};

export default function search(state = initialState, action = {}) {
  switch (action.type) {
    case 'SEARCHING':
      return {
        ...state,
        criteria: action.payload.criteria,
        isSearching: true,
        mustCompleteCriteria: false
      }
    case 'SEARCHING_SUCCESS':
      return {
        ...state,
        criteria: action.payload.criteria,
        result: {
          byTitle: songsSelector.orderBy(action.payload.result.byTitle, s => s.title),
          byAlbum: songsSelector.orderBy(songsSelector.groupByAlbum(action.payload.result.byAlbum), a => a.album),
          byArtist: songsSelector.orderBy(songsSelector.groupByArtists(action.payload.result.byArtist), a => a.artist),
          byGenre: songsSelector.orderBy(songsSelector.groupByGenre(action.payload.result.byGenre), g => g.genre),
        },
        isSearching: false,
        mustCompleteCriteria: false
      }
    case 'SEARCHING_ERROR':
      return {
        ...state,
        criteria: action.payload.criteria,
        isSearching: false,
        mustCompleteCriteria: false
      }
    case 'SEARCHING_MUST_COMPLETE_CRITERIA':
      return {
        ...state,
        mustCompleteCriteria: true
      }
    default:
      return state;
  }
}