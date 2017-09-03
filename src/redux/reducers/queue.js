import * as songsSelector from '../selectors/songs';

const initialState = {
  queue: [],
  isLoading: false,
  isRemovingSong: false
};

export default function search(state = initialState, action = {}) {
  switch (action.type) {
    case 'QUEUE_LOADING':
      return {
        ...state,
        isLoading: true,
      }
    case 'QUEUE_LOADING_SUCCESS':
      return {
        ...state,
        isLoading: false,
        queue: action.payload.queue
      }
    case 'QUEUE_LOADING_ERROR':
      return {
        ...state,
        isLoading: false,
      }
    case 'QUEUE_REMOVING_SONG':
      return {
        ...state,
        isRemovingSong: true,
      }
    case 'QUEUE_REMOVING_SONG_SUCCESS':
      return {
        ...state,
        isRemovingSong: false,
        queue: action.payload.queue
      }
    case 'QUEUE_REMOVING_SONG_ERROR':
      return {
        ...state,
        isRemovingSong: false
      }
    default:
      return state;
  }
}