const initialState = {
  isLoading: false,
  isRemovingSong: false,
  id: null,
  name: null,
  songs: [],
  topSongs: [],
  showFiveMore: true
};
let topSongs = [];
let sortSongsByReproductions = (a, b) => {
  if (a.reproductions < b.reproductions) return -1;
  if (a.reproductions > b.reproductions) return 1;
  return 0;
}

export default function playlist(state = initialState, action = {}) {
  switch (action.type) {
    case 'PLAYLIST_LOADING':
      return {
        ...state,
        isLoading: true
      }
    case 'PLAYLIST_LOADING_SUCCESS':
      let songs = action.payload.playlist ? action.payload.playlist.songs : [];
      topSongs = songs.filter(song => song.reproductions > 0).sort(sortSongsByReproductions);
      return {
        ...state,
        isLoading: false,
        id: action.payload.playlist.id,
        name: action.payload.playlist.name,
        songs,
        topSongs: topSongs.slice(0, 5),
        showFiveMore: topSongs.length > 5
      }
    case 'PLAYLIST_LOADING_ERROR':
      return {
        ...state,
        isLoading: false,
      }
    case 'PLAYLIST_REMOVING_SONG':
      return {
        ...state,
        isRemovingSong: true
      }
    case 'PLAYLIST_REMOVING_SONG_SUCCESS':
      return {
        ...state,
        isRemovingSong: false,
        songs: JSON.parse(JSON.stringify(action.payload.playlist.songs))
      }
    case 'PLAYLIST_SHOW_MORE':
      return {
        ...state,
        topSongs: topSongs.slice(0, state.topSongs.length + 5),
        showFiveMore: (state.topSongs.length + 5) < topSongs.length
      }
    default:
      return state;
  }
}