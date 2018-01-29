const initialState = {
  queue: [],
  queueDelete: [],
  deleteMode: false,
  isLoading: false,
  isRemovingSong: false,
  selectedAll: false,
  selected: 0,
  showConfirmation: false
};

export default function queue(state = initialState, action = {}) {
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
        deleteMode: false,
        queueDelete: [],
        selected: 0,
        selectedAll: false,
        showConfirmation: false,
        queue: JSON.parse(JSON.stringify(action.payload.queue))
      }
    case 'QUEUE_REMOVING_SONG_ERROR':
      return {
        ...state,
        isRemovingSong: false
      }
    case 'PLAYER_ADD_TO_QUEUE':
    case 'QUEUE_MOVE_SONG_SUCCESS':
      return {
        ...state,
        queue: JSON.parse(JSON.stringify(action.payload.queue))
      }
    case 'QUEUE_SET_DELETE_MODE_ON':
      return {
        ...state,
        deleteMode: true,
        queueDelete: state.queue.map(s => {
          return {
            ...s,
            selected: false
          }
        })
      }
    case 'QUEUE_SET_DELETE_MODE_OFF':
      return {
        ...state,
        deleteMode: false,
        queueDelete: [],
        selected: 0,
        selectedAll: false
      }
    case 'QUEUE_SELECT_SONG':
      let selected = 0;
      let newQueueDelete = state.queueDelete.map(s => {
        if (s.id === action.payload.id) {
          s.selected = !s.selected;
        }

        selected += s.selected ? 1 : 0;

        return s;
      });
      return {
        ...state,
        queueDelete: newQueueDelete,
        selectedAll: selected === newQueueDelete.length,
        selected
      }
    case 'QUEUE_SELECT_ALL_PRESSED':
      return {
        ...state,
        selectedAll: !state.selectedAll,
        queueDelete: state.queueDelete.map(s => {
          return {
            ...s,
            selected: !state.selectedAll
          }
        }),
        selected: !state.selectedAll ? state.queueDelete.length : 0
      }
    case 'QUEUE_DELETE_SONGS_CONFIRMATION':
      return {
        ...state,
        showConfirmation: state.selected > 0
      }
    case 'QUEUE_DELETE_SONGS_CANCEL':
      return {
        ...state,
        showConfirmation: false
      }
    case 'FAVORITES_SONG_UPDATED':
      let i = state.queue.findIndex(s => s.id === action.payload.song.id);
      if (i !== -1) {
        state.queue[i] = action.payload.song;
      }

      return {
        ...state,
        queue: JSON.parse(JSON.stringify(state.queue))
      }
    default:
      return state;
  }
}