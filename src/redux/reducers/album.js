const initialState = {
  album: null,
  name: null,
  cover: null,
  songs: [],
  topSongs: [],
  relatedAlbums: [],
  isLoading: false,
  isFavorite: false,
  showFiveMore: true
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
      topSongs = songs.filter(song => song.reproductions > 0).sort(sortSongsByReproductions);

      return {
        ...state,
        album: action.payload.album,
        name: action.payload.album.album,
        cover: action.payload.album.cover,
        relatedAlbums: action.payload.relatedAlbums,
        songs,
        topSongs: topSongs.slice(0, 5),
        isFavorite: action.payload.album.isFavorite,
        isLoading: false,
        showFiveMore: topSongs.length > 5
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
    default:
      return state;
  }
}