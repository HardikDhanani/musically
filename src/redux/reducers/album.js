const initialState = {
  album: {},
  name: '',
  cover: null,
  songs: [],
  topSongs: [],
  relatedAlbums: [],
  playlists: [],
  isLoading: false,
  isFavorite: false,
  showFiveMore: true,
  showSongMenuForm: false,
  targetMenu: null,
  showAddToPlaylistForm: false
};
let topSongs = [];
let sortSongsByReproductions = (a, b) => {
  if (a.reproductions < b.reproductions) return -1;
  if (a.reproductions > b.reproductions) return 1;
  return 0;
}

export default function album(state = initialState, action = {}) {
  switch (action.type) {
    case 'ALBUM_LOADING':
      return {
        ...state,
        isLoading: true
      }
    case 'ALBUM_LOADING_SUCCESS':
      let songs = action.payload.album ? action.payload.album.songs : [];
      songs = JSON.parse(JSON.stringify(songs));
      topSongs = songs.filter(song => song.reproductions > 0).sort(sortSongsByReproductions).slice(0, 5);

      return {
        ...state,
        album: action.payload.album,
        name: action.payload.album.album,
        cover: action.payload.album.cover,
        relatedAlbums: action.payload.relatedAlbums,
        songs,
        topSongs,
        isFavorite: action.payload.album.isFavorite || false,
        isLoading: false,
        showFiveMore: topSongs.length > 5
      }
    case 'ALBUM_PLAYLISTS_LOADED':
      return {
        ...state,
        playlists: action.payload.playlists
      }
    case 'ALBUM_LOADING_ERROR':
      return {
        ...state,
        isLoading: false,
      }
    case 'ALBUM_SHOW_MORE':
      return {
        ...state,
        topSongs: topSongs.slice(0, state.topSongs.length + 5),
        showFiveMore: (state.topSongs.length + 5) < topSongs.length
      }
    case 'ALBUM_SHOW_SONG_MENU':
      return {
        ...state,
        showSongMenuForm: true,
        targetMenu: action.payload.targetMenu
      }
    case 'ALBUM_HIDE_SONG_MENU':
      return {
        ...state,
        showSongMenuForm: false,
        targetMenu: null
      }
    case 'FAVORITES_LIKE_SUCCESS':
      return {
        ...state,
        isFavorite: action.payload.type === 'album' ? action.payload.target.isFavorite : state.isFavorite
      }
    case 'FAVORITES_SONG_UPDATED':
      let i = state.songs.findIndex(s => s.id === action.payload.song.id);
      if (i !== -1) {
        state.songs[i] = action.payload.song;
      }

      i = topSongs.findIndex(s => s.id === action.payload.song.id);
      if (i !== -1) {
        topSongs[i] = action.payload.song;
      }

      return {
        ...state,
        songs: JSON.parse(JSON.stringify(state.songs)),
        topSongs: JSON.parse(JSON.stringify(topSongs))
      }
    case 'ALBUM_SHOW_ADD_TO_PLAYLIST_FORM':
      return {
        ...state,
        showAddToPlaylistForm: true
      }
    case 'ALBUM_HIDE_ADD_TO_PLAYLIST_FORM':
      return {
        ...state,
        showAddToPlaylistForm: false
      }

    default:
      return state;
  }
}