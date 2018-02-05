import playlist from "../reducers/playlist";

let _setPlaylistLength = (playlists, value, playlistName, sortSongs) => {
  let i = playlists.findIndex(p => p.name === playlistName);
  if (i > -1) {
    let length = value === 0 ? playlists[i].songs.length : value;
    if (!sortSongs) {
      playlists[i].songs = playlists[i].songs.slice(0, length);
    } else {
      playlists[i].songs = playlists[i].songs.sort(sortSongs).slice(0, length);
    }
  }

  return playlists;
}

let playlists = {};

playlists.setMostPlayedLengthOnPlaylists = (playlists, mostPlayedLength) => {
  let sortSongs = (a, b) => {
    if (a.reproductions < b.reproductions) return 1;
    if (a.reproductions > b.reproductions) return -1;
    return 0;
  }

  return _setPlaylistLength(playlists, mostPlayedLength, 'Most played', sortSongs);
}

playlists.setRecentlyPlayedLengthOnPlaylists = (playlists, recentlyPlayedLength) => {
  return _setPlaylistLength(playlists, recentlyPlayedLength, 'Recently played');
}

playlists.filterForAddSong = (playlists) => {
  if (!playlists.length) {
    return [];
  }

  return playlists.filter(playlist => {
    return playlist.name.toLowerCase() !== 'most played'
      && playlist.name.toLowerCase() !== 'favorites'
      && playlist.name.toLowerCase() !== 'recently played';
  });
}

export default playlists;