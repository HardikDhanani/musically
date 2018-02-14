import songsSelector from '../selectors/songs';

const initialState = {
  artist: null,
  name: null,
  cover: null,
  songs: [],
  topSongs: [],
  albums: [],
  relatedArtists: [],
  playlists: [],
  isLoading: false,
  isFavorite: false,
  showFiveMore: true,
  showSongMenuForm: false,
  targetMenu: null,
  showAddToPlaylistForm: false
};
let topSongs = [];

export default function artist(state = initialState, action = {}) {
  switch (action.type) {
    case 'ARTIST_LOADING':
      return {
        ...state,
        isLoading: true
      }
    case 'ARTIST_LOADING_SUCCESS':
      let albums = action.payload.artist ? action.payload.artist.albums : [];
      albums = JSON.parse(JSON.stringify(albums));

      let songs = albums ? [].concat.apply([], albums.map(a => a.songs)) : [];
      songs = JSON.parse(JSON.stringify(songs));
      topSongs = songsSelector.orderByReproductionsDesc(songs.filter(song => song.reproductions > 0)).slice(0, 5);

      return {
        ...state,
        artist: action.payload.artist,
        name: action.payload.artist.artist,
        cover: action.payload.artist.cover,
        songs,
        albums,
        topSongs,
        isFavorite: action.payload.artist.isFavorite || false,
        isLoading: false,
        showFiveMore: topSongs.length > 5
      }
    case 'ARTIST_PLAYLISTS_LOADED':
      return {
        ...state,
        playlists: action.payload.playlists
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
    case 'ARTIST_SHOW_SONG_MENU':
      return {
        ...state,
        showSongMenuForm: true,
        targetMenu: action.payload.targetMenu
      }
    case 'ARTIST_HIDE_SONG_MENU':
      return {
        ...state,
        showSongMenuForm: false,
        targetMenu: null
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
    case 'ARTIST_SHOW_ADD_TO_PLAYLIST_FORM':
      return {
        ...state,
        showAddToPlaylistForm: true
      }
    case 'ARTIST_HIDE_ADD_TO_PLAYLIST_FORM':
      return {
        ...state,
        showAddToPlaylistForm: false
      }
    default:
      return state;
  }
}