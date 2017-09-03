// import * as songsSelector from '../selectors/songs';
// let _ = require('underscore-node');

const initialState = {
  currentSong: null,
  currentIndex: -1,
  queue: [],
  showMenu: false,
  isLoading: false,
  randomActive: false,
  playing: false,
  repeatMode: 'NONE'
};

export default function artist(state = initialState, action = {}) {
  let queue = null;
  switch (action.type) {
    case 'APP_STARTING_SUCCESS':
      queue = (action.payload.session && action.payload.session.queue) ? action.payload.session.queue : [];
      let currentSong = action.payload.session ? action.payload.session.currentSong : null;
      let currentIndex = (action.payload.session && action.payload.session.queue && currentSong)
        ? action.payload.session.queue.findIndex(song => song.name === currentSong.name)
        : -1;
      return {
        ...state,
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
      }
    case 'PLAYER_RAMDOM':
      return {
        ...state,
        randomActive: !state.randomActive
      }
    case 'PLAYER_REPEAT':
      let repeatMode = 'NONE';
      switch (state.repeatMode) {
        case 'NONE':
          repeatMode = 'ONE';
          break;
        case 'ONE':
          repeatMode = 'ALL';
          break;
        default:
          repeatMode = 'NONE';
      }
      return {
        ...state,
        repeatMode
      }
    case 'PLAYER_PLAY_PAUSE':
      return {
        ...state,
        playing: !state.playing
      }
    case 'PLAYER_ADD_TO_QUEUE':
      return {
        ...state,
        queue: state.queue.concat(action.payload.queue || [])
      }
    default:
      return state;
  }
}