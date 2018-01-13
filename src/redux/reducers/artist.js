const initialState = {
  artist: null,
  name: null,
  cover: null,
  songs: [],
  topSongs: [],
  albums: [],
  relatedArtists: [],
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

export default function artist(state = initialState, action = {}) {
  switch (action.type) {
    case 'ARTIST_LOADING':
      return {
        ...state,
        isLoading: true
      }
    case 'ARTIST_LOADING_SUCCESS':
      let albums = action.payload.artist ? action.payload.artist.albums : [];
      let songs = albums ? [].concat.apply([], albums.map(a => a.songs)) : [];
      topSongs = songs.filter(song => song.reproductions > 0).sort(sortSongsByReproductions);

      return {
        ...state,
        artist: action.payload.artist,
        name: action.payload.artist.artist,
        cover: action.payload.artist.cover,
        songs,
        albums,
        topSongs: topSongs.slice(0, 5),
        isFavorite: action.payload.artist.isFavorite,
        isLoading: false,
        showFiveMore: topSongs.length > 5
      }
    case 'ARTIST_LOADING_ERROR':
      return {
        ...state,
        isLoading: false,
      }
    case 'ARTIST_SHOW_MORE':
      return {
        ...state,
        topSongs: topSongs.slice(0, state.topSongs.length + 5),
        showFiveMore: (state.topSongs.length + 5) < topSongs.length
      }
    case 'FAVORITES_LIKE_SUCCESS':
      return {
        ...state,
        isFavorite: action.payload.type === 'artist' ? action.payload.target.isFavorite : state.isFavorite
      }
    case 'FAVORITES_SONG_UPDATED':
      for (let i = 0; i < state.songs.length; i++) {
        if (state.songs[i].id === action.payload.song.id) {
          state.songs[i] = action.payload.song;
          break;
        }
      }

      for (let i = 0; i < topSongs.length; i++) {
        if (topSongs[i].id === action.payload.song.id) {
          topSongs[i] = action.payload.song;
          break;
        }
      }

      return {
        ...state,
        songs: JSON.parse(JSON.stringify(state.songs)),
        topSongs: JSON.parse(JSON.stringify(topSongs))
      }
    case 'FAVORITES_ALBUM_UPDATED':
      for (let i = 0; i < state.albums.length; i++) {
        if (state.albums[i].id === action.payload.album.id) {
          state.albums[i] = action.payload.album;
          break;
        }
      }

      return {
        ...state,
        albums: JSON.parse(JSON.stringify(state.albums))
      }

    default:
      return state;
  }
}