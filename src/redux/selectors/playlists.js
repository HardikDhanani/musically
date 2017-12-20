let _setPlaylistLength = (playlists, value, playlistName, sortSongs) => {
  let i = playlists.findIndex(p => p.name === playlistName);
  if (i > -1) {
    if (!sortSongs) {
      playlists[i].songs = playlists[i].songs.slice(0, value);
    } else {
      playlists[i].songs = playlists[i].songs.sort(sortSongs).slice(0, value);
    }
  }

  return playlists;
}

let playlists = {};

playlists.setMostPlayedLengthOnPlaylists = (playlists, mostPlayedLength) => {
  let sortSongs = (a, b) => {
    if (a.reproductions < b.reproductions) return -1;
    if (a.reproductions > b.reproductions) return 1;
    return 0;
  }

  return _setPlaylistLength(playlists, mostPlayedLength, 'Most played', sortSongs);
}

playlists.setRecentlyPlayedLengthOnPlaylists = (playlists, recentlyPlayedLength) => {
  return _setPlaylistLength(playlists, recentlyPlayedLength, 'Recently played');
}

export default playlists;