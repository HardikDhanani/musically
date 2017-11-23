const initialState = {
  isReady: false,
  goHome: false,
  session: null,
  songs: [],
  albums: [],
  artists: [],
  genres: [],
  playlists: [],
  showMenu: false,
  targetMenu: null,
  menuPositionX: null,
  menuPositionY: null
};

export default function app(state = initialState, action = {}) {
  switch (action.type) {
    case 'APP_GO_HOME':
      return {
        ...state,
        goHome: true
      }
    case 'APP_STARTING_SUCCESS':
      return {
        ...state,
        isReady: true,
        session: action.payload.session,
        songs: action.payload.songs,
        albums: action.payload.albums,
        artists: action.payload.artists,
        genres: action.payload.genres,
        playlists: action.payload.playlists
      }
    case 'APP_SET_MENU':
      return {
        ...state,
        showMenu: !state.showMenu,
        targetMenu: action.payload.target,
        menuPositionX: action.payload.positionX,
        menuPositionY: action.payload.positionY,
      }
    case 'APP_SAVING_NEW_PLAYLIST_SUCCEED':
    case 'APP_ADDING_SONG_TO_PLAYLIST_SUCCEED':
    case 'APP_REMOVING_SONG_FROM_PLAYLIST_SUCCEED':
    case 'APP_PLAYLIST_DELETED':
    case 'APP_PLAYLISTS_UPDATED':
      return {
        ...state,
        playlists: JSON.parse(JSON.stringify(action.payload.playlists))
      }
    default:
      return state;
  }
}