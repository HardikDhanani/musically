const initialState = {
  isFavorite: false,
  currentSong: null,
  currentIndex: -1,
  elapsedTime: 0,
  queue: [],
  showMenu: false,
  isLoading: false,
  shuffleActive: false,
  playing: false,
  repeatMode: 'NONE'
};

export default function player(state = initialState, action = {}) {
  let queue = null;
  switch (action.type) {
    case 'APP_STARTING_SUCCESS':
      queue = (action.payload.session && action.payload.session.queue) ? action.payload.session.queue : [];
      let currentSong = action.payload.session ? action.payload.session.currentSong : null;
      let currentIndex = (action.payload.session && action.payload.session.queue && currentSong)
        ? action.payload.session.queue.findIndex(song => song.name === currentSong.name)
        : -1;
      let isFavorite = (currentSong && currentSong.isFavorite);
      return {
        ...state,
        isFavorite,
        currentSong,
        currentIndex,
        queue,
        isLoading: false
      }
    case 'PLAYER_LOADING':
      return {
        ...state,
        isLoading: true
      }
    case 'PLAYER_LOADING_SUCCESS':
      return {
        ...state,
        isFavorite: action.payload.currentSong ? action.payload.currentSong.isFavorite : false,
        currentSong: action.payload.currentSong,
        currentIndex: action.payload.currentIndex,
        queue: action.payload.queue,
        isLoading: false,
      }
    case 'PLAYER_SET_MENU':
      return {
        ...state,
        showMenu: !state.showMenu
      }
    case 'PLAYER_SONG_CHANGED':
      return {
        ...state,
        currentSong: action.payload.currentSong,
        currentIndex: action.payload.currentIndex,
        elapsedTime: 0
      }
    case 'PLAYER_RAMDOM':
      return {
        ...state,
        shuffleActive: !state.shuffleActive
      }
    case 'PLAYER_REPEAT':
      let repeatMode = 'NONE';
      switch (state.repeatMode) {
        case 'NONE':
          repeatMode = 'ALL';
          break;
        case 'ONE':
          repeatMode = 'NONE';
          break;
        default:
          repeatMode = 'ONE';
      }
      return {
        ...state,
        repeatMode
      }
    case 'PLAYER_PLAY':
      return {
        ...state,
        playing: true
      }
    case 'PLAYER_PAUSE':
    case 'PLAYER_STOP':
      return {
        ...state,
        playing: false
      }
    case 'PLAYER_TIME_ELAPSED':
      return {
        ...state,
        elapsedTime: action.payload.elapsedTime
      }
    case 'PLAYER_PROGRESS_CHANGED':
      return {
        ...state,
        elapsedTime: action.payload.newElapsed
      }
    case 'PLAYER_ADD_TO_QUEUE':
      return {
        ...state,
        queue: action.payload.queue,
        currentIndex: action.payload.currentIndex,
        currentSong: action.payload.queue[action.payload.currentIndex]
      }
    case 'PLAYER_QUEUE_UPDATED':
      return {
        ...state,
        queue: action.payload.queue,
        currentIndex: action.payload.currentIndex,
        currentSong: action.payload.currentSong,
      }
    case 'FAVORITES_LIKE_SUCCESS':
      if (!state.currentSong || action.payload.type !== 'song')
        return state;

      return {
        ...state,
        isFavorite: action.payload.target.isFavorite
      }
    case 'QUEUE_MOVE_SONG_SUCCESS':
      let index = state.currentIndex;
      if (state.currentSong.id === action.payload.songId) {
        index = action.payload.movedTo;
      }
      return {
        ...state,
        queue: JSON.parse(JSON.stringify(action.payload.queue)),
        currentIndex: index
      }
    case 'QUEUE_REMOVING_SONG_SUCCESS':
      return {
        ...state,
        queue: JSON.parse(JSON.stringify(action.payload.queue))
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